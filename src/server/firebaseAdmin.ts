// import "server-only"

// import admin from "firebase-admin"

// interface FirebaseAdminAppParams {
//   projectId: string
//   clientEmail: string
//   storageBucket: string
//   privateKey: string
// }

// function formatPrivateKey(key: string) {
//   return key.replace(/\\n/g, "\n")
// }

// export function createFirebaseAdminApp(params: FirebaseAdminAppParams) {
//   const privateKey = formatPrivateKey(params.privateKey)

//   if (admin.apps.length > 0) {
//     return admin.app()
//   }

//   const cert = admin.credential.cert({
//     projectId: params.projectId,
//     clientEmail: params.clientEmail,
//     privateKey,
//   })

//   return admin.initializeApp({
//     credential: cert,
//     projectId: params.projectId,
//     storageBucket: params.storageBucket,
//   })
// }

// export async function initAdmin() {
//   const params = {
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
//     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET as string,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
//   }

//   return createFirebaseAdminApp(params)
// }


import * as admin from "firebase-admin";
// import { env } from "@/env";

console.log("credd===", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  process.env.FIREBASE_CLIENT_EMAIL,
  process.env.FIREBASE_PRIVATE_KEY)
if (admin.apps.length === 0) {


  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export { admin };