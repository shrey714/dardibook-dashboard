import { auth } from "@/firebase/firebaseConfig";

export const getPatientById = async (id: string, uid: string) => {
    try {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;
        const res = await fetch(`/api/get-patient?id=${id}&uid=${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        return { error: error };
    }
};
