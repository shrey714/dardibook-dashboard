export const getDateFromTimeStamp = (ts: string | number | Date) => {
    const timestamp = new Date(ts);
    return timestamp.getDate();
}