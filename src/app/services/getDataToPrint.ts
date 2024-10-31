import { auth } from "@/firebase/firebaseConfig";

const getDataToPrint = async (uid: string, id: string) => {
    try {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;
        const patientRes = await fetch(`/api/get-patient?id=${id}&uid=${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const patientData = await patientRes.json();
        const doctorRes = await fetch(`/api/get-doctor?uid=${uid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        const doctorData = await doctorRes.json();
        return { patientData, doctorData, status: patientRes.status === 200 && doctorRes.status === 200 ? 200 : 500 }
    } catch (error) {
        return { error: error };
    }
}

export default getDataToPrint;