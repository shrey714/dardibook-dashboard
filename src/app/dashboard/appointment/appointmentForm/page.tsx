"use client";
import AppointmentForm from "@/components/forms/AppointmentForm";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import uniqid from "uniqid";
import { useAppSelector } from "@/redux/store";
import { getPatientById } from "@/app/services/getPatientById";
import NoPatientsFound from "@/components/Appointment/NoPatientsFound";
import { RegisterPatient } from "@/app/services/registerPatient";
import RegisteredModal from "@/components/Appointment/RegisteredModal";
import Loader from "@/components/common/Loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
    <>
      <Dialog
        open={isModalOpen}
        onOpenChange={(state) => setIsModalOpen(state)}
      >
        <DialogContent className="md:max-w-screen-md">
          <DialogHeader>
            <DialogTitle hidden>PRINT</DialogTitle>
            <DialogDescription hidden>DESC</DialogDescription>
          </DialogHeader>
          <RegisteredModal
            isModalOpen={isModalOpen}
            setCloseModal={setIsModalOpen}
          />
        </DialogContent>
      </Dialog>

      {patientId && formLoader ? (
        <div className="w-full h-full overflow-hidden flex items-center justify-center z-50">
          <Loader size="medium" />
        </div>
      ) : error ? (
        <NoPatientsFound message={error} />
      ) : (
        <div className="mb-12 mt-6">
          <AppointmentForm
            patientFormData={patientFormData}
            setPatientFormData={setPatientFormData}
            handleSubmit={handleSubmit}
            submissionLoader={submissionLoader}
          />
        </div>
      )}
    </>
  );
};

export default Page;
