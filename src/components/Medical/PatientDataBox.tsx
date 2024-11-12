import React from "react";

const PatientDataBox = ({ patientData }: any) => {
  return (
    <div className="mx-auto w-full">
      <div className="px-4 sm:px-0 ">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Patient Information ( {patientData?.patient_unique_Id} )
        </h3>
      </div>
      <div className="mt-2 mb-2 border-t border-b border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-[6px] sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Full name
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {patientData?.first_name} {patientData?.last_name}
            </dd>
          </div>
          <div className="px-4 py-[6px] sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Age</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {patientData?.age}
            </dd>
          </div>
          <div className="px-4 py-[6px] sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Gender
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {patientData?.gender}
            </dd>
          </div>
          <div className="px-4 py-[6px] sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Mobile number
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {patientData?.mobile_number}
            </dd>
          </div>
          <div className="px-4 py-[6px] sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Address
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {patientData?.street_address}, {patientData?.city}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default PatientDataBox;
