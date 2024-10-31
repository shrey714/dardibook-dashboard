import { auth } from "@/firebase/firebaseConfig";

export const getAllPatients = async (doctorId: string) => {
    try {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;
        const res = await fetch(`/api/get-all-patients?doctorId=${doctorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching patients:", error);
        return { error: error };
    }
};
