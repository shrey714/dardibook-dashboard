"use client";
import AppointmentForm from "@/components/forms/AppointmentForm";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import uniqid from "uniqid";
import { useAppSelector } from "@/redux/store";
import { getPatientById } from "@/app/services/getPatientById";
import NoPatientsFound from "@/components/Appointment/NoPatientsFound";
import { RegisterPatient } from "@/app/services/registerPatient";
import CustomModal from "@/components/BlockedModal";
import RegisteredModal from "@/components/Appointment/RegisteredModal";
import Loader from "@/components/common/Loader";
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
  const [submissionLoader, setSubmissionLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    setSubmissionLoader(true);
    e.preventDefault();
    // console.log("data form==", {
    //   ...patientFormData,
    //   uid: user.uid,
    //   id: uniqueId,
    // });
    const data = await RegisterPatient({
      ...patientFormData,
      uid: user.uid,
      id: uniqueId,
    });
    // open modal on submitting the register patoent form
    if (data?.status === 200) {
      setIsModalOpen(true);
    }
    setSubmissionLoader(false);
  };

  return (
    <div className="w-full overflow-y-auto h-svh">
      <CustomModal isOpen={isModalOpen} mainScreenModal={true}>
        <RegisteredModal
          isModalOpen={isModalOpen}
          setCloseModal={setIsModalOpen}
        />
      </CustomModal>
      {patientId && formLoader ? (
        <div className="w-full h-svh overflow-hidden flex items-center justify-center z-50">
          <Loader
            size="medium"
            color="text-primary"
            secondaryColor="text-white"
          />
        </div>
      ) : error ? (
        <NoPatientsFound message={error} />
      ) : (
        <div className="my-12">
          <AppointmentForm
            patientFormData={patientFormData}
            setPatientFormData={setPatientFormData}
            handleSubmit={handleSubmit}
            submissionLoader={submissionLoader}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
