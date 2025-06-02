import React from "react";

const PrescriptionPrint = ({ data }: { data: PrescriptionData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
        <div>
          <span className="font-medium">Patient ID:</span> {data.patient_id}
        </div>
        <div>
          <span className="font-medium">Patient Name:</span> {data.name}
        </div>
        <div>
          <span className="font-medium">Prescription ID:</span>{" "}
          {data.prescription_id} {data.prescription_for_bed && "(In Bed)"}
        </div>
        <div>
          <span className="font-medium">Prescription Date:</span>{" "}
          {new Date(data.created_at).toLocaleString("en-GB")}
        </div>
        <div>
          <span className="font-medium">Prescribing Doctor:</span>{" "}
          {data.prescribed_by}
        </div>
        {data.prescribed_by !== data.prescriber_assigned && (
          <div>
            <span className="font-medium">Prescriber Doctor:</span>{" "}
            {data.prescriber_assigned}
          </div>
        )}
      </div>

      {data.medicines.length > 0 && (
        <div>
          <h4 className="mb-1">
            <span className="font-medium">Disease Detail:</span>{" "}
            {data.diseaseDetail}
          </h4>
          <table className="w-full text-sm border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">
                  Medication
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  Instruction
                </th>
                <th className="border border-gray-300 p-2 text-left">Dosage</th>
                <th className="border border-gray-300 p-2 text-left">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {data.medicines.map((med, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2">
                    {med.medicineName} ({med.type})
                  </td>
                  <td className="border border-gray-300 p-2">
                    {med.instruction}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {med.dosages.morning} - {med.dosages.afternoon} -{" "}
                    {med.dosages.evening} - {med.dosages.night}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {med.duration} {med.durationType}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.receipt_details.length > 0 && (
        <table className="w-full text-sm border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">
                Receipt Type
              </th>
              <th className="border border-gray-300 p-2 text-left">
                Amount(₹)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.receipt_details.map((receipt, index) => (
              <tr key={index}>
                <td className="border border-gray-300 p-2">{receipt.title}</td>
                <td className="border border-gray-300 p-2">{receipt.amount}</td>
              </tr>
            ))}
            <tr>
              <td className="border border-gray-300 p-2 font-medium text-right">
                Total :
              </td>
              <td className="border border-gray-300 p-2">
                {data.receipt_details.reduce(
                  (sum, item) => sum + item.amount,
                  0
                )}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {data.advice && (
        <div>
          <h4 className="font-medium mb-1">Doctor's Advice:</h4>
          <p className="text-sm border border-gray-300 p-2 bg-gray-50 rounded">
            {data.advice}
          </p>
        </div>
      )}

      {data.nextVisit && (
        <div>
          <h4 className="font-medium mb-1">Next Visit:</h4>
          <p className="text-sm border border-gray-300 p-2 bg-gray-50 rounded">
            {data.nextVisit}
          </p>
        </div>
      )}

      {(data.refer.hospitalName ||
        data.refer.doctorName ||
        data.refer.referMessage) && (
        <div>
          <h4 className="font-medium mb-1">Referral Letter:</h4>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <td className="border border-gray-300 p-1 pl-2">
                  Hospital Name
                </td>
                <td className="border border-gray-300 p-1 pl-2">
                  {data.refer.hospitalName || "-"}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-1 pl-2">Doctor Name</td>
                <td className="border border-gray-300 p-1 pl-2">
                  {data.refer.doctorName || "-"}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-1 pl-2">Message</td>
                <td className="border border-gray-300 p-1 pl-2">
                  {data.refer.referMessage || "-"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <p>
          This prescription is valid as per clinic policy. Please consult your
          pharmacist for any questions regarding medications.
        </p>
      </div>
    </div>
  );
};

export default PrescriptionPrint;
