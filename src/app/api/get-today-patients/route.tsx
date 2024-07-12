import { db } from "@/firebase/firebaseConfig";
import { collection, doc, DocumentData, getDoc, getDocs, query, where } from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";

function getDayStartAndEndTimestampsIST(currentTimestamp: string | number | Date) {
    // Convert the current timestamp to a Date object
    const now = new Date(currentTimestamp);
  
    // Convert current time to IST
    const istTime = new Date(now.getTime());
  
    // Get the start of the day in IST
    const dayStartIST = new Date(
      istTime.getFullYear(),
      istTime.getMonth(),
      istTime.getDate(),
      0, 0, 0, 0
    );
  
    // Get the end of the day in IST
    const dayEndIST = new Date(
      istTime.getFullYear(),
      istTime.getMonth(),
      istTime.getDate(),
      23, 59, 59, 999
    );
  
    const dayStartUTC = dayStartIST.getTime();
    const dayEndUTC = dayEndIST.getTime();
  
    return {
      dayStart: dayStartUTC,
      dayEnd: dayEndUTC
    };
  }


export const GET = async (request: NextRequest) => {
    const currentTimestamp = Date.now();
    const timestamps = getDayStartAndEndTimestampsIST(currentTimestamp);
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json(
        { error: "UID is required." },
        { status: 400 }
      );
    }

    const patientCollection = collection(db, "doctor", uid, "patients");
    const todaysPatientsDoc = query(patientCollection,where("last_visited",">=",timestamps.dayStart),where("last_visited","<=",timestamps.dayEnd));
    const docSnap = await getDocs(todaysPatientsDoc);
    const patientData: DocumentData[] = [];
    docSnap.forEach(doc=>{
            patientData.push(doc.data())
    })

    return NextResponse.json({ data: patientData }, { status: 200 });
  } catch (error) {
    console.log("Error fetching patient data:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
};
