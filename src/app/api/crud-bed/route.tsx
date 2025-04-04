import { withAuth } from "@/server/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/firebaseConfig";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const checkAvalability = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  // const startTime = searchParams.get("startTime")
  // const endTime = searchParams.get("endTime")
  const uid = searchParams.get("uid");
  if (!uid) {
    return NextResponse.json(
      { error: "startTime or endTime or uid is missing." },
      { status: 400 }
    );
  }

  const occupiedSlots: any = [];

  try {
    const bedDocs = await getDocs(collection(db, "doctor", uid, "beds"));
    bedDocs.forEach((doc) => {
      const data = doc.data();
      const bookings = data.booking;
      bookings.forEach((booking: any) => {
        occupiedSlots.push({ bedId: data.bedId, booking });
      });
    });
  } catch (error) {
    return NextResponse.json(
      { error: error || "Internal server error" },
      { status: 500 }
    );
  }
  return NextResponse.json({ data: occupiedSlots }, { status: 200 });
};

const addBed = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { uid, bedId, ...bookingInfo } = body;
    console.log({ ...body });
    const bedDocRef = doc(db, "doctor", uid, "beds", bedId);
    await setDoc(
      bedDocRef,
      {
        bedId: bedId,
      },
      { merge: true }
    );

    return NextResponse.json({ data: "success" }, { status: 200 });
  } catch (error) {
    console.log("Error adding/updating bed data:", error);
    return NextResponse.json(
      { error: error || "Internal server error" },
      { status: 500 }
    );
  }
};

const deleteBed = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { uid, bedId, ...bookingInfo } = body;
    console.log({ ...body });
    const bedDocRef = doc(db, "doctor", uid, "beds", bedId);
    await deleteDoc(bedDocRef);

    return NextResponse.json({ data: "success" }, { status: 200 });
  } catch (error) {
    console.log("Error adding/updating bed data:", error);
    return NextResponse.json(
      { error: error || "Internal server error" },
      { status: 500 }
    );
  }
};

export const POST = withAuth(addBed);
export const GET = withAuth(checkAvalability);
export const DELETE = withAuth(deleteBed);
