"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@clerk/nextjs";
import { addMinutes, getTime, startOfDay } from "date-fns";
import { doc, setDoc } from "firebase/firestore";
import React from "react";
import uniqid from "uniqid";

const Temp = () => {
  const { orgId } = useAuth();
  const btnClick1 = async () => {
    const getRandomData = () => ({
      age: Math.floor(Math.random() * 50) + 10, // Random age between 10-60
      city: ["Mumbai", "Delhi", "Chennai", "Kolkata", "Pune"][
        Math.floor(Math.random() * 5)
      ],
      gender: ["Male", "Female"][Math.floor(Math.random() * 2)],
      mobile: Math.floor(9000000000 + Math.random() * 1000000000).toString(),
      name: `Patient ${Math.floor(Math.random() * 1000)}`,
      patient_id: uniqid.time(), // Unique patient ID
      state: [
        "Maharashtra",
        "Tamil Nadu",
        "Gujarat",
        "West Bengal",
        "Karnataka",
      ][Math.floor(Math.random() * 5)],
      street_address: `Street ${Math.floor(Math.random() * 100)}`,
      zip: Math.floor(500000 + Math.random() * 1000).toString(),
    });

    const generatePatients = async (doctorId: string) => {
      const startDate = startOfDay(new Date());
      let currentTime = addMinutes(startDate, 10 * 60); // Start at 10 AM

      const patients = Array.from({ length: 4 }, (_, index) => {
        const patientData = {
          ...getRandomData(),
          bed_info: [],
          registered_date: [getTime(startDate)],
          registered_date_time: [getTime(currentTime)],
          prescribed_date_time: [],
          registerd_by: {
            email: "pshrey0000@gmail.com",
            id: "user_2qTzDwsVbXO7tfelLadF95Fnpg0",
            name: "Shrey Patel",
          },
          registerd_for: {
            email: "pshrey0000@gmail.com",
            id: "user_2qTzDwsVbXO7tfelLadF95Fnpg0",
            name: "Shrey Patel",
          },
        };

        currentTime = addMinutes(currentTime, 30); // Add 30 minutes for next patient
        return patientData;
      });

      const batchPromises = patients.map((patient) => {
        const patientRef = doc(
          db,
          `doctor/${doctorId}/patients/${patient.patient_id}`
        );
        return setDoc(patientRef, patient);
      });

      await Promise.all(batchPromises);
      console.log("Patients added successfully!", patients);
    };

    if (orgId) generatePatients(orgId);
  };

  return (
    <>
      <Button onClick={() => btnClick1()}>Button1</Button>
    </>
  );
};

export default Temp;
