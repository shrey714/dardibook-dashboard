import PatientDataBox from "@/components/Prescribe/PatientDataBox";
import PatientHistoryTabs from "@/components/Prescribe/PatientHistoryTabs";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="self-center flex w-full flex-col">
      <div className="p-2 flex gap-8 items-center flex-col-reverse sm:flex-row px-4 ">
        <PatientDataBox />
        <div className="p-4 gap-6 flex flex-col">
          <Link
            href={{
              pathname: "prescribeForm",
              query: { patientId: 12345 },
            }}
            className="btn btn-primary md:btn-md lg:btn-wide"
          >
            Attend
          </Link>
          <Link href={"./"} className="btn md:btn-md lg:btn-wide">
            Back to queue
          </Link>
        </div>
      </div>
      <PatientHistoryTabs />
    </div>
  );
};

export default page;
