

export const getDiseases = async (uid: string) => {
    try {
        const res = await fetch(`/api/crud-disease?uid=${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',

            },
        });
        const data = await res.json();
        return { ...data, status: res?.status };
    } catch (error) {
        return { error: error };
    }
}
