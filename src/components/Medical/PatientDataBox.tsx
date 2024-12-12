import React from "react";
import { Separator } from "../ui/separator";

const PatientDataBox = ({ patientData }: any) => {
  return (
    <div className="mx-auto w-full">
      <div className="px-4 sm:px-0 ">
        <h3 className="text-base font-semibold leading-7">
          Patient Information ( {patientData?.patient_unique_Id} )
        </h3>
      </div>
      <Separator className="mt-1" />
      <dl className="divide-y divide-border">
        <div className="px-4 py-[6px] sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6">
            Full name
          </dt>
          <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
            {patientData?.first_name} {patientData?.last_name}
          </dd>
        </div>
        <div className="px-4 py-[6px] sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6">Age</dt>
          <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
            {patientData?.age}
          </dd>
        </div>
        <div className="px-4 py-[6px] sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6">
            Gender
          </dt>
          <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
            {patientData?.gender}
          </dd>
        </div>
        <div className="px-4 py-[6px] sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6">
            Mobile number
          </dt>
          <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
            {patientData?.mobile_number}
          </dd>
        </div>
        <div className="px-4 py-[6px] sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <dt className="text-sm font-medium leading-6">
            Address
          </dt>
          <dd className="mt-1 text-sm leading-6 sm:col-span-2 sm:mt-0">
            {patientData?.street_address}, {patientData?.city}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default PatientDataBox;
