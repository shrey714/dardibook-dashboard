import { db } from "@/firebase/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const data = await req.json();
    const { uid, id, ...mainData } = data;
    // const docref = doc(db, "doctor", uid)
    await setDoc(doc(db, "doctor", uid, "patients", id), mainData, {
      merge: true,
    });
    return NextResponse.json(
      {
        message: "New Patient has been registered successfuly",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
};
