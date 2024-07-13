import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const uid = searchParams.get("uid");
    console.log("uid", uid)

    if (!id || !uid) {
      return NextResponse.json(
        { error: "Patient ID and UID are required." },
        { status: 400 }
      );
    }

    const docRef = doc(db, "doctor", uid, "patients", id); // Adjust 'uid' if needed
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const patientData = docSnap.data();

    return NextResponse.json({ data: patientData }, { status: 200 });
  } catch (error) {
    console.log("Error fetching patient data:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
};
