"use client";
import { useTodayPatientStore } from "@/lib/providers/todayPatientsProvider";
import React from "react";

const StatsHeader = () => {
  const { todayPatients, loading } = useTodayPatientStore((state) => state);

  return (
    <div className="relative overflow-hidden w-full sm:max-w-3xl bg-gradient-to-b from-muted/50 to-muted flex flex-row border-2 rounded-md">
      <div className="py-3 px-4 sm:px-6 flex flex-1 flex-row gap-x-4 lg:flex-col flex-wrap">
        <div className=" font-semibold text-sm sm:text-base whitespace-nowrap">
          Total Registrations
          <p className="font-medium text-xs whitespace-nowrap">done by today</p>
        </div>
        <div className=" font-semibold text-4xl text-primary flex flex-row justify-start">
          <div className="absolute top-0 left-[calc(50%-144px)] stat-figure size-36 opacity-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="inline-block size-full stroke-current"
            >
              <path
                fillRule="evenodd"
                d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          {loading ? 0 : todayPatients.length}
        </div>
      </div>

      <div className="py-3 px-4 sm:px-6 flex flex-1 flex-row gap-x-4 lg:flex-col flex-wrap">
        <div className=" font-semibold text-sm sm:text-base whitespace-nowrap">
          Total Attended
          <p className=" font-medium text-xs whitespace-nowrap">
            patient by today
          </p>
        </div>
        <div className=" font-semibold text-4xl flex flex-row justify-start">
          <div className="stat-figure absolute top-0 right-0 size-36 opacity-20">
            <svg
              className="inline-block size-full"
              viewBox="-5.7 -5.7 74.69 74.69"
              fill="#ff00d3"
              stroke="#ff00d3"
              strokeWidth="0.8227310000000001"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0" />

              <g
                id="SVGRepo_tracerCarrier"
                strokeLinecap="round"
                strokeLinejoin="round"
                stroke="#CCCCCC"
                strokeWidth="0.5062960000000001"
              />

              <g id="SVGRepo_iconCarrier">
                <path d="M60.993,20.124c0-4.404-3.583-7.987-7.987-7.987s-7.987,3.583-7.987,7.987 c0,4.065,3.054,7.423,6.987,7.918v20.74c0,6.896-5.61,12.505-12.506,12.505h-8.43c-6.896,0-12.506-5.61-12.506-12.505V36.945h3.572 c4.458,0,7.064-4.508,7.739-7.587c0.104-0.625,2.575-15.366,2.941-20.494c0.139-1.929-0.544-3.806-1.92-5.284 c-1.503-1.614-3.628-2.54-5.83-2.54h-1.422C23.599,0.463,23.126,0,22.537,0H20.52c-0.619,0-1.125,0.506-1.125,1.125v1.829 c0,0.619,0.506,1.125,1.125,1.125h2.016c0.589,0,1.062-0.462,1.108-1.04h1.422c1.648,0,3.24,0.694,4.366,1.903 c0.994,1.067,1.487,2.409,1.39,3.778c-0.36,5.033-2.895,20.153-2.91,20.256c-0.507,2.307-2.522,5.967-5.776,5.967h-9.145 c-3.254,0-5.27-3.66-5.767-5.918C7.2,28.874,4.666,13.755,4.305,8.721c-0.098-1.369,0.396-2.71,1.39-3.778 C6.821,3.734,8.413,3.04,10.061,3.04h1.402c0.046,0.577,0.519,1.04,1.108,1.04h2.016c0.619,0,1.125-0.506,1.125-1.125V1.125 C15.714,0.506,15.207,0,14.588,0h-2.016c-0.589,0-1.062,0.463-1.108,1.04h-1.402c-2.202,0-4.326,0.926-5.83,2.541 c-1.376,1.478-2.058,3.354-1.92,5.283c0.366,5.127,2.837,19.869,2.951,20.542c0.665,3.03,3.271,7.539,7.729,7.539h3.572v11.836 c0,7.999,6.507,14.505,14.506,14.505h8.43c7.999,0,14.506-6.507,14.506-14.505v-20.74C57.939,27.547,60.993,24.189,60.993,20.124z M53.006,26.111c-3.302,0-5.987-2.686-5.987-5.987s2.686-5.987,5.987-5.987s5.987,2.686,5.987,5.987S56.307,26.111,53.006,26.111z M53.006,16.732c-1.87,0-3.392,1.521-3.392,3.392s1.521,3.392,3.392,3.392s3.392-1.521,3.392-3.392S54.876,16.732,53.006,16.732z M53.006,21.515c-0.768,0-1.392-0.625-1.392-1.392s0.624-1.392,1.392-1.392s1.392,0.625,1.392,1.392S53.773,21.515,53.006,21.515z" />
              </g>
            </svg>
          </div>
          {loading
            ? 0
            : todayPatients.filter((patient) => patient.prescribed).length}
        </div>
      </div>
    </div>
  );
};

export default StatsHeader;
