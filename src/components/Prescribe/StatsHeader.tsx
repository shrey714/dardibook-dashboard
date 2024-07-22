import React from "react";

const StatsHeader = ({ registrations, attended }: any) => {
  return (
    <div className="w-auto sm:w-full sm:max-w-[70%] shadow-[rgba(13,_38,_76,_0.19)_0px_9px_20px] bg-white rounded-lg flex flex-row">
      <div className="py-4 px-5 sm:py-4 sm:px-6 flex flex-1 flex-col">
        <div className=" font-semibold text-sm sm:text-base text-gray-800 whitespace-nowrap">
          Total Registrations
        </div>
        <div className=" font-semibold text-4xl text-primary flex flex-row justify-between ">
          {registrations}
          <div className="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </div>
        </div>
        <div className=" font-semibold text-xs whitespace-nowrap">
          done by today
        </div>
      </div>

      <div className="py-4 px-5 sm:py-4 sm:px-6 flex flex-1 flex-col">
        <div className=" font-semibold text-sm sm:text-base text-gray-800 whitespace-nowrap">
          Total Attended
        </div>
        <div className=" font-semibold text-4xl text-secondary flex flex-row justify-between ">
          {attended}
          <div className="stat-figure text-secondary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-8 w-8 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
          </div>
        </div>
        <div className=" font-semibold text-xs whitespace-nowrap">
          patient by today
        </div>
      </div>
    </div>
  );
};

export default StatsHeader;
