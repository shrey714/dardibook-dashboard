import React, { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { useAppSelector } from "@/redux/store";
import { getPatientHistory } from "@/app/services/getPatientHistory";
import { getDocotr } from "@/app/services/getDoctor";
import PrintHandeler from "../PrintForms/PrintHandeler";

const countableTypes = ["TAB", "CAP", "DROP", "INJECTION", "SUPPOSITORY"]; // Add more types as needed
const MedicalReport = ({ patient, selectedPatientId }: any) => {
  const [loading, setloading] = useState(false);
  const [prescriptionData, setprescriptionData] = useState<any>(null);
  const [doctorData, setDoctorData] = useState<any | null>(null);
  const user = useAppSelector<any>((state) => state.auth.user);
  const [printLoader, setprintLoader] = useState<boolean>(false);
  // Handle input change
  const handleChange = (id: string, value: string) => {
    setprescriptionData((prevData: any) => {
      const updatedMedicines = prevData.medicines.map((medicine: any) => {
        if (medicine.id === id) {
          return {
            ...medicine,
            amount: value,
          };
        }
        return medicine;
      });

      return {
        ...prevData,
        medicines: updatedMedicines,
      };
    });
  };

  useEffect(() => {
    const getPatientData = async () => {
      if (
        patient?.patient_unique_Id &&
        user.uid &&
        patient?.patient_unique_Id === selectedPatientId
      ) {
        setloading(true);
        const patientData = await getPatientHistory(
          patient?.patient_unique_Id,
          user.uid
        );
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
  }, [patient?.patient_unique_Id, selectedPatientId, user.uid]);

  useEffect(() => {
    const getPatientData = async () => {
      if (user.uid) {
        setprintLoader(true);
        const doctorData = await getDocotr(user.uid);
        if (doctorData.data) {
          setDoctorData(doctorData.data);
          setprintLoader(false);
        } else {
          setprintLoader(false);
        }
      } else {
        console.log("PatientID ot userId is not provided");
        setprintLoader(false);
      }
    };
    getPatientData();
  }, [user.uid]);

  function calculateTotalMedicinesRequired(medicine: any): any {
    let totalMedicines = 0;

    if (countableTypes.includes(medicine?.type)) {
      const {
        morning = "",
        afternoon = "",
        evening = "",
        night = "",
      } = medicine?.dosages;

      const totalDosage =
        (parseInt(morning) || 0) +
        (parseInt(afternoon) || 0) +
        (parseInt(evening) || 0) +
        (parseInt(night) || 0);

      let durationDays = parseInt(medicine?.duration) || 1;
      switch (medicine.durationType) {
        case "month":
          durationDays *= 30; // Assuming an average of 30 days in a month
          break;
        case "year":
          durationDays *= 365; // Assuming 365 days in a year
          break;
        // No need to adjust for "day" since it's already in days
        default:
          break;
      }
      totalMedicines += totalDosage * durationDays;
    } else {
      return "";
    }

    return totalMedicines;
  }

  return loading ? (
    <Loader size="medium" />
  ) : prescriptionData !== null ? (
    <div className="w-full h-full overflow-y-auto md:overflow-y-scroll mr-0 md:mr-[52px] flex flex-col pb-24">
      {/* Disease text area */}
      <div className="col-span-full p-4 md:px-8">
        <label
          htmlFor="diseaseDetail"
          className="block text-lg font-semibold leading-7"
        >
          Disease and Diagnosis
        </label>
        <div className="mt-2">
          <div
            id="diseaseDetail"
            className="w-full rounded-md p-1.5 shadow-sm ring-1 ring-inset ring-ring sm:text-sm sm:leading-6"
          >
            {prescriptionData?.diseaseDetail}
          </div>
        </div>
      </div>

      {/* Medicine list */}
      <div className="mt-0 col-span-full">
        <label className="block px-4 md:px-8 text-lg ext-base font-semibold leading-7">
          Medicines
        </label>

        <form
          className="container mx-auto px-1 text-center"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <table className="table w-full">
            <thead className="hidden sm:table-header-group">
              <tr>
                <th>Medicine Name</th>
                <th>Dosages</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {prescriptionData?.medicines?.map((row: any, index: any) => (
                <tr
                  key={row.id}
                  className={`${row.id} border-primary border-b-[1px] sm:border-0 flex flex-col sm:table-row`}
                >
                  <td className="align-top p-1">
                    <div className="w-full rounded-md p-1.5 shadow-sm ring-1 ring-inset ring-ring text-xs sm:text-sm sm:leading-6 text-start">
                      {row.medicineName}
                      <br />
                      <span
                        className={`border-ring rounded-sm ${
                          row.instruction ? "px-2 border" : ""
                        }`}
                      >
                        {row.instruction}
                      </span>
                    </div>
                  </td>
                  <td className="align-top p-1">
                    <div className="w-full rounded-md p-1.5 shadow-sm ring-1 ring-inset ring-ring text-xs sm:text-sm sm:leading-6 flex flex-row gap-2 flex-wrap">
                      <span>
                        {["morning", "afternoon", "evening", "night"].map(
                          (status, index) => {
                            const value = row?.dosages[status] || 0;
                            return (
                              <span key={index}>{`${
                                index !== 0 ? "-" : ""
                              }${value}`}</span>
                            );
                          }
                        )}
                      </span>
                      <span className="rounded-sm px-2 border-primary border-[1px]">
                        {`${row?.duration || ""}${" "}${
                          row.durationType
                            ? `${row.durationType}${
                                row.duration > 1 ? "s" : ""
                              }`
                            : ""
                        }`}
                      </span>
                      <div className="border border-ring rounded-sm px-2 flex flex-row items-center gap-2">
                        {calculateTotalMedicinesRequired(row)}
                        <span className="text-primary font-medium">
                          {row?.type || ""}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="align-top p-1 flex flex-row items-center gap-2">
                    <div className="w-full rounded-md text-gray-900 bg-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 text-xs sm:text-sm sm:leading-6 flex flex-row items-center gap-2 pl-2">
                      &#8377;
                      <input
                        type="number"
                        name="price"
                        required={true}
                        placeholder="price"
                        autoComplete="new-off"
                        value={row?.amount || ""}
                        onChange={(e) => handleChange(row.id, e.target.value)}
                        className="form-input flex flex-1 w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {prescriptionData?.medicines?.length !== 0 && !printLoader && (
            <PrintHandeler
              styleForBtn={"fixed bottom-3 left-1/2 transform -translate-x-1/2"}
              printOptions={{
                IsPrescription: false,
                IsRefer: false,
                IsMedical: true,
              }}
              PrescriptionAndReferData={prescriptionData}
              patientData={patient}
              doctorData={doctorData}
            />
          )}
        </form>
      </div>

      {/* Advice or special instructions text area */}
      <div className="col-span-full p-4 md:px-8">
        <label
          htmlFor="diseaseDetail"
          className="block text-lg font-semibold leading-7"
        >
          Advice or special instructions
        </label>
        <div className="mt-2">
          <div
            id="diseaseDetail"
            className="w-full rounded-md p-1.5 shadow-sm ring-1 ring-inset ring-ring sm:text-sm sm:leading-6"
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
