import { db, storage } from "@/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextResponse, NextRequest } from "next/server";

const uploadFile = async (file: File, path: string) => {
  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  return getDownloadURL(fileRef);
};

export const POST = async (request: NextRequest) => {
  try {
    // const { searchParams } = new URL(request.url);
    // const id = searchParams.get("id");
    // const uid = searchParams.get("uid");
    const historyData = await request.json();
    const { uid, formData } = historyData;

    if (!uid) {
      return NextResponse.json({ error: "UID is missing." }, { status: 400 });
    }

    const doctorDocRef = doc(db, "doctor", uid);

    // Upload images and get URLs
    let clinicLogoUrl = "";
    let signaturePhotoUrl = "";

    if (formData.clinicLogo) {
      clinicLogoUrl = await uploadFile(
        formData.clinicLogo,
        `clinicLogos/${uid}`
      );
    }

    if (formData.signaturePhoto) {
      signaturePhotoUrl = await uploadFile(
        formData.signaturePhoto,
        `signaturePhotos/${uid}/`
      );
    }

    await setDoc(
      doctorDocRef,
      {
        clinicName: formData.clinicName,
        doctorName: formData.doctorName,
        clinicNumber: formData.clinicNumber,
        phoneNumber: formData.phoneNumber,
        emailId: formData.emailId,
        clinicAddress: formData.clinicAddress,
        clinicLogo: clinicLogoUrl,
        signaturePhoto: signaturePhotoUrl,
        verified: true,
      },
      { merge: true }
    );

    return NextResponse.json({ data: "success" }, { status: 200 });
  } catch (error) {
    console.log("Error fetching patient data:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
};
