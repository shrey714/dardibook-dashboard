// utils/withAuth.js
import { NextResponse } from "next/server";
import admin from "firebase-admin";

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

export const withAuth = (handler: (arg0: any, arg1: any) => any) => {
  return async (request:any, context: any) => {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header missing" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    try {
      // Verify the Firebase token
      const decodedToken = await admin.auth().verifyIdToken(token);

      // Add user info to the request (mutable context)
      request.user = decodedToken;

      // Call the actual handler
      return handler(request, context);
    } catch (error) {
      console.error("Error verifying Firebase token:", error);
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 403 }
      );
    }
  };
};
