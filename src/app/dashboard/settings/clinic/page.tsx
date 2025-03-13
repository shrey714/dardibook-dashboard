"use client";
import React from "react";
import { OrganizationProfile } from "@clerk/nextjs";
import ClinicInfo from "@/components/Settings/ClinicInfo";

export default function SettingsClinicPage() {
  return (
    <>
      <ClinicInfo />
      <OrganizationProfile
        appearance={{
          elements: {
            rootBox: "mt-2 sm:mt-5 mx-auto max-w-4xl border rounded-lg w-full",
            cardBox: "bg-muted/30 dark:bg-gray-300 rounded-md shadow-none max-w-full w-full",
            navbar: {
              background: "none",
            },
            scrollBox: { background: "none" },
          },
        }}
        routing="hash"
      />
    </>
  );
}
