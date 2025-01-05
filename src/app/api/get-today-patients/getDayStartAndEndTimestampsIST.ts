// export function getDayStartAndEndTimestampsIST(
//     currentTimestamp: string | number | Date
// ) {

//     // Convert the current timestamp to a Date object
//     const now = new Date(currentTimestamp);

//     // Convert current time to IST
//     const istTime = new Date(now.getTime());

//     // Get the start of the day in IST
//     const dayStartIST = new Date(
//         istTime.getFullYear(),
//         istTime.getMonth(),
//         istTime.getDate(),
//         0,
//         0,
//         0,
//         0
//     );

//     // Get the end of the day in IST
//     const dayEndIST = new Date(
//         istTime.getFullYear(),
//         istTime.getMonth(),
//         istTime.getDate(),
//         23,
//         59,
//         59,
//         999
//     );

//     const dayStartUTC = dayStartIST.getTime();
//     const dayEndUTC = dayEndIST.getTime();

//     return {
//         dayStart: dayStartUTC,
//         dayEnd: dayEndUTC,
//     };
// }

import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { startOfDay, endOfDay } from "date-fns"
export function getDayStartAndEndTimestampsIST(currentTimestamp: string | number | Date) {
    const timeZone = "Asia/Calcutta"; // IST timezone

    const currentDate = utcToZonedTime(new Date(currentTimestamp), timeZone);

    const dayStartIST = startOfDay(currentDate);
    const dayEndIST = endOfDay(currentDate);

    return {
        dayStart: zonedTimeToUtc(dayStartIST, timeZone).getTime(), // Convert to UTC timestamp
        dayEnd: zonedTimeToUtc(dayEndIST, timeZone).getTime(),     // Convert to UTC timestamp
    };
}
