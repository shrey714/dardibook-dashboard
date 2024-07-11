"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import ReOrderingList from "@/components/Appointment/ReOrderingList";
export default function TShirtsPage() {
  const [patientId, setPatientId] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setPatientId(value);
  };

  return (
    <div className="self-center py-12 flex flex-1 justify-center flex-col gap-8 items-center">
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
      <div className="w-full md:w-3/4 p-1 pt-3 pb-6 bg-white rounded-lg flex flex-col gap-6 items-center shadow-[0px_0px_0px_1px_#a0aec0]">
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text font-bold text-base text-gray-700">
              Patient ID*
            </span>
          </div>
          <input
            type="text"
            placeholder="ID"
            value={patientId}
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
          } md:btn-wide md:btn-md md:text-lg`}
        >
          Get Details
        </Link>
      </div>
      <div className="w-full p-1 bg-white flex rounded-lg flex-col shadow-[0px_0px_0px_1px_#a0aec0]">
        <ReOrderingList />
      </div>
    </div>
  );
}
