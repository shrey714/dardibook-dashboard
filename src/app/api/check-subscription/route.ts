import { NextResponse, NextRequest } from "next/server";
import { adminDb } from "@/server/firebaseAdmin";

// Utility function to check if the current time is between two timestamps
function isCurrentTimeBetween(start: number, end: number) {
  const currentTime = Math.floor(Date.now() / 1000);
  return currentTime >= start && currentTime <= end;
}

// Define the GET handler for the API route
const checkSubscription = async (request: NextRequest) => {

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({
      status: false,
      message: 'User ID is required',
    });
  }

  try {
    // Reference the user document in Firestore
    const userDoc = await adminDb.collection("doctor").doc(userId).get();

    if (userDoc.exists && userDoc.data()) {
      const userData = userDoc.data();

      const response = await fetch(
        "https://backend.dardibook.in/getSubDetails",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Set the content type to JSON
          },
          body: JSON.stringify({ id: userData?.subscriptionId || "" }),
        }
      );

      const subscriptionDetails = await response.json();

      // Check if the current time is within the subscription period
      if (
        isCurrentTimeBetween(
          subscriptionDetails?.current_start,
          subscriptionDetails?.current_end
        )
      ) {
        return NextResponse.json({
          status: true,
        });
      } else {
        return NextResponse.json({
          status: false,
          message: "Your previous subscription expired..",
        });
      }
    }

    return NextResponse.json({
      status: false,
      message: "You haven't taken any subscription before..",
    });

  } catch (error) {
    // Handle errors and return a response
    console.error('Error checking subscription:', error);
    return NextResponse.json({
      status: false,
      message: 'An error occurred while checking subscription.',
    });
  }
}

export const GET = (checkSubscription);