import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/firebaseConfig";
import { collection, doc, getDocs, query, where } from "firebase/firestore";

function getUniqueDateTimestamps(
  last_visited: number,
  visitedDates: number[]
): number[] {
  // Combine last_visited and visitedDates
  const allTimestamps = [last_visited, ...visitedDates];

  // Create a Set to track unique dates
  const uniqueDates = new Set<string>();

  // Filter timestamps to ensure unique dates
  const uniqueTimestamps = allTimestamps.filter((timestamp) => {
    const date = new Date(timestamp).toISOString().split("T")[0]; // Convert to date string "YYYY-MM-DD"
    if (!uniqueDates.has(date)) {
      uniqueDates.add(date);
      return true;
    }
    return false;
  });

  return uniqueTimestamps;
}

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get("doctorId");

    if (!doctorId) {
      return NextResponse.json(
        { error: "Doctor ID is required." },
        { status: 400 }
      );
    }

    const patientsCollection = collection(db, "doctor", doctorId, "patients");
    const patientsQuery = query(patientsCollection);

    const querySnapshot = await getDocs(patientsQuery);
    const patientsData: {
      id: string;
      first_name: any;
      last_name: any;
      age: string;
      gender: string;
      visitedDates: any;
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
        visitedDates: getUniqueDateTimestamps(
          patient.last_visited,
          patient.visitedDates || []
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
