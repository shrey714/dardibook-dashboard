import { auth } from "@/firebase/firebaseConfig";

export const RegisterPatient = async (req: any) => {
    try {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;
        const res = await fetch(`/api/register-patient`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify(req),
        });
        const data = await res.json();
        return { ...data, status: res?.status };
    } catch (error) {
        return { error: error }
    }

}