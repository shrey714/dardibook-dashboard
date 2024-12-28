import { db } from "@/firebase/firebaseConfig";
import { withAuth } from "@/server/withAuth";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";

const getDateFromTimeStamp = (ts: string | number | Date) => {
  const timestamp = new Date(ts);
  return timestamp.getDate();
};

const createPrescription = async (request: NextRequest) => {
  try {
    // const { searchParams } = new URL(request.url);
    // const id = searchParams.get("id");
    // const uid = searchParams.get("uid");
    const Data = await request.json();
    const { id, uid, visitId, ...mainData } = Data;
    if (!uid || !id || !visitId) {
      return NextResponse.json(
        { error: "UID or PatientID or visitID is missing." },
        { status: 400 }
      );
    }
    //uploading  in medicine database

    for (const medicine of mainData?.medicines) {
      if (medicine.medicineName || medicine.medicineName.trim() !== "") {
        // Get the medicine ID and prepare the Firestore document reference
        const medicineRef = doc(
          db,
          "doctor",
          uid,
          "medicinesData",
          medicine?.id
        );

        // Upload the medicine object to Firestore
        await setDoc(
          medicineRef,
          {
            searchableString: medicine.medicineName.toLowerCase().trim(),
            id: medicine.id,
            medicineName: medicine.medicineName,
            instruction: medicine.instruction,
            type: medicine.type,
          },
          { merge: true }
        );
      }
    }

    //uploading Disease in Diseases database

    const diseaseRef = doc(
      db,
      "doctor",
      uid,
      "diseaseData",
      mainData?.diseaseId
    );
    await setDoc(
      diseaseRef,
      {
        searchableString: mainData?.diseaseDetail.toLowerCase().trim(),
        diseaseDetail: mainData?.diseaseDetail,
        medicines: mainData?.medicines
          ?.filter((medicine: { medicineName: string; }) =>
            medicine.medicineName.toLowerCase().trim()
          )
          .map((medicine: { id: any; }) => medicine.id),
        diseaseId: mainData?.diseaseId,
      },
      { merge: true }
    );

    const patientDocRef = doc(db, "doctor", uid, "patients", id); // Adjust 'uid' if needed
    const newDate = Date.now();
    // updates visitedDates array when the prescription gets generated
    const patientDoc = await getDoc(patientDocRef);

    if (patientDoc.data()?.visitedDates) {
      const conveirtedDates = patientDoc
        .data()
        ?.visitedDates.map(getDateFromTimeStamp);
      if (!conveirtedDates.includes(getDateFromTimeStamp(newDate))) {
        await updateDoc(patientDocRef, {
          visitedDates: arrayUnion(newDate),
        });
      }
    } else {
      await updateDoc(patientDocRef, {
        visitedDates: arrayUnion(newDate),
      });
    }

    const visitDocRef = doc(collection(patientDocRef, "visits"), visitId);
    await setDoc(visitDocRef, { ...mainData, time: newDate });
    // const patientData = docSnap.data();

    // const patientHistories = [];

    return NextResponse.json({ data: "success" }, { status: 200 });
  } catch (error) {
    console.log("Error fetching patient data:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = withAuth(createPrescription);