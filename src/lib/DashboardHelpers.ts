import { PharmacyTypes, PrescriptionFormTypes, RegisterPatientFormTypes } from '@/types/FormTypes';
import { startOfDay, addDays, isAfter } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

/**
 * Returns an array of start-of-day timestamps (in milliseconds)
 * between two milliseconds timestamps (inclusive).
 * @param {number} startMs - Start time in milliseconds
 * @param {number} endMs - End time in milliseconds
 * @returns {number[]} Array of start-of-day timestamps in ms
 */
export function getStartOfDaysBetween(startMs: number, endMs: number, timezone: string): number[] {
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

export const compare = (current: number, prev: number): { percentage: number; status: "increase" | "decrease" } => {
    if (prev === 0) return { percentage: 100, status: "increase" };
    const change = ((current - prev) / prev) * 100;
    return {
        percentage: Math.abs(Math.round(change)),
        status: change >= 0 ? "increase" : "decrease",
    };
};


export const extractNewPatientsDayCounts = (snapData: RegisterPatientFormTypes[], lastWeekStart: number, currentWeekEnd: number, timezone: string) => {
    const counts: Record<number, number> = {};
    for (const doc of snapData) {
        const value = doc.registered_date[0];
        const day = zonedTimeToUtc(startOfDay(utcToZonedTime(new Date(value), timezone)), timezone).getTime();
        counts[day] = (counts[day] || 0) + 1;
    }
    const allDays = getStartOfDaysBetween(lastWeekStart, currentWeekEnd, timezone);
    return allDays.map((d) => counts[d] || 0);
};


export const extractTotalAppointmentsDayCounts = (snapData: PrescriptionFormTypes[], field: keyof PrescriptionFormTypes, lastWeekStart: number, currentWeekEnd: number, timezone: string) => {
    const counts: Record<number, number> = {};
    for (const doc of snapData) {
        const value = doc[field] as number;
        const day = zonedTimeToUtc(startOfDay(utcToZonedTime(new Date(value), timezone)), timezone).getTime();
        counts[day] = (counts[day] || 0) + 1;
    }
    const allDays = getStartOfDaysBetween(lastWeekStart, currentWeekEnd, timezone);
    return allDays.map((d) => counts[d] || 0);
};

export const extractTotalBillsDayCounts = (snapData: PharmacyTypes[], field: keyof PharmacyTypes, lastWeekStart: number, currentWeekEnd: number, timezone: string) => {
    const counts: Record<number, number> = {};
    for (const doc of snapData) {
        const value = doc[field] as number;
        const day = zonedTimeToUtc(startOfDay(utcToZonedTime(new Date(value), timezone)), timezone).getTime();
        counts[day] = (counts[day] || 0) + 1;
    }
    const allDays = getStartOfDaysBetween(lastWeekStart, currentWeekEnd, timezone);
    return allDays.map((d) => counts[d] || 0);
};

export const sumAmounts = (snapData: PharmacyTypes[]) =>
    Math.round(snapData.reduce((acc: number, doc: PharmacyTypes) => acc + (doc.total_amount || 0), 0));

export function getUpcomingDatesRange(fromDays: number, toDays: number, timezone: string) {
    const today = utcToZonedTime(new Date(), timezone);
    const from = addDays(today, fromDays);
    const to = addDays(today, toDays);
    return getStartOfDaysBetween(from.getTime(), to.getTime(), timezone);
}