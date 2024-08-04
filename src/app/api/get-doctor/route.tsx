import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({ error: "UID is required." }, { status: 400 });
    }

    const docRef = doc(db, "doctor", uid); // Adjust 'uid' if needed
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const patientData = docSnap.data();

    return NextResponse.json({ data: patientData }, { status: 200 });
  } catch (error) {
    console.log("Error fetching doctor data:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
};
