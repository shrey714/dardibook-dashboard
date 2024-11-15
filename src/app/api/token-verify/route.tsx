import { NextRequest, NextResponse } from "next/server";
import { admin } from "@/server/firebaseAdmin";

export async function POST(request: NextRequest) {
  const authorizationHeader = request.headers.get("authorization");

  if (!authorizationHeader) {
    return NextResponse.json(
      { error: "Authorization header is required" },
      { status: 400 }
    );
  }

  const token = authorizationHeader?.split("Bearer ")[1];

  if (!token) {
    return NextResponse.json({ error: "Token is missing" }, { status: 400 });
  }

  try {
    const verifiedToken = await admin.auth().verifyIdToken(token);

    return NextResponse.json({ verifiedToken }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error || "Failed to add staff member" },
      { status: 500 }
    );
  }
}
