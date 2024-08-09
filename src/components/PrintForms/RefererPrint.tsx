/* eslint-disable @next/next/no-img-element */
"use client";
import React, { forwardRef } from "react";

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

interface HospitalInfo {
  doctorName?: string | "";
  clinicName?: string | "";
  degree? :string | ""; 
  registrationNumber? :string | ""; 
  emailId?: string | "";
  clinicNumber?: string | "";
  clinicAddress?: string | "";
  clinicLogo?: string | "/Logo.svg";
  signaturePhoto?: string | "/Logo.svg";
}

interface RefererInfo {
  doctorName: string;
  hospitalName: string;
  referMessage: string;
}

interface Props {
  patientInfo: PatientInfo;
  hospitalInfo: HospitalInfo;
  refererInfo: RefererInfo;
}

const RefererPrint = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { patientInfo, hospitalInfo, refererInfo } = props;

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
        <h3 className="text-xl font-semibold mb-2">Medical Referral Letter</h3>
        <table className="w-full border-collapse border border-gray-400">
          <tbody>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                Hospital Name
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {refererInfo?.hospitalName}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                Doctor Name
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {refererInfo?.doctorName}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                Message
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {refererInfo?.referMessage}
              </td>
            </tr>
          </tbody>
        </table>
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
RefererPrint.displayName = "Refer";

export default RefererPrint;
