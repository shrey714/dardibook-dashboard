import { NextResponse } from "next/server";

export async function createSubscription({
  planId,
  customer_notify,
  total_count,
}) {
  const sub = await fetch(
    "https://backend.dardibook.in/create-subscription",
    {
      method: "POST",
      body: JSON.stringify({ planId, customer_notify, total_count }),
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
    }
  );
  const parsedSub = await sub.json();
  return NextResponse.json(parsedSub);
}
