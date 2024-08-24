"use client";
import PersonalInfo from "@/components/Settings/PersonalInfo";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/store";
import ClinicInfo from "@/components/Settings/ClinicInfo";
import SubscriptionInfo from "@/components/Settings/SubscriptionInfo";
import Links from "@/components/Settings/Links";
import FooterLine from "@/components/Settings/FooterLine";
import { getDocotr } from "@/app/services/getDoctor";
import MedicineInfo from "@/components/Settings/MedicineInfo";

interface DoctorInfo {
  clinicName: string;
  doctorName: string;
  degree:string;
  registrationNumber:string;
  clinicNumber: string;
  phoneNumber: string;
  emailId: string;
  clinicAddress: string;
  clinicLogo: any;
  signaturePhoto: any;
  subscriptionId: string;
}

const Page = () => {
  const userInfo = useAppSelector<any>((state) => state.auth.user);
  const [mainLoader, setmainLoader] = useState(false);
  const [doctorData, setdoctorData] = useState<DoctorInfo>({
    clinicName: "",
    doctorName: "",
    degree:"",
    registrationNumber:"",
    clinicNumber: "",
    phoneNumber: "",
    emailId: userInfo?.email,
    clinicAddress: "",
    clinicLogo: "",
    signaturePhoto: "",
    subscriptionId: "",
  });
  useEffect(() => {
    const setDocotrData = async () => {
      if (userInfo) {
        setmainLoader(true);
        const patientData = await getDocotr(userInfo?.uid);
        if (patientData.data) {
          setdoctorData(patientData.data);
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
        uid={userInfo?.uid}
        doctorData={doctorData}
        mainLoader={mainLoader}
        setdoctorData={setdoctorData}
      />
      <SubscriptionInfo
        subId={doctorData?.subscriptionId}
        mainLoader={mainLoader}
      />
      <MedicineInfo uid={userInfo?.uid}/>
      <Links />
      <FooterLine />
    </div>
  );
};

export default Page;
