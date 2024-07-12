import { db } from "@/firebase/firebaseConfig";
import { collection, doc, DocumentData, setDoc, getDoc, updateDoc, arrayUnion, addDoc } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    // const { searchParams } = new URL(request.url);
    // const id = searchParams.get("id");
    // const uid = searchParams.get("uid");
    const historyData = await request.json();
    const {id,uid,...mainHistoryData} = historyData;

    // if (!uid) {
    //   return NextResponse.json(
    //     { error: "UID is required." },
    //     { status: 400 }
    //   );
    // }

    const patientDocRef = doc(db, "doctor", uid, "patients",id); // Adjust 'uid' if needed
    const newDate = Date.now();
    console.log(newDate);

    // updates visitedDates array when the prescription gets generated
    await updateDoc(patientDocRef,{
        visitedDates: arrayUnion(newDate)
    })
    
    const visitCollectionRef = collection(patientDocRef,"visits");
    await addDoc(visitCollectionRef,mainHistoryData)
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
