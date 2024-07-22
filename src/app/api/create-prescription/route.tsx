import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  doc,
  DocumentData,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  addDoc,
} from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";

const getDateFromTimeStamp = (ts: string | number | Date) => {
  const timestamp = new Date(ts);
  return timestamp.getDate();
};

export const POST = async (request: NextRequest) => {
  try {
    // const { searchParams } = new URL(request.url);
    // const id = searchParams.get("id");
    // const uid = searchParams.get("uid");
    const historyData = await request.json();
    const { id, uid, visitId, ...mainHistoryData } = historyData;

    if (!uid || !id || !visitId) {
      return NextResponse.json(
        { error: "UID or PatientID or visitID is missing." },
        { status: 400 }
      );
    }

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
    await setDoc(visitDocRef, { ...mainHistoryData, time: newDate });
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
