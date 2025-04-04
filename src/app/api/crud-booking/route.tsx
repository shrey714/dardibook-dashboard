import { withAuth } from "@/server/withAuth";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/firebase/firebaseConfig";
import { arrayRemove, arrayUnion, collection, doc, getDoc, query, setDoc, updateDoc, where } from "firebase/firestore";

const addBooking = async (request: NextRequest) => {
    try {
      const body = await request.json();
      const { uid, bedId, ...bookingInfo } = body;
      console.log({...body})
      const bedDocRef = doc(db, "doctor", uid, "beds", bedId);
        await setDoc(bedDocRef, {
          bedId:bedId,
          booking:arrayUnion({
            ...bookingInfo
          })
        }, { merge: true });

    const patientRef = doc(db, "doctor", uid, "patients", bookingInfo.patientId);
    await updateDoc(patientRef,{
        bedInfo:arrayUnion({
            bedId:bedId,
            bookedAt:bookingInfo.bookedAt,
            bookedTill:bookingInfo.bookedTill
        })
    })
  
      return NextResponse.json(
        { data: "success" },
        { status: 200 }
      );
    } catch (error) {
      console.log("Error adding/updating bed data:", error);
      return NextResponse.json(
        { error: error || "Internal server error" },
        { status: 500 }
      );
    }
  };

  const dischargePatientFromBed = async (request: NextRequest) => {
    try {
      const body = await request.json();
      const { uid,bedId,patientId } = body;
      const bedDocRef = doc(db, "doctor", uid, "beds", bedId);
      const bedDocSnapshot = await getDoc(bedDocRef);
      if(bedDocSnapshot.exists()){
        const bookingData = bedDocSnapshot.data()?.booking;
        const bookingToRemove = bookingData.find((booking: { patientId: any; }) => booking.patientId === patientId);
        if(!bookingToRemove){
          return NextResponse.json(
            { data: "booking for this patient does not exist" },
            { status: 404 }
          );
        }
        await updateDoc(bedDocRef, {
          booking:arrayRemove(bookingToRemove)
        });
      }else{
        return NextResponse.json(
          { data: "bed does not exist" },
          { status: 404 }
        );
      }
        
  
      return NextResponse.json(
        { data: "success" },
        { status: 200 }
      );
    } catch (error) {
      console.log("Error adding/updating bed data:", error);
      return NextResponse.json(
        { error: error || "Internal server error" },
        { status: 500 }
      );
    }
  };

export const POST = withAuth(addBooking);
export const PUT = withAuth(dischargePatientFromBed);