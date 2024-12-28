import { storage } from "@/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const uploadFile = async (file: File, path: string) => {
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
};

export const createDoctor = async (req: any) => {
    try {
        let tempFormData = req.formData

        let clinicLogoUrl = ""
        let signaturePhotoUrl = ""
        if (tempFormData?.clinicLogo) {
            clinicLogoUrl = await uploadFile(
                tempFormData.clinicLogo,
                `clinicLogos/${req.uid}`
            );
            tempFormData = { ...tempFormData, clinicLogo: clinicLogoUrl };
        }

        if (tempFormData?.signaturePhoto) {
            signaturePhotoUrl = await uploadFile(
                tempFormData.signaturePhoto,
                `signaturePhotos/${req.uid}/`
            );
            tempFormData = { ...tempFormData, signaturePhoto: signaturePhotoUrl };
        }


        const res = await fetch(`/api/create-doctor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                
            },
            body: JSON.stringify({ uid: req.uid, formData: tempFormData })
        });
        const data = await res.json();
        return { ...data, status: res?.status };
    } catch (error) {
        return { error: error };
    }
};