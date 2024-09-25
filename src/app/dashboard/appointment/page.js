"use client";
import React, { useState } from "react";
import Link from "next/link";
import ReOrderingList from "@/components/Appointment/ReOrderingList";
export default function TShirtsPage() {
  const [patientId, setPatientId] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setPatientId(value);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 self-center py-12 flex flex-1 justify-center flex-col gap-8 items-center">
      <div className="join">
        <button className="btn animate-none btn-primary join-item sm:btn-sm md:btn-wide">
          Old Case
        </button>
        <Link
          href={"appointment/appointmentForm"}
          className="btn animate-none btn-outline btn-primary join-item sm:btn-sm md:btn-wide"
        >
          New Case
        </Link>
      </div>
      <div className="overflow-hidden w-full md:w-3/4 p-1 pt-3 pb-6 bg-white flex flex-col gap-6 items-center border-2 rounded-md border-gray-400/70">
        <label className="z-10 form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text font-bold text-base text-gray-700">
              Patient ID<span className="text-red-500 ml-1">*</span>
            </span>
          </div>
          <input
            type="text"
            placeholder="ID"
            value={patientId.trim()}
            onChange={handleInputChange}
            className="input text-lg input-bordered w-full max-w-xs tracking-[0.2rem]"
          />
        </label>
        <Link
          href={{
            pathname: "appointment/appointmentForm",
            query: { patientId: patientId },
          }}
          className={`btn animate-none ${
            patientId.length > 3 ? "btn-primary" : "btn-disabled"
          } md:btn-wide md:btn-md md:text-base z-30`}
        >
          Get Details
        </Link>
      </div>
      <div className="w-full md:w-3/4 p-0 flex flex-row items-center">
        <span className="flex flex-1 h-[2px] bg-gradient-to-r from-transparent via-primary to-gray-800"></span>
        <div className=" flex items-center justify-center">
          <p className="text-gray-800 w-auto px-3 py-1 font-semibold text-base bg-gray-300 rounded-full border-gray-800 border-[2px]">
            Today&apos;s Queue
          </p>
        </div>
        <span className="flex flex-1 h-[2px] bg-gradient-to-l from-transparent via-primary to-gray-800"></span>
      </div>
      <div className="w-full md:w-3/4 p-0 -mt-4">
        <ReOrderingList />
      </div>
    </div>
  );
}
