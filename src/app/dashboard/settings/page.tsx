"use client";
import PersonalInfo from "@/components/Settings/PersonalInfo";
import React, { useEffect, useState } from "react";
import ClinicInfo from "@/components/Settings/ClinicInfo";
import SubscriptionInfo from "@/components/Settings/SubscriptionInfo";
import Links from "@/components/Settings/Links";
import FooterLine from "@/components/Settings/FooterLine";
import { getDocotr } from "@/app/services/getDoctor";
import StaffRolesInfo from "@/components/Settings/StaffRoles/StaffRolesInfo";
import MedicineInfo from "@/components/Settings/MedicineInfo/MedicineInfo";
import DiseaseInfo from "@/components/Settings/DiseaseInfo/DiseaseInfo";
import { useAuth, useUser } from "@clerk/nextjs";

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

const Page = () => {
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
    <div className="w-full self-center pb-12 pt-6 px-4 sm:px-6 lg:px-8">
      <PersonalInfo userInfo={user} role={orgRole} />
      <ClinicInfo
        uid={orgId}
        role={orgRole}
        doctorData={doctorData}
        mainLoader={mainLoader}
        setdoctorData={setdoctorData}
      />
      {orgRole === "org:clinic_head" && (
        <>
          <SubscriptionInfo
            subId={doctorData?.subscriptionId}
            mainLoader={mainLoader}
          />
          <StaffRolesInfo staff={doctorData.staff} uid={orgId} />
        </>
      )}
      {(orgRole === "org:clinic_head" ||
        orgRole === "org:doctor" ||
        orgRole === "org:assistant_doctor") && (
        <>
          <DiseaseInfo uid={orgId} />
          <MedicineInfo uid={orgId} />
        </>
      )}
      <Links />
      <FooterLine />
    </div>
  );
};

export default Page;
