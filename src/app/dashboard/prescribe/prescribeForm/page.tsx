"use client";
import React, { useState } from "react";
import { createPrescription } from "@/app/services/createPrescription";
import PrescribeForm from "@/components/forms/PrescribeForm";
import uniqid from "uniqid";
import { useSearchParams } from "next/navigation";
import AttendedModal from "@/components/Prescribe/AttendedModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@clerk/nextjs";

const Page = () => {
  const { orgId } = useAuth();
  const searchParams = useSearchParams();
  const [submissionLoader, setSubmissionLoader] = useState(false);
  const patientId = searchParams.get("patientId");
  const [visitID] = useState(uniqid.time());
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
    diseaseId: uniqid(),
    diseaseDetail: "",
    advice: "",
    nextVisit: "",
    medicines: [
      {
        id: uniqid(),
        medicineName: "",
        instruction: "",
        dosages: {
          morning: "",
          afternoon: "",
          evening: "",
          night: "",
        },
        duration: 1,
        durationType: "day",
        type: "",
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
      uid: orgId,
      id: patientId,
      visitId: visitID,
    });
    console.log("status", data);
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
          <AttendedModal
            isModalOpen={isModalOpen}
            setCloseModal={setIsModalOpen}
            patientID={patientId}
            uID={orgId}
            PrescriptionAndReferData={formData}
            receiptInfo={receiptInfo}
          />
        </DialogContent>
      </Dialog>

      <PrescribeForm
        formData={formData}
        setFormData={setFormData}
        submissionLoader={submissionLoader}
        handleSubmit={handleSubmit}
        receiptInfo={receiptInfo}
        setReceiptInfo={setReceiptInfo}
      />
    </>
  );
};

export default Page;
