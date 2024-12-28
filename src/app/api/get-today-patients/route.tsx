import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  DocumentData,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";
import { getDateFromTimeStamp } from "./getDateFromTimeStamp";
import { getDayStartAndEndTimestampsIST } from "./getDayStartAndEndTimestampsIST";
import { withAuth } from "@/server/withAuth";

const getTodayPatients = async (request: NextRequest) => {
  const currentTimestamp = Date.now();
  const timestamps = getDayStartAndEndTimestampsIST(currentTimestamp);
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get("uid");

    if (!uid) {
      return NextResponse.json({ error: "UID is required." }, { status: 400 });
    }

    const patientCollection = collection(db, "doctor", uid, "patients");
    const todaysPatientsDoc = query(
      patientCollection,
      where("last_visited", ">=", timestamps.dayStart),
      where("last_visited", "<=", timestamps.dayEnd),
      orderBy("last_visited", "desc")
    );
    const docSnap = await getDocs(todaysPatientsDoc);
    const patientData: DocumentData[] = [];

    docSnap.forEach((doc) => {
      const pData = doc.data();
      const currentTs = new Date();
      let old = true;
      let attended = false;
      const visitedDtesArray = pData?.visitedDates;
      const todayDate = getDateFromTimeStamp(currentTs);
      if (visitedDtesArray === undefined) old = false;
      if (visitedDtesArray !== undefined) {
        visitedDtesArray.forEach((dates: number) => {
          if (getDateFromTimeStamp(dates) == todayDate) {
            attended = true;
            return;
          }
        });
        if (visitedDtesArray.length > 1) old = true;
        if (
          visitedDtesArray.length == 1 &&
          getDateFromTimeStamp(visitedDtesArray[0]) == todayDate
        )
          old = false;
      }
      patientData.push({ ...doc.data(), attended, old });
    });

    return NextResponse.json({ data: patientData }, { status: 200 });
  } catch (error) {
    console.log("Error fetching patient data:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const GET = withAuth(getTodayPatients);