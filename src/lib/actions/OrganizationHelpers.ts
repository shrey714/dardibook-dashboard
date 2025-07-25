"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { storage } from "@/firebase/firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

type FormDataType = {
    clinicName: string;
    doctorName: string;
    degree: string;
    registrationNumber: string;
    clinicNumber: string;
    phoneNumber: string;
    clinicAddress: string;
    clinicLogo: File | null;
    signaturePhoto: File | null;
};

export const uploadFile = async (file: File, path: string) => {
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    return getDownloadURL(fileRef);
};

export const createOrganization = async (formData: FormDataType) => {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        if (!formData.clinicLogo) {
            throw new Error("Logo not provided!");
        }

        let signaturePhotoUrl = "";
        if (formData.signaturePhoto) {
            signaturePhotoUrl = await uploadFile(formData.signaturePhoto, `signaturePhotos/${Date.now()}-${formData.signaturePhoto.name}`);
        }

        const metadata: Record<string, any> = {
            clinicName: formData.clinicName,
            doctorName: formData.doctorName,
            degree: formData.degree,
            registrationNumber: formData.registrationNumber,
            clinicNumber: formData.clinicNumber,
            phoneNumber: formData.phoneNumber,
            clinicAddress: formData.clinicAddress,
            signaturePhoto: signaturePhotoUrl,
        };

        const client = await clerkClient();

        const orgResponse = await client.organizations.createOrganization({
            name: formData.clinicName,
            createdBy: userId,
            publicMetadata: metadata,
            maxAllowedMemberships: 5,
        });

        const organizationId = orgResponse.id;

        if (formData.clinicLogo) {
            const logoParams = {
                file: formData.clinicLogo,
                uploaderUserId: userId,
            };

            await client.organizations.updateOrganizationLogo(organizationId, logoParams);
        }

        return { status: 200, data: "Organization created successfully" };
    } catch (error: any) {
        console.error("Create Organization Error:", error);
        return { status: 500, error: error.message || "Server Error" };
    }
};
