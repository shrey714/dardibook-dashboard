import { db, storage } from "@/firebase/firebaseConfig";
import { withAuth } from "@/server/withAuth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { NextResponse, NextRequest } from "next/server";

const createDoctor = async (request: NextRequest) => {
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

    await setDoc(
      doctorDocRef,
      {
        ...formData,
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

export const POST = withAuth(createDoctor);
