import { db } from "@/firebase/firebaseConfig";
import {
  arrayRemove,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("uid");

  try {
    if (!doctorId) {
      return NextResponse.json(
        { error: "UID or PatientID or visitID is missing." },
        { status: 400 }
      );
    }
    const doctorRef = doc(db, "doctor", doctorId);
    const doctorSnapshot = await getDoc(doctorRef);

    if (!doctorSnapshot.exists()) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const staff = doctorSnapshot.data().staff || [];
    return NextResponse.json({ data: staff }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error || "Failed to retrieve staff" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("uid");

  const { email, role } = await request.json();

  if (!email || !role) {
    return NextResponse.json(
      { error: "Missing staff details" },
      { status: 400 }
    );
  }
  if (!doctorId) {
    return NextResponse.json(
      { error: "UID or PatientID or visitID is missing." },
      { status: 400 }
    );
  }

  try {
    const response = await fetch("https://backend.dardibook.in/get-uid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    if (response.ok) {
      const { uid } = await response.json();
      // Check if the UID exists in the doctor collection
      console.log("uid==", uid);
      const memberRef = doc(db, "doctor", uid);
      const doctorSnap = await getDoc(memberRef);

      if (doctorSnap.exists()) {
        return NextResponse.json(
          { error: "Staff member already exists." },
          { status: 400 }
        );
      }
    }

    const doctorRef = doc(db, "doctor", doctorId);
    await updateDoc(doctorRef, {
      staff: arrayUnion({ email, role }),
    });

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error || "Failed to add staff member" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const doctorId = searchParams.get("uid");
  const { staffMailId } = await request.json();

  if (!staffMailId) {
    return NextResponse.json({ error: "Missing staff email" }, { status: 400 });
  }

  try {
    if (!doctorId) {
      return NextResponse.json(
        { error: "UID or PatientID or visitID is missing." },
        { status: 400 }
      );
    }
    const doctorRef = doc(db, "doctor", doctorId);
    const doctorSnapshot = await getDoc(doctorRef);

    if (!doctorSnapshot.exists()) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const staff = doctorSnapshot.data().staff || [];
    const staffMemberToDelete = staff.find(
      (member: { email: string }) => member.email === staffMailId
    );
    if (!staffMemberToDelete) {
      return NextResponse.json(
        { error: "Staff member not found" },
        { status: 404 }
      );
    }

    await updateDoc(doctorRef, {
      staff: arrayRemove(staffMemberToDelete),
    });

    return NextResponse.json({ data: "success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error || "Failed to delete staff member" },
      { status: 500 }
    );
  }
}
