import { auth } from "@/firebase/firebaseConfig";

export const getAllPatients = async (doctorId: string, from: number, to: number) => {
    try {
        const user = auth?.currentUser;
        const token = user ? await user?.getIdToken() : null;
        const res = await fetch(`/api/get-all-patients?doctorId=${doctorId}&from=${from}&to=${to}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching patients:", error);
        return { error: error };
    }
};