import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { NextResponse, NextRequest } from "next/server";
import {getDateFromTimeStamp} from "../../utils/dateFromts"
import {getDayStartAndEndTimestampsIST} from "../../utils/getDayStartEndTs"

export const GET = async (request: NextRequest) => {
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
      const appointed = getDateFromTimeStamp(pData["last_visited"])===getDateFromTimeStamp(currentTs)?true:false;
      let old = true;
      if(pData?.visitedDates && pData.visitedDates.length==1 && getDateFromTimeStamp(pData["visitedDates"][0])){
        console.log(pData.visitedDates)
        old = false;
      }
      patientData.push({...doc.data(),appointed,old});
      patientData.push(doc.data());
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
