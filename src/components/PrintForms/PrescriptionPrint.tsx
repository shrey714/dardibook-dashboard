/* eslint-disable @next/next/no-img-element */
"use client";
import React, { forwardRef } from "react";

interface Dosage {
  morning?: string | "";
  afternoon?: string | "";
  evening?: string | "";
  night?: string | "";
}

interface Medicine {
  medicineName: string;
  instruction: string;
  dosages: Dosage;
  duration: string;
  durationType: string;
  type: string;
}

interface PatientInfo {
  patient_unique_Id?: string | "";
  last_visited?: string | "";
  first_name?: string | "";
  last_name?: string | "";
  mobile_number?: string | "";
  gender?: string | "";
  age?: number | 0;
  street_address?: string | "";
  city?: string | "";
  state?: string | "";
  zip?: string | "";
}

interface PrescriptionInfo {
  diseaseDetail: string;
  medicines: Medicine[];
  advice: string;
  nextVisit: string;
}

interface HospitalInfo {
  doctorName?: string | "";
  clinicName?: string | "";
  degree?: string | "";
  registrationNumber?: string | "";
  emailId?: string | "";
  clinicNumber?: string | "";
  clinicAddress?: string | "";
  clinicLogo?: string | "/Logo.svg";
  signaturePhoto?: string | "/Logo.svg";
}

interface Props {
  patientInfo: PatientInfo;
  prescriptionInfo: PrescriptionInfo;
  hospitalInfo: HospitalInfo;
}

const countableTypes = ["TAB", "CAP", "DROP", "INJECTION", "SUPPOSITORY"]; // Add more types as needed

function calculateTotalMedicinesRequired(medicine: Medicine): any {
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

const PrescriptionPrint = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { patientInfo, prescriptionInfo, hospitalInfo } = props;

  return (
    <div
      ref={ref}
      className="relative print-container px-8 py-4 font-sans max-w-[800px] mx-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <img
            src={hospitalInfo?.clinicLogo}
            alt="Clinic Logo"
            className="w-24"
          />
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold">{hospitalInfo?.clinicName}</h2>
          <p className="text-sm">{hospitalInfo?.clinicAddress}</p>
          <p className="text-sm">Email: {hospitalInfo?.emailId}</p>
          <p className="text-sm">Phone: {hospitalInfo?.clinicNumber}</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Patient Information</h3>
        <table className="w-full border-collapse border border-gray-400">
          <tbody>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                ID
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {patientInfo?.patient_unique_Id}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                Visited Time
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {new Date(
                  patientInfo?.last_visited ? patientInfo?.last_visited : ""
                ).toLocaleString("en-GB")}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                Name
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {patientInfo?.first_name} {patientInfo?.last_name}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                Age
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {patientInfo?.age}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                Gender
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {patientInfo?.gender}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                Address
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {[
                  patientInfo?.street_address,
                  patientInfo?.city,
                  patientInfo?.state,
                  patientInfo?.zip,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                Mobile
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {patientInfo?.mobile_number}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Prescription Information</h3>
        <p className="mb-4">
          <span className="font-medium">Disease Detail:</span>{" "}
          {prescriptionInfo?.diseaseDetail}
        </p>

        <div className="col-span-full pb-4">
          <label className="block text-lg mb-2 font-semibold leading-7">
            Medicines
          </label>

          <div className="text-center">
            <table className="table w-full border border-gray-400 ">
              <thead>
                <tr>
                  <th className="font-medium text-base text-gray-800 border border-gray-400 py-[6px]">
                    Medicine Name
                  </th>
                  <th className="font-medium text-base text-gray-800 border border-gray-400 py-[6px]">
                    Instruction
                  </th>
                  <th className="font-medium text-base text-gray-800 border border-gray-400 py-[6px]">
                    Dosages
                  </th>
                  <th className="font-medium text-base text-gray-800 border border-gray-400 py-[6px]">
                    Duration
                  </th>
                  <th className="font-medium text-base text-gray-800 border border-gray-400 py-[6px]">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {prescriptionInfo?.medicines?.map((row: any, index: any) => (
                  <tr key={index}>
                    <td className="align-top py-[2px] border border-gray-400">
                      <div className="w-full border-0 text-gray-900 bg-transparent">
                        {row?.medicineName}
                      </div>
                    </td>
                    <td className="align-top py-[2px] border border-gray-400">
                      <div className="w-full border-0 text-gray-900 bg-transparent">
                        {row?.instruction}
                      </div>
                    </td>
                    <td className="align-top py-[2px] border border-gray-400 w-1/3">
                      <div key={index} className={"flex flex-col items-center"}>
                        {["morning", "afternoon", "evening", "night"].map(
                          (status) => {
                            const value = row?.dosages[status];
                            if (value && value !== "0" && value.trim() !== "") {
                              return (
                                <div
                                  key={status}
                                  className="w-full border-0 py-[1px] text-gray-900 bg-transparent"
                                >
                                  {`${
                                    status.charAt(0).toUpperCase() +
                                    status.slice(1)
                                  }: ${value} ${row?.type || ""}`}
                                </div>
                              );
                            }
                            return null;
                          }
                        )}
                      </div>
                    </td>
                    <td className="align-top py-[2px] border border-gray-400">
                      <div className="w-full border-0 text-gray-900 bg-transparent">
                        {row?.duration || ""}{" "}
                        {row.durationType
                          ? `${row.durationType}${row.duration > 1 ? "s" : ""}`
                          : ""}
                      </div>
                    </td>
                    <td className="align-top py-[2px] border border-gray-400">
                      <div className="w-full border-0 text-gray-900 bg-transparent">
                        {calculateTotalMedicinesRequired(row)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mb-2">
          <span className="font-medium">Advice:</span>{" "}
          {prescriptionInfo?.advice}
        </p>
        <p>
          <span className="font-medium">Next Visit:</span>{" "}
          {prescriptionInfo?.nextVisit
            ? new Date(prescriptionInfo?.nextVisit).toLocaleDateString()
            : ""}
        </p>
      </div>

      <div className="text-right mt-0">
        <img
          src={hospitalInfo?.signaturePhoto}
          alt="Doctor Signature"
          className="w-12 inline-block mt-2"
        />
        <p className="font-medium">{hospitalInfo?.doctorName}</p>
        <p className="font-medium">{hospitalInfo?.degree}</p>
        <p className="font-medium">{hospitalInfo?.registrationNumber}</p>
      </div>

      <div className="fixed bottom-0 w-full text-center print-footer">
        This report generated by DardiBook software
      </div>

      <div
        className="fixed top-[25%] left-[25%] w-[50%] h-[50%] bg-cover opacity-20 z-[-1]"
        style={{ backgroundImage: "url(/Logo.svg)" }}
      ></div>
    </div>
  );
});
PrescriptionPrint.displayName = "Prescription";

export default PrescriptionPrint;
