"use server"

import { PharmacyTypes, PrescriptionFormTypes, RegisterPatientFormTypes } from '@/types/FormTypes';
import { startOfDay, addDays, isAfter } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { clerkClient } from "@clerk/nextjs/server";
import {
    endOfWeek,
    isWithinInterval,
    startOfWeek,
    subWeeks,
} from "date-fns";
import {
    DashboardDataTypes,
    OrgBed,
    BedPatient,
    Appointment,
} from "@/types/FormTypes";
import { adminDb } from "@/server/firebaseAdmin";

/**
 * Returns an array of start-of-day timestamps (in milliseconds)
 * between two milliseconds timestamps (inclusive).
 * @param {number} startMs - Start time in milliseconds
 * @param {number} endMs - End time in milliseconds
 * @returns {number[]} Array of start-of-day timestamps in ms
 */
function getStartOfDaysBetween(startMs: number, endMs: number, timezone: string): number[] {
    const result: number[] = [];

    // Convert start/end to Date objects in target timezone
    let current = startOfDay(utcToZonedTime(new Date(startMs), timezone));
    const final = startOfDay(utcToZonedTime(new Date(endMs), timezone));

    while (!isAfter(current, final)) {
        // Convert zoned startOfDay to UTC timestamp
        result.push(zonedTimeToUtc(current, timezone).getTime());
        current = addDays(current, 1);
    }

    return result;
}

const compare = (current: number, prev: number): { percentage: number; status: "increase" | "decrease" } => {
    if (prev === 0) return { percentage: 100, status: "increase" };
    const change = ((current - prev) / prev) * 100;
    return {
        percentage: Math.abs(Math.round(change)),
        status: change >= 0 ? "increase" : "decrease",
    };
};


const extractNewPatientsDayCounts = (snapData: RegisterPatientFormTypes[], lastWeekStart: number, currentWeekEnd: number, timezone: string) => {
    const counts: Record<number, number> = {};
    for (const doc of snapData) {
        const value = doc.registered_date[0];
        const day = zonedTimeToUtc(startOfDay(utcToZonedTime(new Date(value), timezone)), timezone).getTime();
        counts[day] = (counts[day] || 0) + 1;
    }
    const allDays = getStartOfDaysBetween(lastWeekStart, currentWeekEnd, timezone);
    return allDays.map((d) => counts[d] || 0);
};


const extractTotalAppointmentsDayCounts = (snapData: PrescriptionFormTypes[], field: keyof PrescriptionFormTypes, lastWeekStart: number, currentWeekEnd: number, timezone: string) => {
    const counts: Record<number, number> = {};
    for (const doc of snapData) {
        const value = doc[field] as number;
        const day = zonedTimeToUtc(startOfDay(utcToZonedTime(new Date(value), timezone)), timezone).getTime();
        counts[day] = (counts[day] || 0) + 1;
    }
    const allDays = getStartOfDaysBetween(lastWeekStart, currentWeekEnd, timezone);
    return allDays.map((d) => counts[d] || 0);
};

const extractTotalBillsDayCounts = (snapData: PharmacyTypes[], field: keyof PharmacyTypes, lastWeekStart: number, currentWeekEnd: number, timezone: string) => {
    const counts: Record<number, number> = {};
    for (const doc of snapData) {
        const value = doc[field] as number;
        const day = zonedTimeToUtc(startOfDay(utcToZonedTime(new Date(value), timezone)), timezone).getTime();
        counts[day] = (counts[day] || 0) + 1;
    }
    const allDays = getStartOfDaysBetween(lastWeekStart, currentWeekEnd, timezone);
    return allDays.map((d) => counts[d] || 0);
};

const sumAmounts = (snapData: PharmacyTypes[]) =>
    Math.round(snapData.reduce((acc: number, doc: PharmacyTypes) => acc + (doc.total_amount || 0), 0));

function getUpcomingDatesRange(fromDays: number, toDays: number, timezone: string) {
    const today = utcToZonedTime(new Date(), timezone);
    const from = addDays(today, fromDays);
    const to = addDays(today, toDays);
    return getStartOfDaysBetween(from.getTime(), to.getTime(), timezone);
}

// =============================================

export async function getDashboardData(orgId: string, weekDate: number, timezone = "Asia/Kolkata") {
    if (!orgId || !weekDate) {
        throw new Error("Missing organization ID or weekDate");
    }

    const client = await clerkClient();
    const members = await client.organizations.getOrganizationMembershipList({
        organizationId: orgId,
        limit: 501,
    });

    const referenceDate = utcToZonedTime(Number(weekDate), timezone);
    const currentWeekStart = zonedTimeToUtc(startOfWeek(referenceDate, { weekStartsOn: 1 }), timezone).getTime();
    const currentWeekEnd = zonedTimeToUtc(endOfWeek(referenceDate, { weekStartsOn: 1 }), timezone).getTime();
    const lastWeekStart = zonedTimeToUtc(startOfWeek(subWeeks(referenceDate, 1), { weekStartsOn: 1 }), timezone).getTime();
    const lastWeekEnd = zonedTimeToUtc(endOfWeek(subWeeks(referenceDate, 1), { weekStartsOn: 1 }), timezone).getTime();

    const doctors = members.data
        .filter((member) => (member.role === "org:doctor" || member.role === "org:clinic_head") && member.publicUserData)
        .map((member) => ({
            id: member.publicUserData?.userId as string,
            name: [member.publicUserData?.firstName, member.publicUserData?.lastName].filter(Boolean).join(" "),
        }));

    const currentWeekBillsQuery = adminDb.collection("doctor").doc(orgId).collection("bills")
        .where("generated_at", ">=", currentWeekStart).where("generated_at", "<=", currentWeekEnd);

    const currentWeekPrescriptionsQuery = adminDb.collectionGroup("prescriptions")
        .where("orgId", "==", orgId).where("created_at", ">=", currentWeekStart).where("created_at", "<=", currentWeekEnd);

    const currentWeekPatientsQuery = adminDb.collection("doctor").doc(orgId).collection("patients")
        .where("registered_date", "array-contains-any", getStartOfDaysBetween(currentWeekStart, currentWeekEnd, timezone));

    const lastWeekBillsQuery = adminDb.collection("doctor").doc(orgId).collection("bills")
        .where("generated_at", ">=", lastWeekStart).where("generated_at", "<=", lastWeekEnd);

    const lastWeekPrescriptionsQuery = adminDb.collectionGroup("prescriptions")
        .where("orgId", "==", orgId).where("created_at", ">=", lastWeekStart).where("created_at", "<=", lastWeekEnd);

    const lastWeekPatientsQuery = adminDb.collection("doctor").doc(orgId).collection("patients")
        .where("registered_date", "array-contains-any", getStartOfDaysBetween(lastWeekStart, lastWeekEnd, timezone));

    const patientsInBedQuery = adminDb.collection("doctor").doc(orgId).collection("beds")
        .where("dischargeMarked", "==", false);

    const upcomingAppointmentsQuery = adminDb.collection("doctor").doc(orgId).collection("patients")
        .where("registered_date", "array-contains-any", getUpcomingDatesRange(1, 14, timezone));

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

    const currentPatients = currentWeekPatientsSnap.docs.map((doc) => doc.data() as RegisterPatientFormTypes);
    const lastPatientsSize = lastWeekPatientsSnap.size;
    const currentPrescriptions = currentWeekPrescriptionsSnap.docs.map((doc) => doc.data() as PrescriptionFormTypes);
    const lastPrescriptions = lastWeekPrescriptionsSnap.docs.map((doc) => doc.data() as PrescriptionFormTypes);
    const currentBills = currentWeekBillsSnap.docs.map((doc) => doc.data() as PharmacyTypes);
    const lastBills = lastWeekBillsSnap.docs.map((doc) => doc.data() as PharmacyTypes);

    const patientsInBed = patientsInBedSnap.docs.map((doc) => {
        const data = doc.data() as OrgBed;
        return {
            bedBookingId: data.bedBookingId,
            bedId: data.bedId,
            patientId: data.patient_id,
            admissionAt: data.admission_at,
            dischargeAt: data.discharge_at,
            admissionFor: data.admission_for.name,
        } as BedPatient;
    });

    const upcomingAppointments = upcomingAppointmentsSnap.docs.map((doc) => {
        const data = doc.data() as RegisterPatientFormTypes;
        return {
            patientId: data.patient_id,
            name: data.name,
            dateTime: data.registered_date_time.find(
                (date_time) => date_time >= zonedTimeToUtc(startOfDay(utcToZonedTime(addDays(new Date(), 1), timezone)), timezone).getTime()
            ),
            registeredFor: data.registerd_for.name,
        } as Appointment;
    });

    const DashboardData: DashboardDataTypes = {
        compareStats: {
            newPatients: {
                title: "New Patients",
                info: "Patients registered this week",
                count: currentPatients.filter((p) => p.registered_date.length === 1 && isWithinInterval(p.registered_date[0], {
                    start: currentWeekStart,
                    end: currentWeekEnd,
                })).length,
                dayCount: extractNewPatientsDayCounts(
                    currentPatients.filter((p) => p.registered_date.length === 1 && isWithinInterval(p.registered_date[0], {
                        start: currentWeekStart,
                        end: currentWeekEnd,
                    })),
                    currentWeekStart,
                    currentWeekEnd,
                    timezone
                ),
                ...compare(currentWeekPatientsSnap.size, lastPatientsSize),
            },
            totalAppointments: {
                title: "Appointments",
                info: "Prescriptions made this week",
                count: currentPrescriptions.length,
                dayCount: extractTotalAppointmentsDayCounts(currentPrescriptions, "created_at", currentWeekStart, currentWeekEnd, timezone),
                ...compare(currentPrescriptions.length, lastPrescriptions.length),
            },
            totalBills: {
                title: "Bills Generated",
                info: "Bills created this week",
                count: currentBills.length,
                dayCount: extractTotalBillsDayCounts(currentBills, "generated_at", currentWeekStart, currentWeekEnd, timezone),
                ...compare(currentBills.length, lastBills.length),
            },
            totalRevenue: {
                title: "Total Revenue",
                info: "Revenue from bills",
                count: sumAmounts(currentBills),
                dayCount: extractTotalBillsDayCounts(currentBills, "generated_at", currentWeekStart, currentWeekEnd, timezone).map((_, i) =>
                    currentWeekBillsSnap.docs
                        .filter((doc) => {
                            const day = zonedTimeToUtc(startOfDay(utcToZonedTime(new Date(doc.data().generated_at), timezone)), timezone).getTime();
                            return day === getStartOfDaysBetween(currentWeekStart, currentWeekEnd, timezone)[i];
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
                currentWeek: currentPrescriptions.filter((pres) => pres.prescribed_by.id === doctor.id).length,
                lastWeek: lastPrescriptions.filter((pres) => pres.prescribed_by.id === doctor.id).length,
            })),
        },
        patientsInBed,
        upcomingAppointments,
        recentActivities: [],
    };

    return DashboardData;
}
