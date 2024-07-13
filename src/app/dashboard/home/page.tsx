"use client";
import { RegisterPatient } from "@/app/Services/register-patient";
import React from "react";
import Temp from "@/components/PrescriptionPrintTemp";
export default function Home() {

  const handleRegisterPatient = async ()=>{
    const sendData = {
      uid:"QemkOpAP0wOlBzWQ6WeQ8FIJpY32",
      last_visited : Date.now(),
      first_name : "jeet",
      last_name : "oza",
      mobile_number : 9876543210,
      gender : "male",
      age : 21,
      street_address : "address",
      city : "bangalore",
      state : "karnataka",
      zip : 27349
    }
    const data = await RegisterPatient(sendData)
    console.log(data,"jeet")
  }

  return (
    <div>
      <Temp />
    </div>
  );
}
