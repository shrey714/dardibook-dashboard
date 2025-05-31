"use client";
import { Button } from "@/components/ui/button";
import { db } from "@/firebase/firebaseConfig";
import { PharmacyTypes } from "@/types/FormTypes";
import { useAuth } from "@clerk/nextjs";
import { addDays, addMinutes, getTime, startOfDay } from "date-fns";
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
      name: `patient ${Math.floor(Math.random() * 1000)}`,
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
      const ids = ["m9ab2o8t", "m9ab2o8u", "m9ab2o8v", "m9ab2o8w"];
      const patients = Array.from({ length: 4 }, (_, index) => {
        const patient_data = getRandomData();
        const patientData = {
          ...patient_data,
          patient_id: ids[index],
          bed_info:
            index === 2
              ? [
                  {
                    admission_at: getTime(addMinutes(startDate, 30)),
                    admission_by: {
                      email: "pshrey0000@gmail.com",
                      id: "user_2qTzDwsVbXO7tfelLadF95Fnpg0",
                      name: "Shrey Patel",
                    },
                    admission_for: {
                      email: "pshrey0000@gmail.com",
                      id: "user_2qTzDwsVbXO7tfelLadF95Fnpg0",
                      name: "Shrey Patel",
                    },
                    bedBookingId: "7PJLCUJoDbOt9lw7uRUg",
                    bedId: "bed_1",
                    dischargeMarked: false,
                    discharge_at: getTime(addDays(currentTime, 3)),
                    discharged_by: {
                      email: "pshrey0000@gmail.com",
                      id: "user_2qTzDwsVbXO7tfelLadF95Fnpg0",
                      name: "Shrey Patel",
                    },
                  },
                ]
              : [],
          registered_date: [getTime(startDate)],
          registered_date_time: [getTime(currentTime)],
          prescribed_date_time: index === 1 ? [getTime(currentTime)] : [],
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

      const bedRef = doc(db, `doctor/${doctorId}/beds/7PJLCUJoDbOt9lw7uRUg`);
      const bedPromise = setDoc(bedRef, {
        ...patients[2].bed_info[0],
        patient_id: patients[2].patient_id,
      });

      const samplePharmacyData: PharmacyTypes[] = [
        {
          bill_id: uniqid.time(),
          prescription_id: "RX-5001",
          name: "Amit Sharma",
          patient_id: "PAT-001",
          mobile: "9876543210",
          gender: "Male",
          medicines: [],
          services: [],
          generated_at: Date.now(),
          prescribed_by: {
            email: "pshrey0000@gmail.com",
            id: "user_2qTzDwsVbXO7tfelLadF95Fnpg0",
            name: "Shrey Patel",
          },
          generated_by: {
            email: "pshrey0000@gmail.com",
            id: "user_2qTzDwsVbXO7tfelLadF95Fnpg0",
            name: "Shrey Patel",
          },
          payment_status: "Paid",
          total_amount: 1200,
          discount: 100,
          payment_method: "UPI",
          tax_percentage: 5,
          notes: "Take after meals",
        },
        {
          bill_id: uniqid.time(),
          name: "Sneha Mehta",
          mobile: "9123456780",
          gender: "Female",
          medicines: [],
          services: [],
          generated_at: getTime(addDays(new Date(), -4)),
          prescribed_by: {
            email: "pshrey0000@gmail.com",
            id: "user_2qTzDwsVbXO7tfelLadF95Fnpg0",
            name: "Shrey Patel",
          },
          generated_by: {
            email: "pshrey0000@gmail.com",
            id: "user_2qTzDwsVbXO7tfelLadF95Fnpg0",
            name: "Shrey Patel",
          },
          payment_status: "Unpaid",
          total_amount: 850,
          tax_percentage: 12,
          discount:0,
        },
        {
          bill_id: uniqid.time(),
          prescription_id: "RX-5003",
          name: "Rahul Singh",
          patient_id: "PAT-003",
          mobile: "9988776655",
          gender: "Male",
          medicines: [],
          services: [],
          generated_at: getTime(addDays(new Date(), -2)),
          prescribed_by: {
            email: "pshrey0000@gmail.com",
            id: "user_2qTzDwsVbXO7tfelLadF95Fnpg0",
            name: "Shrey Patel",
          },
          generated_by: {
            email: "pshrey0000@gmail.com",
            id: "user_2qTzDwsVbXO7tfelLadF95Fnpg0",
            name: "Shrey Patel",
          },
          payment_status: "Refunded",
          total_amount: 500,
          discount: 50,
          payment_method: "Card",
          tax_percentage: 0,
          notes: "Refunded due to incorrect item",
        },
        {
          bill_id: uniqid.time(),
          name: "Priya Nair",
          mobile: "9090909090",
          gender: "Female",
          medicines: [],
          services: [],
          generated_at: getTime(addDays(new Date(), -10)),
          prescribed_by: {
            email: "pshrey0000@gmail.com",
            id: "user_2qTzDwsVbXO7tfelLadF95Fnpg0",
            name: "Shrey Patel",
          },
          generated_by: {
            email: "pshrey0000@gmail.com",
            id: "user_2qTzDwsVbXO7tfelLadF95Fnpg0",
            name: "Shrey Patel",
          },
          payment_status: "Not Required",
          total_amount: 0,
          notes: "Service provided free of charge",
          discount:0,
          tax_percentage:0,
        },
      ];

      const billPromises = samplePharmacyData.map((bill, index) => {
        const billRef = doc(db, `doctor/${doctorId}/bills/${bill.bill_id}`);
        const matchingPatient = patients[index];
        const newBill: PharmacyTypes = {
          ...bill,
          name: matchingPatient.name,
          patient_id: matchingPatient.patient_id,
        };

        return setDoc(billRef, newBill);
      });

      await Promise.all([...batchPromises, ...billPromises, bedPromise]);
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
