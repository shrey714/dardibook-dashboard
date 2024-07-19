// app/api/check-subscription/route.js
import { NextResponse } from "next/server";
import { db } from "../../../firebase/firebaseConfig"
import { doc, getDoc } from 'firebase/firestore';


function isCurrentTimeBetween(start: number, end: number) {
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= start && currentTime <= end;
}
export const checkSubscription = async (userId: string): Promise<{
  status: boolean,
  message?: string | undefined
}> => {
  const userDocRef = doc(db, 'doctor', userId);
  const userDoc = await getDoc(userDocRef);
  if (userDoc.exists()) {
    const details = await fetch(
      "https://backend.dardibook.in/getSubDetails",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify({ id: userDoc.data().subscriptionId }),
      }
    );
    const subscriptionDetails = await details.json();
    // console.log("subscriptionDetails===", subscriptionDetails)
    if (
      isCurrentTimeBetween(
        subscriptionDetails?.current_start,
        subscriptionDetails?.current_end
      )
    ) {
      return {
        status: true,
      }
    } else {
      return {
        status: false,
        message: "Your previous subscription expired.."
      }
    }

  }
  return {
    status: false,
    message: "You haven't taken any subscription before.."
  };
};