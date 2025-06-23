import { NextResponse, NextRequest } from "next/server";

const getSubscription = async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const subId = searchParams.get("subId");

    if (!subId) {
      return NextResponse.json(
        { error: "subId is required." },
        { status: 400 }
      );
    }

    const response = await fetch("https://backend.dardibook.in/getSubDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: subId }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch subscription details");
    }

    const details = await response.json();

    return NextResponse.json({ data: details }, { status: 200 });
  } catch (error) {
    console.log("Error fetching subscription data:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const GET = getSubscription;