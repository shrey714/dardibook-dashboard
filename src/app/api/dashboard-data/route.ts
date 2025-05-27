import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  collectionGroup,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import {
  addDays,
  endOfDay,
  endOfWeek,
  isSameDay,
  isWithinInterval,
  startOfDay,
  startOfWeek,
  subWeeks,
} from "date-fns";
import {
  utcToZonedTime,
} from "date-fns-tz";
import {
  compare,
  extractNewPatientsDayCounts,
  extractTotalAppointmentsDayCounts,
  extractTotalBillsDayCounts,
  getStartOfDaysBetween,
  sumAmounts,
} from "../../../lib/helpers";
import {
  PharmacyTypes,
  PrescriptionFormTypes,
  RegisterPatientFormTypes,
  DashboardDataTypes,
  OrgBed,
  BedPatient,
  Appointment,
} from "@/types/FormTypes";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const weekDate = searchParams.get("weekDate");
  const timezone = request.headers.get("x-user-timezone") || "UTC";
  const client = await clerkClient();
  const { orgId } = await auth();
  if (!orgId || !weekDate) {
    return NextResponse.json(
      { error: "Missing organization ID or weekDate" },
      { status: 400 }
    );
  }
  if (!timezone) {
    return NextResponse.json(
      { error: "Missing client timezone header" },
      { status: 400 }
    );
  }
  const members = await client.organizations.getOrganizationMembershipList({
    organizationId: orgId,
    limit: 501,
  });


  const DBC = (date: Date | number) => {
    return utcToZonedTime(date, timezone).getTime()
  }


  const referenceDate = new Date(parseInt(weekDate));

  const currentWeekStart = DBC(startOfWeek(referenceDate, {
    weekStartsOn: 1,
  }));
  const currentWeekEnd = isSameDay(DBC(startOfWeek(new Date(), { weekStartsOn: 1 })), referenceDate) ? DBC(endOfDay(new Date())) : DBC(endOfWeek(referenceDate, {
    weekStartsOn: 1,
  }));
  const lastWeekStart = DBC(startOfWeek(subWeeks(referenceDate, 1), {
    weekStartsOn: 1,
  }));
  const lastWeekEnd = DBC(endOfWeek(subWeeks(referenceDate, 1), {
    weekStartsOn: 1,
  }));


  console.log("data----",
    currentWeekStart,
    currentWeekEnd,
    lastWeekStart,
    lastWeekEnd,
  )

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
    const currentWeekBillsQuery = query(
      collection(db, "doctor", orgId, "bills"),

      where("generated_at", ">=", currentWeekStart),
      where("generated_at", "<=", currentWeekEnd)
    );
    const currentWeekPrescriptionsQuery = query(
      collectionGroup(db, "prescriptions"),
      where("orgId", "==", orgId),
      where("created_at", ">=", currentWeekStart),
      where("created_at", "<=", currentWeekEnd)
    );
    const currentWeekPatientsQuery = query(
      collection(db, "doctor", orgId, "patients"),
      where(
        "registered_date",
        "array-contains-any",
        getStartOfDaysBetween(currentWeekStart, currentWeekEnd)
      )
    );
    const lastWeekBillsQuery = query(
      collection(db, "doctor", orgId, "bills"),

      where("generated_at", ">=", lastWeekStart),
      where("generated_at", "<=", lastWeekEnd)
    );
    const lastWeekPrescriptionsQuery = query(
      collectionGroup(db, "prescriptions"),
      where("orgId", "==", orgId),
      where("created_at", ">=", lastWeekStart),
      where("created_at", "<=", lastWeekEnd)
    );
    const lastWeekPatientsQuery = query(
      collection(db, "doctor", orgId, "patients"),
      where(
        "registered_date",
        "array-contains-any",
        getStartOfDaysBetween(lastWeekStart, lastWeekEnd)
      )
    );

    const patientsInBedQuery = query(
      collection(db, "doctor", orgId, "beds"),
      where("dischargeMarked", "==", false)
    );
    const upcomingAppointmentsQuery = query(
      collection(db, "doctor", orgId, "patients"),
      where(
        "registered_date",
        "array-contains-any",
        getStartOfDaysBetween(startOfDay(addDays(new Date(), 1)).getTime(), endOfDay(addDays(new Date(), 14)).getTime())
      )
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
      getDocs(currentWeekBillsQuery),
      getDocs(lastWeekBillsQuery),
      getDocs(currentWeekPrescriptionsQuery),
      getDocs(lastWeekPrescriptionsQuery),
      getDocs(currentWeekPatientsQuery),
      getDocs(lastWeekPatientsQuery),
      getDocs(patientsInBedQuery),
      getDocs(upcomingAppointmentsQuery)
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
      const data = doc.data() as RegisterPatientFormTypes
      return {
        patientId: data.patient_id,
        name: data.name,
        dateTime: data.registered_date_time.find((date_time) => date_time >= startOfDay(addDays(new Date(), 1)).getTime()),
        registeredFor: data.registerd_for.name,
      } as Appointment
    })

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
            currentWeekEnd
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
            currentWeekEnd
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
            currentWeekEnd
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
            currentWeekEnd
          ).map((_, i) =>
            currentWeekBillsSnap.docs
              .filter((doc: any) => {
                const day = startOfDay(
                  new Date(doc.data().generated_at)
                ).getTime();
                return (
                  day ===
                  getStartOfDaysBetween(currentWeekStart, currentWeekEnd)[i]
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
