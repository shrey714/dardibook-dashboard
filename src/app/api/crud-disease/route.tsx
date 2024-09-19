import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    // const id = searchParams.get("id");
    const uid = searchParams.get("uid");
    const diseaseData = await request.json();
    const { diseaseId } = diseaseData;

    if (!uid) {
      return NextResponse.json(
        { error: "UID or PatientID or visitID is missing." },
        { status: 400 }
      );
    }

    const diseaseRef = doc(db, "doctor", uid, "diseaseData", diseaseId);

    // Upload the disease object to Firestore
    await setDoc(
      diseaseRef,
      {
        ...diseaseData,
        searchableString: diseaseData.diseaseDetail.toLowerCase().trim(),
      },
      { merge: true }
    );

    return NextResponse.json({ data: "success" }, { status: 200 });
  } catch (error) {
    console.log("Error adding/updating disease data:", error);
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

    const diseaseRef = collection(db, "doctor", uid, "diseaseData");
    // Upload the disease object to Firestore
    const snapshot = await getDocs(diseaseRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (data.length == 0) {
      return NextResponse.json(
        { es: 1, msg: "Please add some diseases" },
        { status: 200 }
      );
    }

    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error) {
    console.log("Error adding/updating disease data:", error);
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

    const { id } = await request.json();

    const diseaseRef = doc(db, "doctor", uid, "diseaseData", id);
    // Upload the disease object to Firestore
    await deleteDoc(diseaseRef);

    return NextResponse.json({ data: "success" }, { status: 200 });
  } catch (error) {
    console.log("Error adding/updating disease data:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
};
