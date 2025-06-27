import { NextResponse, NextRequest } from "next/server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  addDays,
  endOfWeek,
  isWithinInterval,
  startOfDay,
  startOfWeek,
  subWeeks,
} from "date-fns";
import {
  compare,
  extractNewPatientsDayCounts,
  extractTotalAppointmentsDayCounts,
  extractTotalBillsDayCounts,
  getStartOfDaysBetween,
  getUpcomingDatesRange,
  sumAmounts,
} from "@/lib/DashboardHelpers";
import {
  PharmacyTypes,
  PrescriptionFormTypes,
  RegisterPatientFormTypes,
  DashboardDataTypes,
  OrgBed,
  BedPatient,
  Appointment,
} from "@/types/FormTypes";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { adminDb } from "@/server/firebaseAdmin";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const weekDate = searchParams.get("weekDate");
  const timezone = request.headers.get('x-vercel-ip-timezone') || "Asia/Kolkata"
  const client = await clerkClient();
  const { orgId } = await auth();
  if (!orgId || !weekDate) {
    return NextResponse.json(
      { error: "Missing organization ID or weekDate" },
      { status: 400 }
    );
  }
  const members = await client.organizations.getOrganizationMembershipList({
    organizationId: orgId,
    limit: 501,
  });

  const referenceDate = utcToZonedTime(Number(weekDate), timezone);

  const currentWeekStart = zonedTimeToUtc(
    startOfWeek(referenceDate, { weekStartsOn: 1 }),
    timezone
  ).getTime();
  const currentWeekEnd = zonedTimeToUtc(
    endOfWeek(referenceDate, { weekStartsOn: 1 }),
    timezone
  ).getTime();
  const lastWeekStart = zonedTimeToUtc(
    startOfWeek(subWeeks(referenceDate, 1), { weekStartsOn: 1 }),
    timezone
  ).getTime();
  const lastWeekEnd = zonedTimeToUtc(
    endOfWeek(subWeeks(referenceDate, 1), { weekStartsOn: 1 }),
    timezone
  ).getTime();

  const doctors = members.data
    .filter(
      (member) =>
        (member.role === "org:doctor" || member.role === "org:clinic_head") &&
        member.publicUserData
    )
    .map((member) => ({
      id: member.publicUserData?.userId as string,
      name: [member.publicUserData?.firstName, member.publicUserData?.lastName]
        .filter(Boolean)
        .join(" "),
    }));

  try {
    const currentWeekBillsQuery = adminDb
      .collection("doctor")
      .doc(orgId)
      .collection("bills")
      .where("generated_at", ">=", currentWeekStart)
      .where("generated_at", "<=", currentWeekEnd);

    const currentWeekPrescriptionsQuery = adminDb
      .collectionGroup("prescriptions")
      .where("orgId", "==", orgId)
      .where("created_at", ">=", currentWeekStart)
      .where("created_at", "<=", currentWeekEnd);

    const currentWeekPatientsQuery = adminDb
      .collection("doctor")
      .doc(orgId)
      .collection("patients")
      .where(
        "registered_date",
        "array-contains-any",
        getStartOfDaysBetween(currentWeekStart, currentWeekEnd, timezone)
      );

    const lastWeekBillsQuery = adminDb
      .collection("doctor")
      .doc(orgId)
      .collection("bills")
      .where("generated_at", ">=", lastWeekStart)
      .where("generated_at", "<=", lastWeekEnd);

    const lastWeekPrescriptionsQuery = adminDb
      .collectionGroup("prescriptions")
      .where("orgId", "==", orgId)
      .where("created_at", ">=", lastWeekStart)
      .where("created_at", "<=", lastWeekEnd);

    const lastWeekPatientsQuery = adminDb
      .collection("doctor")
      .doc(orgId)
      .collection("patients")
      .where(
        "registered_date",
        "array-contains-any",
        getStartOfDaysBetween(lastWeekStart, lastWeekEnd, timezone)
      );

    const patientsInBedQuery = adminDb
      .collection("doctor")
      .doc(orgId)
      .collection("beds")
      .where("dischargeMarked", "==", false);

    const upcomingAppointmentsQuery = adminDb
      .collection("doctor")
      .doc(orgId)
      .collection("patients")
      .where(
        "registered_date",
        "array-contains-any",
        getUpcomingDatesRange(1, 14, timezone)
      );

    const [
      currentWeekBillsSnap,
      lastWeekBillsSnap,
      currentWeekPrescriptionsSnap,
      lastWeekPrescriptionsSnap,
      currentWeekPatientsSnap,
      lastWeekPatientsSnap,
      patientsInBedSnap,
      upcomingAppointmentsSnap
    ] = await Promise.all([
      currentWeekBillsQuery.get(),
      lastWeekBillsQuery.get(),
      currentWeekPrescriptionsQuery.get(),
      lastWeekPrescriptionsQuery.get(),
      currentWeekPatientsQuery.get(),
      lastWeekPatientsQuery.get(),
      patientsInBedQuery.get(),
      upcomingAppointmentsQuery.get()
    ]);


    const currentPatients = currentWeekPatientsSnap.docs.map(
      (doc) => doc.data() as RegisterPatientFormTypes
    );
    const currentPatientsSize = currentWeekPatientsSnap.size;
    // const lastPatients = lastWeekPatientsSnap.docs.map(
    //   (doc) => doc.data() as RegisterPatientFormTypes
    // );
    const lastPatientsSize = lastWeekPatientsSnap.size;
    const currentPrescriptions = currentWeekPrescriptionsSnap.docs.map(
      (doc) => doc.data() as PrescriptionFormTypes
    );
    const currentPrescriptionsSize = currentWeekPrescriptionsSnap.size;
    const lastPrescriptions = lastWeekPrescriptionsSnap.docs.map(
      (doc) => doc.data() as PrescriptionFormTypes
    );
    const lastPrescriptionsSize = lastWeekPrescriptionsSnap.size;
    const currentBills = currentWeekBillsSnap.docs.map(
      (doc) => doc.data() as PharmacyTypes
    );
    const currentBillsSize = currentWeekBillsSnap.size;
    const lastBills = lastWeekBillsSnap.docs.map(
      (doc) => doc.data() as PharmacyTypes
    );
    const lastBillsSize = lastWeekBillsSnap.size;
    const patientsInBed = patientsInBedSnap.docs.map((doc) => {
      const data = doc.data() as OrgBed
      return {
        bedBookingId: data.bedBookingId,
        bedId: data.bedId,
        patientId: data.patient_id,
        admissionAt: data.admission_at,
        dischargeAt: data.discharge_at,
        admissionFor: data.admission_for.name,
      } as BedPatient
    })
    const upcomingAppointments = upcomingAppointmentsSnap.docs.map((doc) => {
      const data = doc.data() as RegisterPatientFormTypes;
      return {
        patientId: data.patient_id,
        name: data.name,
        dateTime: data.registered_date_time.find(
          (date_time) => date_time >= zonedTimeToUtc(
            startOfDay(utcToZonedTime(addDays(new Date(), 1), timezone)),
            timezone
          ).getTime()
        ),
        registeredFor: data.registerd_for.name,
      } as Appointment;
    });

    const DashboardData: DashboardDataTypes = {
      compareStats: {
        newPatients: {
          title: "New Patients",
          info: "Patients registered this week",
          count: currentPatients.filter(
            (patient) =>
              patient.registered_date.length === 1 &&
              isWithinInterval(patient.registered_date[0], {
                start: currentWeekStart,
                end: currentWeekEnd,
              })
          ).length,
          dayCount: extractNewPatientsDayCounts(
            currentPatients.filter(
              (patient) =>
                patient.registered_date.length === 1 &&
                isWithinInterval(patient.registered_date[0], {
                  start: currentWeekStart,
                  end: currentWeekEnd,
                })
            ),
            currentWeekStart,
            currentWeekEnd,
            timezone
          ),
          ...compare(currentPatientsSize, lastPatientsSize),
        },
        totalAppointments: {
          title: "Appointments",
          info: "Prescriptions made this week",
          count: currentPrescriptionsSize,
          dayCount: extractTotalAppointmentsDayCounts(
            currentPrescriptions,
            "created_at",
            currentWeekStart,
            currentWeekEnd,
            timezone
          ),
          ...compare(currentPrescriptionsSize, lastPrescriptionsSize),
        },
        totalBills: {
          title: "Bills Generated",
          info: "Bills created this week",
          count: currentBillsSize,
          dayCount: extractTotalBillsDayCounts(
            currentBills,
            "generated_at",
            currentWeekStart,
            currentWeekEnd,
            timezone
          ),
          ...compare(currentBillsSize, lastBillsSize),
        },
        totalRevenue: {
          title: "Total Revenue",
          info: "Revenue from bills",
          count: sumAmounts(currentBills),
          dayCount: extractTotalBillsDayCounts(
            currentBills,
            "generated_at",
            currentWeekStart,
            currentWeekEnd,
            timezone
          ).map((_, i) =>
            currentWeekBillsSnap.docs
              .filter((doc: any) => {
                const day = zonedTimeToUtc(startOfDay(
                  utcToZonedTime(
                    new Date(doc.data().generated_at), timezone)
                ), timezone).getTime();
                return (
                  day ===
                  getStartOfDaysBetween(currentWeekStart, currentWeekEnd, timezone)[i]
                );
              })
              .reduce((sum, doc) => sum + (doc.data().total_amount || 0), 0)
          ),
          ...compare(sumAmounts(currentBills), sumAmounts(lastBills)),
        },
      },
      doctorWeeklyComparison: {
        title: "Doctor-wise Appointments",
        desc: "Comparing current week vs. last week appointments",
        dayCount: doctors.map((doctor) => ({
          doctor: doctor.name,
          currentWeek: currentPrescriptions.filter(
            (pres) => pres.prescribed_by.id === doctor.id
          ).length,
          lastWeek: lastPrescriptions.filter(
            (pres) => pres.prescribed_by.id === doctor.id
          ).length,
        })),
      },
      patientsInBed: patientsInBed,
      upcomingAppointments: upcomingAppointments,
      recentActivities: [],
    };

    return NextResponse.json({ data: DashboardData }, { status: 200 });
  } catch (error) {
    console.log("Error fetching subscription data:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
};
