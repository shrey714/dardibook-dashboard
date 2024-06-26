import { NextResponse } from "next/server";

export async function createSubscription(planId) {
  const sub = await fetch(
    "https://razorpay-backend-lake.vercel.app/create-subscription",
    {
      method: "POST",
      body: JSON.stringify({ planId }),
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
    }
  );
  const parsedSub = await sub.json();
  return NextResponse.json(parsedSub);
}
