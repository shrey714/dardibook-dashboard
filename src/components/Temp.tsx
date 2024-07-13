"use client";
// pages/print-prescription.tsx
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface Medicine {
  medicineName: string;
  instruction: string;
  dosages: string[];
  duration: string;
}

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

interface PrescriptionInfo {
  diseaseDetail: string;
  medicines: Medicine[];
  advice: string;
  nextVisit: string;
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

interface Props {
  patientInfo: PatientInfo;
  prescriptionInfo: PrescriptionInfo;
  hospitalInfo: HospitalInfo;
}

const Prescription: React.FC<Props> = ({
  patientInfo,
  prescriptionInfo,
  hospitalInfo,
}) => {
  return (
    <div className="px-8 py-4 font-sans max-w-[800px] mx-auto"  style={{background:"rgba(255, 255, 255, 0.8)"}}>
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
        <h3 className="text-xl font-semibold mb-2">Prescription Information</h3>
        <p className="mb-4">
          <span className="font-medium">Disease Detail:</span>{" "}
          {prescriptionInfo.diseaseDetail}
        </p>

        <div className="col-span-full pb-4">
          <label className="block text-lg mb-2 font-semibold leading-7">
            Medicines
          </label>

          <div className="container text-center">
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
                </tr>
              </thead>
              <tbody>
                {prescriptionInfo?.medicines?.map((row: any, index: any) => (
                  <tr key={index}>
                    <td className="align-top p-1 border border-gray-400">
                      <div className="w-full border-0 py-1.5 text-gray-900 bg-transparent">
                        {row.medicineName}
                      </div>
                    </td>
                    <td className="align-top p-1 border border-gray-400">
                      <div className="w-full border-0 py-1.5 text-gray-900 bg-transparent">
                        {row.instruction}
                      </div>
                    </td>
                    <td className="align-top p-1 border border-gray-400 w-1/3">
                      {row?.dosages?.map((dosage: any, index: any) => (
                        <div key={index} className={"flex items-center mb-1"}>
                          <div className="w-full border-0 py-1.5 text-gray-900 bg-transparent">
                            {dosage}
                          </div>
                        </div>
                      ))}
                    </td>
                    <td className="align-top p-1 border border-gray-400">
                      <div className="w-full border-0 py-1.5 text-gray-900 bg-transparent">
                        {row.duration}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mb-2">
          <span className="font-medium">Advice:</span> {prescriptionInfo.advice}
        </p>
        <p>
          <span className="font-medium">Next Visit:</span>{" "}
          {new Date(prescriptionInfo.nextVisit).toLocaleDateString()}
        </p>
      </div>

      <div className="text-right mt-0">
        <p className="font-medium">Doctor: {hospitalInfo.doctorName}</p>
        <img
          src={hospitalInfo.signaturePhoto}
          alt="Doctor Signature"
          className="w-12 inline-block mt-2"
        />
      </div>
    </div>
  );
};

const PrintPrescriptionPage: React.FC = () => {
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle: `
      @page { 
        size: A4; 
        margin: 5mm; 
      }
        body {
        background: rgba(255, 255, 255, 0.5) url('/Logo.svg') no-repeat center center;
        background-size: 60% 60%;
      }
      @media print {
        .page {
          position: relative;
          width:100%;
          height:100%;
        }
        body:after {
          content: 'This report generated by DardiBook software';
          position: absolute;
          bottom: 10px;
          left: 0;
          width: 100%;
          text-align: center;
          font-size: 10px;
          color: gray;
        }
      }
    `,
  });

  // Temporary data for demonstration
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

  const prescriptionInfo = {
    diseaseDetail: "Common Cold",
    medicines: [
      {
        medicineName: "Paracetamol",
        instruction: "Take after meals",
        dosages: ["Morning", "Afternoon", "Evening"],
        duration: "5 days",
      },
      {
        medicineName: "Cough Syrup",
        instruction: "Take before sleep",
        dosages: ["Evening"],
        duration: "5 days",
      },
      {
        medicineName: "Paracetamol",
        instruction: "Take after meals",
        dosages: ["Morning", "Afternoon", "Evening"],
        duration: "5 days",
      },
      {
        medicineName: "Cough Syrup",
        instruction: "Take before sleep",
        dosages: ["Evening"],
        duration: "5 days",
      },      {
        medicineName: "Paracetamol",
        instruction: "Take after meals",
        dosages: ["Morning", "Afternoon", "Evening"],
        duration: "5 days",
      },
      {
        medicineName: "Cough Syrup",
        instruction: "Take before sleep",
        dosages: ["Evening"],
        duration: "5 days",
      },
      {
        medicineName: "Paracetamol",
        instruction: "Take after meals",
        dosages: ["Morning", "Afternoon", "Evening"],
        duration: "5 days",
      },
      {
        medicineName: "Cough Syrup",
        instruction: "Take before sleep",
        dosages: ["Evening"],
        duration: "5 days",
      },      {
        medicineName: "Paracetamol",
        instruction: "Take after meals",
        dosages: ["Morning", "Afternoon", "Evening"],
        duration: "5 days",
      },
      {
        medicineName: "Cough Syrup",
        instruction: "Take before sleep",
        dosages: ["Evening"],
        duration: "5 days",
      },      {
        medicineName: "Paracetamol",
        instruction: "Take after meals",
        dosages: ["Morning", "Afternoon", "Evening"],
        duration: "5 days",
      },
      {
        medicineName: "Cough Syrup",
        instruction: "Take before sleep",
        dosages: ["Evening"],
        duration: "5 days",
      },      {
        medicineName: "Paracetamol",
        instruction: "Take after meals",
        dosages: ["Morning", "Afternoon", "Evening"],
        duration: "5 days",
      },
      {
        medicineName: "Cough Syrup",
        instruction: "Take before sleep",
        dosages: ["Evening"],
        duration: "5 days",
      },
    ],
    advice: "Drink plenty of fluids and rest",
    nextVisit: new Date(
      new Date().setDate(new Date().getDate() + 7)
    ).toISOString(),
  };

  const hospitalInfo = {
    doctorName: "Dr. Smith",
    clinicName: "Good Health Clinic",
    emailId: "contact@goodhealth.com",
    clinicNumber: "0987654321",
    clinicAddress: "456 Health St, Wellcity, Wellness",
    clinicLogo: "/Logo.svg", // Make sure this path is correct
    signaturePhoto: "/Logo.svg", // Make sure this path is correct
  };

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
          prescriptionInfo={prescriptionInfo}
          hospitalInfo={hospitalInfo}
        />
      </div>
    </div>
  );
};

export default PrintPrescriptionPage;
