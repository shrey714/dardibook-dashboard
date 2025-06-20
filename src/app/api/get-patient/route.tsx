import { NextResponse, NextRequest } from "next/server";
import { adminDb } from "@/server/firebaseAdmin";

const getPatient = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const uid = searchParams.get("uid");

    if (!id || !uid) {
      return NextResponse.json(
        { error: "Patient ID and UID are required." },
        { status: 400 }
      );
    }

    const docSnap = await adminDb
      .collection("doctor")
      .doc(uid)
      .collection("patients")
      .doc(id)
      .get(); // Adjust 'uid' if needed

    if (!docSnap.exists) {
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

export const GET = getPatient;
