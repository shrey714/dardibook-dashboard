"use client";
import PersonalInfo from "@/components/Settings/PersonalInfo";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/store";
import ClinicInfo from "@/components/Settings/ClinicInfo";
import SubscriptionInfo from "@/components/Settings/SubscriptionInfo";
import Links from "@/components/Settings/Links";
import FooterLine from "@/components/Settings/FooterLine";
import { getDocotr } from "@/app/services/getDoctor";
import StaffRolesInfo from "@/components/Settings/StaffRoles/StaffRolesInfo";
import MedicineInfo from "@/components/Settings/MedicineInfo/MedicineInfo";
import DiseaseInfo from "@/components/Settings/DiseaseInfo/DiseaseInfo";

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
  clinicLogo: any;
  signaturePhoto: any;
  subscriptionId: string;
  staff: Staff[];
}

const Page = () => {
  const userInfo = useAppSelector<any>((state) => state.auth.user);
  const [mainLoader, setmainLoader] = useState(false);
  const [doctorData, setdoctorData] = useState<DoctorInfo>({
    clinicName: "",
    doctorName: "",
    degree: "",
    registrationNumber: "",
    clinicNumber: "",
    phoneNumber: "",
    emailId: userInfo?.email,
    clinicAddress: "",
    clinicLogo: "",
    signaturePhoto: "",
    subscriptionId: "",
    staff: [],
  });
  useEffect(() => {
    const setDocotrData = async () => {
      if (userInfo) {
        setmainLoader(true);
        const doctorData = await getDocotr(userInfo?.uid);
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
  }, [userInfo]);

  return (
    <div className="w-full self-center py-12 px-4 sm:px-6 lg:px-8">
      <PersonalInfo userInfo={userInfo} />
      <ClinicInfo
        uid={userInfo.uid}
        role={userInfo?.role}
        doctorData={doctorData}
        mainLoader={mainLoader}
        setdoctorData={setdoctorData}
      />
      {userInfo?.role === "admin" && (
        <>
          <SubscriptionInfo
            subId={doctorData?.subscriptionId}
            mainLoader={mainLoader}
          />
          <StaffRolesInfo staff={doctorData.staff} uid={userInfo.uid} />
        </>
      )}
      {(userInfo?.role === "admin" || userInfo?.role === "subDoctor") && (
        <>
          <DiseaseInfo uid={userInfo.uid} />
          <MedicineInfo uid={userInfo.uid} />
        </>
      )}
      <Links />
      <FooterLine />
    </div>
  );
};

export default Page;
