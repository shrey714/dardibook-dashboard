"use client";
import React from "react";
import { OrganizationProfile } from "@clerk/nextjs";
import ClinicInfo from "@/components/Settings/ClinicInfo";

export default function SettingsClinicPage() {
  return (
    <div className="w-full py-2 sm:py-5 px-1 md:px-5 2xl:flex 2xl:flex-row 2xl:gap-5 2xl:justify-center">
      <ClinicInfo />
      <OrganizationProfile
        appearance={{
          elements: {
            rootBox: "mt-2 sm:mt-5 2xl:mt-0 mx-auto 2xl:mx-0 max-w-4xl border rounded-lg w-full",
            cardBox: "bg-muted/30 dark:bg-gray-300 rounded-md shadow-none max-w-full w-full",
            navbar: {
              background: "none",
            },
            scrollBox: { background: "none" },
          },
        }}
        routing="hash"
      />
   </div>
  );
}
