// utils/withAuth.js
import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { decryptData, encryptData } from "../lib/utils"
// Initialize Firebase Admin SDK
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//   });
// }

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const setCookies = (response: any, key: string, value: any, days: number) => {
  response.cookies.set(key, value, {
    httpOnly: true,
    secure: true,
    maxAge: 60 * 60 * 24 * days, // 7 days
    path: "/",
  });
}

export const withAuth = (handler: (arg0: any, arg1: any) => any) => {
  return async (request: any, context: any) => {
    return await handler(request, context);
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header missing" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const tokenFromCookie = await decryptData(request.cookies.get("verified token")?.value)
    if (token === tokenFromCookie) {
      console.log("already verified")
      return await handler(request, context);
    }
    try {
      // Verify the Firebase token
      console.log("verifying token")
      await admin.auth().verifyIdToken(token);

      const response = await handler(request, context);
      const encryptedToken = await encryptData(token)
      setCookies(response, "verified token", encryptedToken, 7)

      return response;
    } catch (error) {
      console.error("Error verifying Firebase token:", error);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 403 }
      );
    }
  };
};
