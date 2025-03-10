import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { withAuth } from "@/server/withAuth";

const getAllPatients = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    if (!doctorId || !from || !to) {
      return NextResponse.json(
        { error: "Doctor ID/from/to is missing." },
        { status: 400 }
      );
    }
    const patientsCollection = collection(db, "doctor", doctorId, "patients");
    const patientsQuery = query(
      patientsCollection,
      where("last_visited", ">=", Timestamp.fromMillis(parseInt(from))),
      where("last_visited", "<=", Timestamp.fromMillis(parseInt(to)))
    );

    const querySnapshot = await getDocs(patientsQuery);
    const patientsData: {
      id: string;
      first_name: string;
      last_name: string;
      age: string;
      gender: string;
      last_visited: number;
      visitedDates: number[];
      appointed: boolean;
      mobile_number: string;
    }[] = [];

    querySnapshot.forEach((doc) => {
      const patient = doc.data();
      patientsData.push({
        id: doc.id,
        first_name: patient.first_name,
        last_name: patient.last_name,
        age: patient.age,
        gender: patient.gender,
        appointed: patient.visitedDates ? true : false,
        last_visited: (patient.last_visited as Timestamp).toMillis(),
        visitedDates: patient.visitedDates?.map((time: Timestamp) =>
          time.toMillis()
        ),
        mobile_number: patient.mobile_number,
      });
    });
    return NextResponse.json({ data: patientsData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching patient data:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getAllPatients);
