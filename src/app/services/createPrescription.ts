
export const createPrescription = async (req: any) => {
    try {
        const res = await fetch(`/api/create-prescription`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify(req)
        });
        const data = await res.json();
        return { ...data, status: res?.status };
    } catch (error) {
        return { error: error };
    }
};