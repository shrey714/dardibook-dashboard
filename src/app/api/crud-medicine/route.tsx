import { db } from "@/firebase/firebaseConfig";
import {
    collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    console.log(searchParams)
    // const id = searchParams.get("id");
    const uid = searchParams.get("uid");
    console.log(uid)
    const medicineData = await request.json();
    const { id } = medicineData;
    console.log(id)

    if (!uid) {
      return NextResponse.json(
        { error: "UID or PatientID or visitID is missing." },
        { status: 400 }
      );
    }

    const medicineRef = doc(
        db,
        "doctor",
        uid,
        "medicinesData",
        id
      );
      console.log(medicineRef)

      // Upload the medicine object to Firestore
      await setDoc(medicineRef, medicineData, { merge: true });

    return NextResponse.json({ data: "success" }, { status: 200 });
  } catch (error) {
    console.log("Error adding/updating medicine data:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const GET = async (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      // const id = searchParams.get("id");
      const uid = searchParams.get("uid");
  
      if (!uid) {
        return NextResponse.json(
          { error: "UID or PatientID or visitID is missing." },
          { status: 400 }
        );
      }
  
      const medicineRef = collection(
          db,
          "doctor",
          uid,
          "medicinesData",
        );
        // Upload the medicine object to Firestore
        const snapshot = await getDocs(medicineRef);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log(data)

        if(data.length==0){
            return NextResponse.json({ es:1,msg:"Please add some medicines" }, { status: 200 });
        }
  
      return NextResponse.json({ data: data }, { status: 200 });
    } catch (error) {
      console.log("Error adding/updating medicine data:", error);
      return NextResponse.json(
        { error: error || "Internal Server Error" },
        { status: 500 }
      );
    }
  };


  export const DELETE = async (request: NextRequest) => {
    try {
      const { searchParams } = new URL(request.url);
      const uid = searchParams.get("uid");
  
      if (!uid) {
        return NextResponse.json(
          { error: "UID or PatientID or visitID is missing." },
          { status: 400 }
        );
      }

      const {id} = await request.json();
  
      const medicineRef = doc(
          db,
          "doctor",
          uid,
          "medicinesData",
          id
        );
        // Upload the medicine object to Firestore
        await deleteDoc(medicineRef);
  
      return NextResponse.json({ data: "success" }, { status: 200 });
    } catch (error) {
      console.log("Error adding/updating medicine data:", error);
      return NextResponse.json(
        { error: error || "Internal Server Error" },
        { status: 500 }
      );
    }
  };
