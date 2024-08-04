export const getDocotr = async (uid: string) => {
    try {
        const doctorRes = await fetch(`/api/get-doctor?uid=${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await doctorRes.json();
        return data;
    } catch (error) {
        return { error: error };
    }
};
