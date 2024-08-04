import React, { useEffect, useState } from "react";
import * as animationData from "@/lottieFiles/Registered.json";
import Lottie from "react-lottie";
import Link from "next/link";
import PrintHandeler from "@/components/PrintForms/PrintHandeler";
import getDataToPrint from "@/app/services/getDataToPrint";
const AttendedModal = ({
  isModalOpen,
  setCloseModal,
  patientID,
  uID,
  PrescriptionAndReferData,
}: any) => {
  const [startAnimation, setStartAnimation] = useState(false);
  const [printDataLoader, setprintDataLoader] = useState(false);
  const [printOptions, setprintOptions] = useState({
    IsPrescription: PrescriptionAndReferData.diseaseDetail ? true : false,
    IsRefer: PrescriptionAndReferData.refer.hospitalName ? true : false,
  });
  const [doctorAndPatientData, setdoctorAndPatientData] = useState<any>({});
  useEffect(() => {
    setprintOptions({
      IsPrescription: PrescriptionAndReferData.diseaseDetail ? true : false,
      IsRefer: PrescriptionAndReferData.refer.hospitalName ? true : false,
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

  useEffect(() => {
    const getPrintData = async () => {
      if (uID && patientID) {
        setprintDataLoader(true);
        const patientData = await getDataToPrint(uID, patientID);
        if (patientData.status === 200) {
          // console.log(patientData);
          setdoctorAndPatientData(patientData);
        } else {
          console.log("No data available for the provided PatientID.");
        }
        setprintDataLoader(false);
      } else {
        setprintDataLoader(false);
      }
    };
    getPrintData();
  }, [patientID, uID]);

  return (
    <>
      <Lottie
        options={defaultOptions}
        height={100}
        width={100}
        isStopped={!startAnimation}
      />
      <h3 className="text-base md:text-lg font-semibold self-center text-gray-800">
        Prescription Generated.
      </h3>
      <div className="mt-6 flex items-end gap-x-4">
        <button
          type="button"
          onClick={() => setCloseModal(false)}
          className="flex flex-1 btn btn-outline text-sm font-semibold leading-6 text-gray-900"
        >
          Edit
        </button>
        <Link
          href={"./"}
          className="flex flex-1 btn rounded-md bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Go to queue
        </Link>
        <div className="join join-vertical flex flex-1">
          <div className="join-item bg-gray-300">
            <div className="join-item flex items-center ps-4 border">
              <input
                id="Prescription"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={printOptions.IsPrescription}
                onChange={(e) =>
                  setprintOptions({
                    IsPrescription: e.target.checked,
                    IsRefer: printOptions.IsRefer,
                  })
                }
              />
              <label
                htmlFor="Prescription"
                className="w-full py-2 ms-2 text-xs font-medium text-gray-500"
              >
                Prescription Report
              </label>
            </div>
            <div className="join-item flex items-center ps-4 border border-t-0">
              <input
                id="Refer"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={printOptions.IsRefer}
                onChange={(e) =>
                  setprintOptions({
                    IsPrescription: printOptions.IsPrescription,
                    IsRefer: e.target.checked,
                  })
                }
              />
              <label
                htmlFor="Refer"
                className="w-full py-2 ms-2 text-xs font-medium text-gray-500"
              >
                Refer Report
              </label>
            </div>
          </div>
          {printDataLoader ? (
            <button
              disabled
              className="skeleton bg-gray-300 btn join-item flex flex-1 disabled:bg-gray-300 disabled:border-opacity-100 border-gray-200"
            ></button>
          ) : (
            <PrintHandeler
              styleForBtn={
                "flex flex-1 border-gray-200 btn border-gray-300 hover:border-gray-300 btn-success join-item text-sm font-semibold leading-6 text-white"
              }
              printOptions={printOptions}
              PrescriptionAndReferData={PrescriptionAndReferData}
              patientData={doctorAndPatientData?.patientData?.data}
              doctorData={doctorAndPatientData?.doctorData?.data}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AttendedModal;
