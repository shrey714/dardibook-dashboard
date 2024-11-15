// utils/withAuth.js
import { NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
// if (!admin.apps.length) {
//   admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//   });
// }

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
