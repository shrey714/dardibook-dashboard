import React from "react";

const RegistrationPrint = ({ data }: { data: RegistrationData }) => {
  return (
    <div className="space-y-4 pb-4">
      <table className="w-full border-collapse border border-gray-300">
        <tbody>
          <tr>
            <td className="border border-gray-300 p-1 pl-2">ID</td>
            <td className="border border-gray-300 p-1 pl-2">
              {data.patient_id}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-1 pl-2">Visited Time</td>
            <td className="border border-gray-300 p-1 pl-2">
              {new Date(data.registered_at).toLocaleString("en-GB")}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-1 pl-2">Name</td>
            <td className="border border-gray-300 p-1 pl-2">{data.name}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-1 pl-2">Age</td>
            <td className="border border-gray-300 p-1 pl-2">{data.age}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-1 pl-2">Gender</td>
            <td className="border border-gray-300 p-1 pl-2">{data.gender}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-1 pl-2">Address</td>
            <td className="border border-gray-300 p-1 pl-2">
              {[data.street_address, data.city, data.state, data.zip]
                .filter(Boolean)
                .join(", ")}
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-1 pl-2">Mobile</td>
            <td className="border border-gray-300 p-1 pl-2">{data.mobile}</td>
          </tr>
        </tbody>
      </table>

      <div className="w-full">
        <span className="font-medium">Registered By:</span> {data.registerd_by}
      </div>
      <div className="w-full">
        <span className="font-medium">Registered For:</span>{" "}
        {data.registerd_for}
      </div>
    </div>
  );
};

export default RegistrationPrint;
