import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

const fetchPatientData = async (
  id: string,
  uid: string
): Promise<any | null> => {
  const patientDocRef = doc(db, "doctor", uid, "patients", id);
  const patientDocSnap = await getDoc(patientDocRef);

  if (!patientDocSnap.exists()) {
    return null;
  }

  return patientDocSnap.data() as any;
};

const fetchPrescriptionsData = async (
  id: string,
  uid: string
): Promise<any[]> => {
  const prescriptionsQuery = query(
    collection(db, "doctor", uid, "patients", id, "visits"),
    orderBy("time", "asc") // or "desc" for descending order
  );
  const prescriptionsSnapshot = await getDocs(prescriptionsQuery);

  return prescriptionsSnapshot.docs.map((doc) => ({
    ...doc.data(),
  })) as any[];
};

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const uid = searchParams.get("uid");

  if (!id || !uid) {
    return NextResponse.json(
      { error: "Invalid patient ID or Doctor ID" },
      { status: 400 }
    );
  }

  try {
    const patientData = await fetchPatientData(id, uid);
    const prescriptionsData = await fetchPrescriptionsData(id, uid);

    if (!patientData) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(
      { patient: patientData, prescriptions: prescriptionsData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
