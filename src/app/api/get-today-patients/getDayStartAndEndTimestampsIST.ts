export function getDayStartAndEndTimestampsIST(
    currentTimestamp: string | number | Date
) {
    // Convert the current timestamp to a Date object
    const now = new Date(currentTimestamp);

    // Convert current time to IST
    const istTime = new Date(now.getTime());

    // Get the start of the day in IST
    const dayStartIST = new Date(
        istTime.getFullYear(),
        istTime.getMonth(),
        istTime.getDate(),
        0,
        0,
        0,
        0
    );

    // Get the end of the day in IST
    const dayEndIST = new Date(
        istTime.getFullYear(),
        istTime.getMonth(),
        istTime.getDate(),
        23,
        59,
        59,
        999
    );

    const dayStartUTC = dayStartIST.getTime();
    const dayEndUTC = dayEndIST.getTime();

    return {
        dayStart: dayStartUTC,
        dayEnd: dayEndUTC,
    };
}