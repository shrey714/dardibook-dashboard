export const getDateFromTimeStamp = (ts)=>{
    const timestamp = new Date(ts);
    return timestamp.getDate();
}