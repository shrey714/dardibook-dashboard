"use client";
import { Button } from "@/components/ui/button";
import { db, storage } from "@/firebase/firebaseConfig";
import { useAuth } from "@clerk/nextjs";
import { startOfDay } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React from "react";

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const Temp = () => {
  const { orgId } = useAuth();
  const btnClick1 = async () => {
    // if (orgId) {
    //   const patientsRef = collection(db, "doctor", orgId, "patients");
    //   const snapshot = await getDocs(patientsRef);
    //   const batchUpdates: any[] = [];
    //   snapshot.forEach((doc) => {
    //     const patientData = doc.data();
    //     if (
    //       patientData.last_visited &&
    //       typeof patientData.last_visited === "number"
    //     ) {
    //       const newTimestamp = Timestamp.fromMillis(patientData.last_visited);
    //       batchUpdates.push(updateDoc(doc.ref, { last_visited: newTimestamp }));
    //     }
    //   });
    //   await Promise.all(batchUpdates);
    //   console.log("All timestamps converted successfully!");
    // }
    // if (orgId) {
    //   const patientsRef = collection(db, "doctor", orgId, "patients");
    //   const snapshot = await getDocs(patientsRef);
    //   const batchUpdates: any[] = [];
    //   snapshot.forEach((doc) => {
    //     const patientData = doc.data();
    //     // Check if visitedDates exists and is an array of numbers
    //     if (Array.isArray(patientData.visitedDates)) {
    //       const newTimestampsArray = patientData.visitedDates.map((date) =>
    //         typeof date === "number" ? Timestamp.fromMillis(date) : date
    //       );
    //       // Prepare update operation
    //       batchUpdates.push(
    //         updateDoc(doc.ref, { visitedDates: newTimestampsArray })
    //       );
    //     }
    //   });
    //   // Execute all updates in parallel
    //   await Promise.all(batchUpdates);
    //   console.log("All visitedDates converted successfully!");
    // }
    // if (orgId) {
    //   const patientsRef = collection(db, "doctor", orgId, "patients");
    //   const patientsSnapshot = await getDocs(patientsRef);
    //   const batchUpdates: any[] = [];
    //   for (const patientDoc of patientsSnapshot.docs) {
    //     const visitsRef = collection(patientDoc.ref, "visits");
    //     const visitsSnapshot = await getDocs(visitsRef);
    //     visitsSnapshot.forEach((visitDoc) => {
    //       const visitData = visitDoc.data();
    //       // Check if time exists and is a number (milliseconds)
    //       if (visitData.time && typeof visitData.time === "number") {
    //         const newTimestamp = Timestamp.fromMillis(visitData.time);
    //         // Prepare update operation
    //         batchUpdates.push(updateDoc(visitDoc.ref, { time: newTimestamp }));
    //       }
    //     });
    //   }
    //   // Execute all updates in parallel
    //   await Promise.all(batchUpdates);
    //   console.log(
    //     "All 'time' fields in 'visits' subcollection converted successfully!"
    //   );
    // }
  };

  const btnClick2 = async () => {
    if (orgId) {
      const date = new Date("2025-03-11T01:37:20Z");
      console.log(date);

      const seconds = Math.floor(date.getTime() / 1000); // Convert milliseconds to seconds
      const nanoseconds = (date.getTime() % 1000) * 1e6; // Remaining milliseconds to nanoseconds

      console.log("Seconds:", seconds);
      console.log("Nanoseconds:", nanoseconds);
      // ====================================
      const q = query(
        collection(db, "doctor", orgId, "patients"),
        where("city", "==", "banglore")
        // where("times", "array-contains", Timestamp.fromDate(new Date("2025-03-12T12:00:00Z")))
      );

      try {
        const querySnapshot = await getDocs(q);
        const results: any = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log((results[0].times[0] as Timestamp).toDate());
        console.log(results[0].times[0] as Timestamp);
        return results;
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!file) return null;

    const storageRef = ref(storage, `images/${file.name}`);
    const startTime = performance.now(); // Start time

    try {
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Progress can be tracked here
          },
          (error) => {
            console.error("Upload failed:", error);
            reject(null);
          },
          async () => {
            // Upload complete
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const endTime = performance.now(); // End time
            console.log(
              `Upload completed in ${(endTime - startTime).toFixed(2)} ms`
            );
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  return (
    <>
      <Button onClick={() => btnClick1()}>Button1</Button>
      <Button onClick={() => btnClick2()}>Button2</Button>
    </>
  );
};

export default Temp;
