"use client";
import { useEffect, useState } from "react";
import SubscriptionInfo from "@/components/Settings/SubscriptionInfo";
import { useAuth, useUser } from "@clerk/nextjs";
import { getDocotr } from "@/app/services/getDoctor";

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
}

export default function SettingsSubscriptionPage() {
  const { user, isLoaded } = useUser();
  const { orgId } = useAuth();

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
    <div className="w-full py-2 sm:py-5 px-2 md:px-5 2xl:flex 2xl:flex-row 2xl:gap-5 2xl:justify-center">
      <SubscriptionInfo
        subId={doctorData?.subscriptionId}
        mainLoader={mainLoader}
      />
    </div>
  );
}
