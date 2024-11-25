import React, { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { useAppSelector } from "@/redux/store";
import { getPatientHistory } from "@/app/services/getPatientHistory";

const MedicalReport = ({ patientId, selectedPatientId }: any) => {
  const [loading, setloading] = useState(false);
  const [prescriptionData, setprescriptionData] = useState<any>(null);
  const user = useAppSelector<any>((state) => state.auth.user);

  useEffect(() => {
    const getPatientData = async () => {
      if (patientId && user.uid && patientId === selectedPatientId) {
        setloading(true);
        const patientData = await getPatientHistory(patientId, user.uid);
        if (patientData) {
          setprescriptionData(patientData?.prescriptions?.pop());
          setloading(false);
        } else {
          console.log("No patient data available for the provided PatientID.");
          setloading(false);
        }
      }
    };
    getPatientData();
  }, [selectedPatientId, user.uid]);

  return loading ? (
    <Loader size="medium" color="text-primary" secondaryColor="text-gray-300" />
  ) : prescriptionData !== null ? (
    <div className="w-full h-full overflow-y-auto md:overflow-y-scroll md:mr-[52px]">
      {/* Disease text area */}
      <div className="col-span-full p-4 md:px-8">
        <label
          htmlFor="diseaseDetail"
          className="block text-lg font-semibold leading-7 text-gray-900"
        >
          Disease and Diagnosis
        </label>
        <div className="mt-2">
          <div
            id="diseaseDetail"
            className="w-full rounded-md p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
          >
            {prescriptionData?.diseaseDetail}
          </div>
        </div>
      </div>

      {/* Medicine list */}
      <div className="mt-0 col-span-full">
        <label className="block px-4 md:px-8 text-lg ext-base font-semibold leading-7 text-gray-900">
          Medicines
        </label>

        <div className="container mx-auto px-1 text-center">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Instruction</th>
                <th>Dosages</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {prescriptionData?.medicines?.map((row: any, index: any) => (
                <tr key={row.id} className={`${row.id}`}>
                  <td className="align-top p-1">
                    <div className="w-full rounded-md p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-xs sm:text-sm sm:leading-6">
                      {row.medicineName}
                    </div>
                  </td>
                  <td className="align-top p-1">
                    <div className="w-full rounded-md p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-xs sm:text-sm sm:leading-6">
                      {row.instruction}
                    </div>
                  </td>
                  <td className="align-top p-1">
                    <div className="w-full rounded-md p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 text-xs sm:text-sm sm:leading-6">
                      {["morning", "afternoon", "evening", "night"].map(
                        (status, index) => {
                          const value = row?.dosages[status] || 0;
                          return (
                            <span key={index} className="text-gray-800">{`${
                              index !== 0 ? "-" : ""
                            }${value}`}</span>
                          );
                        }
                      )}
                      <br className="md:hidden" />
                      <span className="text-primary ml-0 font-medium md:ml-2" >{row?.type || ""}</span>
                    </div>
                  </td>
                  <td className="align-top p-1 flex flex-row items-center gap-2">
                    <div className="w-full rounded-md p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 text-xs sm:text-sm sm:leading-6">
                      {`${row?.duration || ""}${" "}${
                        row.durationType
                          ? `${row.durationType}${row.duration > 1 ? "s" : ""}`
                          : ""
                      }`}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advice or special instructions text area */}
      <div className="col-span-full p-4 md:px-8">
        <label
          htmlFor="diseaseDetail"
          className="block text-lg font-semibold leading-7 text-gray-900"
        >
          Advice or special instructions
        </label>
        <div className="mt-2">
          <div
            id="diseaseDetail"
            className="w-full rounded-md p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6"
          >
            {prescriptionData?.advice}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="font-semibold text-red-600 text-sm md:text-base lg:text-lg p-2">
      Something went wrong.
    </div>
  );
};

export default MedicalReport;
