import { storage } from "@/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const uploadFile = async (file: File, path: string) => {
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
};

type formData = {
    clinicName: string;
    doctorName: string;
    degree: string;
    registrationNumber: string;
    clinicNumber: string;
    phoneNumber: string;
    clinicAddress: string;
    clinicLogo: File | null;
    signaturePhoto: File | null;
}

export const createOrganization = async (formData: formData) => {
    try {
        let signaturePhotoUrl = ""

        if (formData?.signaturePhoto) {
            signaturePhotoUrl = await uploadFile(
                formData.signaturePhoto as unknown as File,
                `signaturePhotos/`
            );
        }


        const backendFormData = new FormData();
        backendFormData.append("clinicName", formData.clinicName);
        backendFormData.append("doctorName", formData.doctorName);
        backendFormData.append("degree", formData.degree);
        backendFormData.append("registrationNumber", formData.registrationNumber);
        backendFormData.append("clinicNumber", formData.clinicNumber);
        backendFormData.append("phoneNumber", formData.phoneNumber);
        backendFormData.append("clinicAddress", formData.clinicAddress);
        backendFormData.append("clinicLogo", formData.clinicLogo as File); // Send URL instead of file
        backendFormData.append("signaturePhoto", signaturePhotoUrl);


        const res = await fetch(`/api/create-organization`, {
            method: 'POST',
            body: backendFormData
        });
        const data = await res.json();
        return { ...data, status: res?.status };
    } catch (error) {
        return { error: error };
    }
};