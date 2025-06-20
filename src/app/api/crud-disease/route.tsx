import { adminDb } from "@/server/firebaseAdmin";
import { withAuth } from "@/server/withAuth";
import { NextResponse, NextRequest } from "next/server";

const postDisease = async (request: NextRequest) => {
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

    await adminDb
      .collection("doctor")
      .doc(uid)
      .collection("diseaseData")
      .doc(diseaseId)
      .set(
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

const getDisease = async (request: NextRequest) => {
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

    const snapshot = await adminDb
      .collection("doctor")
      .doc(uid)
      .collection("diseaseData")
      .get();

    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    // if (data.length == 0) {
    //   return NextResponse.json(
    //     { es: 1, msg: "Please add some diseases" },
    //     { status: 200 }
    //   );
    // }

    return NextResponse.json({ data: data }, { status: 200 });
  } catch (error) {
    console.log("Error adding/updating disease data:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
};

const deleteDisease = async (request: NextRequest) => {
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

    await adminDb
      .collection("doctor")
      .doc(uid)
      .collection("diseaseData")
      .doc(id)
      .delete();

    return NextResponse.json({ data: "success" }, { status: 200 });
  } catch (error) {
    console.log("Error adding/updating disease data:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getDisease);
export const POST = withAuth(postDisease);
export const DELETE = withAuth(deleteDisease);