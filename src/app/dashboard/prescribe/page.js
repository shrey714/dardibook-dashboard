"use client";
import React from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import StatsHeader from "@/components/Prescribe/StatsHeader";
export default function Prescribe() {
  return (
    <div className="self-center py-12 flex flex-1 justify-center flex-col items-center px-4 sm:px-6 lg:px-8">
      <StatsHeader />
      <div className="w-full p-2 mt-8 mb-2 bg-white flex rounded-lg flex-col shadow-[0px_0px_0px_1px_#a0aec0]">
        <ArrowPathIcon className="size-4 text-black" />
      </div>
      <ul className="w-full min-h-52 p-1 bg-white flex rounded-lg flex-col shadow-[0px_0px_0px_1px_#a0aec0]">
        {Array.from(Array(20).keys())
          .map((val) => `${val}`)
          .map((value, key) => (
            <li
              key={key}
              style={{
                padding: "4px 4px 4px 4px",
                margin: "0 0 0.25rem 0",
                listStyleType: "none",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                border: "2px solid #CCC",
                color: "#333",
                borderRadius: "5px",
                backgroundColor: "#FFF",
              }}
            >
              <div className="rounded-md mx-1 aspect-square h-6 text-white text-center font-medium bg-black">
                {value}
              </div>
              <button
                className={`rounded-md mx-1 p-1 aspect-square h-6 ${
                  value === "0" ? "bg-primary" : "bg-[#CCC]"
                }`}
              >
                <EyeIcon className="size-4 text-black" />
              </button>
              <div className="flex mx-1 flex-1"> {value}</div>
              <Link
                href={{
                  pathname: "prescribe/patientData",
                  query: { patientId: 12345 },
                }}
                className="mx-1 py-1 px-2 w-auto bg-[#ccc] rounded-[4px] font-semibold text-sm"
              >
                History
              </Link>
              <Link
                href={{
                  pathname: "prescribe/prescribeForm",
                  query: { patientId: 12345 },
                }}
                className="mx-1 py-1 px-2 w-auto bg-[#ccc] rounded-[4px] font-semibold text-sm"
              >
                Attend
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
}
