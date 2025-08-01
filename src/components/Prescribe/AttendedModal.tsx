import React, { useEffect, useState } from "react";
import animationData from "@/lottieFiles/Registered.json";
import Lottie from "react-lottie";
import Link from "next/link";
import { Button } from "../ui/button";
import { PrescriptionFormTypes } from "@/types/FormTypes";
import { Spinner } from "../ui/spinner";

interface AttendedModalProps {
  isModalOpen: boolean;
  setCloseModal: React.Dispatch<React.SetStateAction<boolean>>;
  patientID: string;
  PrescriptionAndReferData: PrescriptionFormTypes;
}

const AttendedModal: React.FC<AttendedModalProps> = ({
  isModalOpen,
  setCloseModal,
  patientID,
  PrescriptionAndReferData,
}) => {
  const [startAnimation, setStartAnimation] = useState(false);
  const [printDataLoader, setprintDataLoader] = useState(false);
  const [printOptions, setprintOptions] = useState({
    IsPrescription: PrescriptionAndReferData.diseaseDetail ? true : false,
    IsRefer: PrescriptionAndReferData.refer.hospitalName ? true : false,
    IsReceipt: true,
  });
  useEffect(() => {
    setprintOptions({
      IsPrescription: PrescriptionAndReferData.diseaseDetail ? true : false,
      IsRefer: PrescriptionAndReferData.refer.hospitalName ? true : false,
      IsReceipt: true,
    });
  }, [
    PrescriptionAndReferData.diseaseDetail,
    PrescriptionAndReferData.refer.hospitalName,
  ]);

  const defaultOptions = {
    loop: false,
    autoplay: startAnimation,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 500);

    return () => {
      setStartAnimation(false);
      clearTimeout(timer);
    };
  }, [isModalOpen]);

  return (
    <>
      <Lottie
        options={defaultOptions}
        height={100}
        width={100}
        isStopped={!startAnimation}
      />
      <h3 className="text-base md:text-lg font-semibold w-full text-center self-center">
        Prescription Generated.
      </h3>
      <div className="mt-6 flex flex-row flex-wrap items-end gap-x-4">
        <Button
          variant="secondary"
          type="button"
          onClick={() => setCloseModal(false)}
          className="flex flex-1"
        >
          Close
        </Button>
        <Button asChild variant={"ghost"}>
          <Link
            href={"./"}
            className="flex flex-1 rounded-md bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Go to Queue
          </Link>
        </Button>
        <div className="flex flex-1 flex-col border rounded-md w-full">
          <div className="flex items-center ps-4">
            <input
              id="Prescription"
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={printOptions.IsPrescription}
              onChange={(e) =>
                setprintOptions({
                  IsPrescription: e.target.checked,
                  IsRefer: printOptions.IsRefer,
                  IsReceipt: printOptions.IsReceipt,
                })
              }
            />
            <label
              htmlFor="Prescription"
              className="w-full py-2 ms-2 text-xs font-medium"
            >
              Prescription Report
            </label>
          </div>
          <div className="flex items-center ps-4 border-t">
            <input
              id="Refer"
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={printOptions.IsRefer}
              onChange={(e) =>
                setprintOptions({
                  IsPrescription: printOptions.IsPrescription,
                  IsRefer: e.target.checked,
                  IsReceipt: printOptions.IsReceipt,
                })
              }
            />
            <label
              htmlFor="Refer"
              className="w-full py-2 ms-2 text-xs font-medium"
            >
              Refer Report
            </label>
          </div>
          <div className="flex items-center ps-4 border-t">
            <input
              id="Receipt"
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={printOptions.IsReceipt}
              onChange={(e) =>
                setprintOptions({
                  IsPrescription: printOptions.IsPrescription,
                  IsRefer: printOptions.IsRefer,
                  IsReceipt: e.target.checked,
                })
              }
            />
            <label
              htmlFor="Receipt"
              className="w-full py-2 ms-2 text-xs font-medium"
            >
              Receipt
            </label>
          </div>
          {printDataLoader ? (
            <Button disabled variant={"outline"}>
              <Spinner size="md" />
            </Button>
          ) : (
            <>
              {/* <PrintHandeler
              styleForBtn={"bg-primary"}
              printOptions={printOptions}
              PrescriptionAndReferData={PrescriptionAndReferData}
              patientData={doctorAndPatientData?.patientData?.data}
              doctorData={doctorAndPatientData?.doctorData?.data}
              receiptInfo={PrescriptionAndReferData.receipt_details}
            /> */}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AttendedModal;
