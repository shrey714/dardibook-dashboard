export const getPatientById = async (id: string, uid: string) => {
    try {
        const res = await fetch(`/api/get-patient?id=${id}&uid=${uid}`, {
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
