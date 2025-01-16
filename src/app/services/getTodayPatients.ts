
export const getTodayPatients = async (uid: string, date?: Date) => {
    try {
        const url = date ? `/api/get-today-patients?uid=${uid}&date=${date}` : `/api/get-today-patients?uid=${uid}`;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',

            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        return { error: error };
    }
};