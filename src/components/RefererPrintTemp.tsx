/* eslint-disable @next/next/no-img-element */
"use client";
import React, { forwardRef, useRef } from "react";
import { useReactToPrint } from "react-to-print";



interface PatientInfo {
  patientID: string;
  visitedTime: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  gender: string;
  age: number;
  streetAddress: string;
  city: string;
  state: string;
  zipcode: string;
}



interface HospitalInfo {
  doctorName: string;
  clinicName: string;
  emailId: string;
  clinicNumber: string;
  clinicAddress: string;
  clinicLogo: string;
  signaturePhoto: string;
}

interface RefererInfo {
    doctorName: string;
    clinicName: string;
    message: string;
}

interface Props {
  patientInfo: PatientInfo;
  hospitalInfo: HospitalInfo;
  refererInfo: RefererInfo;
}

const Prescription = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const { patientInfo, hospitalInfo, refererInfo } = props;

  return (
    <div
      ref={ref}
      className="relative print-container px-8 py-4 font-sans max-w-[800px] mx-auto"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <img
            src={hospitalInfo.clinicLogo}
            alt="Clinic Logo"
            className="w-24"
          />
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold">{hospitalInfo.clinicName}</h2>
          <p className="text-sm">{hospitalInfo.clinicAddress}</p>
          <p className="text-sm">Email: {hospitalInfo.emailId}</p>
          <p className="text-sm">Phone: {hospitalInfo.clinicNumber}</p>
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
                {patientInfo.patientID}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                Visited Time
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {new Date(patientInfo.visitedTime).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                Name
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {patientInfo.firstName} {patientInfo.lastName}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                Mobile
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {patientInfo.mobileNumber}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                Gender
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {patientInfo.gender}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                Age
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {patientInfo.age}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                Address
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {patientInfo.streetAddress}, {patientInfo.city},{" "}
                {patientInfo.state}, {patientInfo.zipcode}
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
                {refererInfo.clinicName}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                Doctor Name
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {refererInfo.doctorName}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-1 pl-2 font-medium">
                Message
              </td>
              <td className="border border-gray-400 p-1 pl-2">
                {refererInfo.message}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="text-right mt-0">
        <p className="font-medium">Doctor: {hospitalInfo.doctorName}</p>
        <img
          src={hospitalInfo.signaturePhoto}
          alt="Doctor Signature"
          className="w-12 inline-block mt-2"
        />
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
Prescription.displayName = "Prescription";
const RefererPrintTemp: React.FC = () => {
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page { 
        size: A4; 
        margin: 5mm; 
      }
      body {
        -webkit-print-color-adjust: exact;
      }
      .print-container {
        position: relative;
        width: 100%;
        height: 100%;
      }
      .print-footer {
        content: 'This report generated by DardiBook software';
        position: absolute;
        bottom: 10px;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 10px;
        color: gray;
      }
      .bg-cover {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('/Logo.svg');
        background-size: 60% 60%;
        opacity: 0.1;
        z-index: -1;
      }
    `,
  });

  const patientInfo = {
    patientID: "P12345",
    visitedTime: new Date().toISOString(),
    firstName: "John",
    lastName: "Doe",
    mobileNumber: "1234567890",
    gender: "male",
    age: 30,
    streetAddress: "123 Main St",
    city: "Anytown",
    state: "Anystate",
    zipcode: "12345",
  };

  const hospitalInfo = {
    doctorName: "Dr. Smith",
    clinicName: "Good Health Clinic",
    emailId: "contact@goodhealth.com",
    clinicNumber: "0987654321",
    clinicAddress: "456 Health St, Wellcity, Wellness",
    clinicLogo: "/Logo.svg",
    signaturePhoto: "/Logo.svg",
  };

  const refererInfo = {
    doctorName:"Dr. Jeet Oza",
    clinicName:"Nirdesh Hospital",
    message:"Isko bhej rha hu thik karke de"
  }

  return (
    <div className="p-8">
      <button
        onClick={handlePrint}
        className="mb-8 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Print Prescription
      </button>
      <div ref={printRef} className="page">
        <Prescription
          patientInfo={patientInfo}
        //   prescriptionInfo={prescriptionInfo}
          hospitalInfo={hospitalInfo}
          refererInfo={refererInfo}
        />
      </div>
    </div>
  );
};

export default RefererPrintTemp;
