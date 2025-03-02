"use client";
import React, { useEffect, useState } from "react";
import { getDocotr } from "@/app/services/getDoctor";
import { OrganizationProfile, useAuth, useUser } from "@clerk/nextjs";
import ClinicInfo from "@/components/Settings/ClinicInfo";

interface Staff {
  email: string;
  role: string;
}

interface DoctorInfo {
  clinicName: string;
  doctorName: string;
  degree: string;
  registrationNumber: string;
  clinicNumber: string;
  phoneNumber: string;
  emailId: string;
  clinicAddress: string;
  clinicLogo: string;
  signaturePhoto: string;
  subscriptionId: string;
  staff: Staff[];
}

export default function SettingsClinicPage() {
  const { user, isLoaded } = useUser();
  const { orgId, orgRole } = useAuth();

  const [mainLoader, setmainLoader] = useState(false);
  const [doctorData, setdoctorData] = useState<DoctorInfo>({
    clinicName: "",
    doctorName: "",
    degree: "",
    registrationNumber: "",
    clinicNumber: "",
    phoneNumber: "",
    emailId: user?.emailAddresses[0]?.emailAddress || "",
    clinicAddress: "",
    clinicLogo: "",
    signaturePhoto: "",
    subscriptionId: "",
    staff: [],
  });
  useEffect(() => {
    const setDocotrData = async () => {
      if (isLoaded && orgId) {
        setmainLoader(true);
        const doctorData = await getDocotr(orgId);
        if (doctorData.data) {
          setdoctorData(doctorData.data);
        } else {
          console.log("No data available for the provided DoctorID.");
        }
        setmainLoader(false);
      } else {
        setmainLoader(false);
      }
    };
    setDocotrData();
  }, [isLoaded, orgId]);

  return (
    <>
      <ClinicInfo
        uid={orgId}
        role={orgRole}
        doctorData={doctorData}
        mainLoader={mainLoader}
        setdoctorData={setdoctorData}
      />
      <OrganizationProfile
        appearance={{
          elements: {
            rootBox: "mt-5 mx-auto max-w-4xl border-2 rounded-lg",
            cardBox: "bg-muted/30 dark:bg-gray-300 rounded-md shadow-none",
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
