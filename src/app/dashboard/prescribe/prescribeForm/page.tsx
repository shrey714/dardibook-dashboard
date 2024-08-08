"use client";
import React, { useState } from "react";
import { createPrescription } from "@/app/services/createPrescription";
import PrescribeForm from "@/components/forms/PrescribeForm";
import { useAppSelector } from "@/redux/store";
import uniqid from "uniqid";
import { useSearchParams } from "next/navigation";
import CustomModal from "@/components/BlockedModal";
import AttendedModal from "@/components/Prescribe/AttendedModal";

const Page = () => {
  const searchParams = useSearchParams();
  const user = useAppSelector<any>((state) => state.auth.user);
  const [submissionLoader, setSubmissionLoader] = useState(false);
  const patientId = searchParams.get("patientId");
  const [uniqueId] = useState(patientId ? patientId : uniqid.time());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receiptInfo, setReceiptInfo] = useState({
    particulars: [
      {
        title: "CONSULTATION FEES",
        amount: "",
      },
    ],
    totalAmount: "0.00",
  });
  const [formData, setFormData] = useState({
    diseaseDetail: "",
    advice: "",
    nextVisit: "",
    medicines: [
      {
        id: 1,
        medicineName: "",
        instruction: "",
        dosages: {
          morning: "",
          afternoon: "",
          evening: "",
          night: "",
        },
        duration: "",
      },
    ],
    refer: {
      hospitalName: "",
      doctorName: "",
      referMessage: "",
    },
  });

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setSubmissionLoader(true);
    // console.log({
    //   ...formData,
    //   uid: user.uid,
    //   id: patientId,
    // });
    const data = await createPrescription({
      ...formData,
      uid: user.uid,
      id: patientId,
      visitId: uniqueId,
    });
    console.log("status", data);
    if (data?.status === 200) {
      setIsModalOpen(true);
    }
    setSubmissionLoader(false);
  };

  return (
    <div className="w-full overflow-y-auto h-svh">
      <CustomModal isOpen={isModalOpen} mainScreenModal={true}>
        <AttendedModal
          isModalOpen={isModalOpen}
          setCloseModal={setIsModalOpen}
          patientID={patientId}
          uID={user.uid}
          PrescriptionAndReferData={formData}
          receiptInfo={receiptInfo}
        />
      </CustomModal>
      <PrescribeForm
        formData={formData}
        setFormData={setFormData}
        submissionLoader={submissionLoader}
        handleSubmit={handleSubmit}
        receiptInfo={receiptInfo as any}
        setReceiptInfo={setReceiptInfo}
      />
    </div>
  );
};

export default Page;
