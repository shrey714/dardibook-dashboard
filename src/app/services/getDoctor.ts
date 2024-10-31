import { auth } from "@/firebase/firebaseConfig";

export const getDocotr = async (uid: string) => {
    try {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;
        const doctorRes = await fetch(`/api/get-doctor?uid=${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await doctorRes.json();
        return data;
    } catch (error) {
        return { error: error };
    }
};
