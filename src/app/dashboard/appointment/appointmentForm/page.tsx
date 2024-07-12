"use client";
import FullAreaLoader from "@/components/common/FullAreaLoader";
import AppointmentForm from "@/components/forms/AppointmentForm";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import uniqid from "uniqid";
import { useAppSelector } from "@/redux/store";
import { getPatientById } from "@/app/services/getPatientById";
import NoPatientsFound from "@/components/Appointment/NoPatientsFound";
interface PatientFormDataTypes {
  last_visited: number;
  patient_unique_Id: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  gender: string;
  age: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
}

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const user = useAppSelector<any>((state) => state.auth.user);
  const patientId = searchParams.get("patientId");
  const [formLoader, setFormLoader] = useState(true);
  const [uniqueId] = useState(patientId ? patientId : uniqid.time());
  const [error, setError] = useState<string | null>(null); // State for error
  const [patientFormData, setPatientFormData] = useState<PatientFormDataTypes>({
    last_visited: new Date().getTime(),
    patient_unique_Id: uniqueId,
    first_name: "",
    last_name: "",
    mobile_number: "",
    gender: "Male",
    age: "",
    street_address: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    console.log("id", uniqueId);
    const getPatientData = async () => {
      if (patientId) {
        setFormLoader(true);
        const patientData = await getPatientById(patientId, user.uid);
        if (patientData.data) {
          setPatientFormData({
            ...patientData.data,
            last_visited: new Date().getTime(),
            patient_unique_Id: uniqueId,
          } as PatientFormDataTypes);
        } else {
          setError("No patient data available for the provided PatientID.");
        }
        setFormLoader(false);
      } else {
        setFormLoader(false);
      }
    };
    getPatientData();
  }, [patientId, uniqueId, user.uid]);

  return (
    <>
      {patientId && formLoader ? (
        <FullAreaLoader />
      ) : error ? (
        <NoPatientsFound message={error} />
      ) : (
        <div className="py-12">
          <AppointmentForm
            patientId={uniqueId}
            patientFormData={patientFormData}
            setPatientFormData={setPatientFormData}
          />
        </div>
      )}
    </>
  );
};

export default Page;
