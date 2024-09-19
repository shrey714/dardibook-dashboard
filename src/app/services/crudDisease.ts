export const addDisease = async (diseaseData: any, uid: string) => {
    try {
        const res = await fetch(`/api/crud-disease?uid=${uid}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(diseaseData)
        });
        const data = await res.json();
        return { ...data, status: res?.status };
    } catch (error) {
        return { error: error };
    }
}

export const getDiseases = async (uid: string) => {
    try {
        const res = await fetch(`/api/crud-disease?uid=${uid}`, {
            method: 'GET',
        });
        const data = await res.json();
        return { ...data, status: res?.status };
    } catch (error) {
        return { error: error };
    }
}

export const delDisease = async (id: string, uid: string) => {
    try {
        const res = await fetch(`/api/crud-disease?uid=${uid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id })
        });
        const data = await res.json();
        return { ...data, status: res?.status };
    } catch (error) {
        return { error: error };
    }
}