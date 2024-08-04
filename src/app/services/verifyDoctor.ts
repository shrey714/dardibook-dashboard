import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig"; // Make sure this path is correct

export const checkVerifiedField = async (doctorId: string) => {
    try {
        const doctorDocRef = doc(db, "doctor", doctorId);
        const doctorDoc = await getDoc(doctorDocRef);

        if (!doctorDoc.exists()) {
            console.log("No such document!");
            return { exists: false, verified: null };
        }

        const doctorData = doctorDoc.data();
        const isVerified = doctorData?.verified;

        return { exists: true, verified: isVerified };
    } catch (error) {
        console.error("Error checking 'verified' field:", error);
        throw error;
    }
};