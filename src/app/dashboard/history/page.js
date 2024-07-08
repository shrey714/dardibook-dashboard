/* eslint-disable @next/next/no-img-element */
"use client";
import MultiLevelList from "@/components/History/MultiLevelList";
import React, { useState } from "react";

export default function HistoryPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-1 flex-row">
      {/* Sidebar */}
      <aside
        className={`z-20 top-0 w-full md:w-72 p-4 pt-16 md:pt-4  md:pr-0 h-screen transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 fixed md:static`}
        aria-label="Sidenav"
        id="drawer-navigation"
      >
        <img
          className="w-auto h-14 absolute top-4 left-4 hidden md:block"
          src="/Filter.svg"
          alt="Filters"
        />
        <div className="flex flex-col justify-between rounded-lg md:rounded-tr-none pt-2 md:pt-14 pb-2 h-full bg-white">
          <ul className="space-y-2 px-2">
            {/* From TO Date */}
            <li>
              <h6 className="text-base font-medium text-black">
                Appointment Dates
              </h6>
              <div className="mt-2 flex items-center flex-row gap-1 max-[900px]:flex-wrap">
                <div className="w-full">
                  <label
                    htmlFor="appointment_from"
                    className="block mb-1 text-sm font-medium text-gray-500"
                  >
                    From
                  </label>

                  <input
                    type="date"
                    id="appointment_from"
                    className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-[4px] block w-full py-2 px-0 pl-1"
                    placeholder=""
                    required
                  />
                </div>

                <div className="w-full">
                  <label
                    htmlFor="appointment_to"
                    className="block mb-1 text-sm font-medium text-gray-500"
                  >
                    To
                  </label>

                  <input
                    type="date"
                    id="appointment_to"
                    className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-[4px] block w-full py-2 px-0 pl-1"
                    placeholder=""
                    required
                  />
                </div>
              </div>
            </li>
            {/* Gender select */}
            <li>
              <label
                htmlFor="gender"
                className="text-base font-medium text-black"
              >
                Gender
              </label>
              <select
                id="gender"
                className="form-select block w-full p-2 py-2 mt-2 text-xs text-gray-900 border border-gray-300 rounded-[4px] bg-gray-50"
              >
                <option selected>All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </li>
            {/* Age From To number */}
            <li>
              <h6 className="text-base font-medium text-black">Age Range</h6>
              <div className="flex flex-row items-center justify-around gap-1">
                <div className="mt-2">
                  <label
                    htmlFor="age_from"
                    className="block mb-1 text-sm font-medium text-gray-500"
                  >
                    From
                  </label>

                  <input
                    type="number"
                    id="age_from"
                    className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-[4px] block w-full py-2 px-0 pl-1"
                    placeholder=""
                    required
                  />
                </div>

                <div className="mt-2">
                  <label
                    htmlFor="age_to"
                    className="block mb-1 text-sm font-medium text-gray-500"
                  >
                    To
                  </label>

                  <input
                    type="number"
                    id="age_to"
                    className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-[4px] block w-full py-2 px-0 pl-1"
                    placeholder=""
                    required
                  />
                </div>
              </div>
            </li>
            {/* Refered to another hospital */}
            <li>
              <div className="flex items-center ps-4 border border-gray-300 rounded">
                <input
                  id="refered"
                  type="checkbox"
                  value=""
                  name="bordered-checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="refered"
                  className="w-full py-2 ms-2 text-xs font-medium text-gray-500"
                >
                  Patients referred to another hospital
                </label>
              </div>
            </li>
            {/* Registered but not appointed */}
            <li>
              <div className="flex items-center ps-4 border border-gray-300 rounded">
                <input
                  id="not_appointed"
                  type="checkbox"
                  value=""
                  name="bordered-checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="not_appointed"
                  className="w-full py-2 ms-2 text-xs font-medium text-gray-500"
                >
                  Patients registered but not appointed
                </label>
              </div>
            </li>
          </ul>
          <div className="w-full flex flex-col">
            <button className="btn btn-sm mx-2 animate-none btn-neutral btn-outline">
              Clear
            </button>
            <button
              onClick={toggleSidebar}
              className="btn btn-sm mt-2 mx-2 animate-none btn-neutral block md:hidden"
            >
              Close
            </button>
          </div>
        </div>
      </aside>

      <main className="h-screen mt-16 md:mt-4 w-auto flex flex-col flex-1">
        <nav className="z-10 bg-white px-2 flex mr-4 ml-4 md:ml-0 rounded-lg md:rounded-none md:rounded-tr-lg md:rounded-br-lg py-2">
          <button
            onClick={toggleSidebar}
            aria-controls="drawer-navigation"
            className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100"
          >
            <svg
              aria-hidden="true"
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
            <svg
              aria-hidden="true"
              className="hidden w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Toggle sidebar</span>
          </button>
          <form className="flex flex-1 items-center">
            <label htmlFor="topbar-search" className="sr-only">
              Search
            </label>
            <div className="relative w-full">
              <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                name="email"
                id="topbar-search"
                className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                placeholder="Search by patientID or Name...."
              />
            </div>
          </form>
        </nav>

        <div
          style={{ height: "calc(100vh - 5.5rem)" }}
          className="w-full bg-white overflow-hidden"
        >
          <div className="bg-gray-300 md:rounded-tl-lg p-4 pt-0 w-full h-full overflow-y-auto">
            <MultiLevelList />
          </div>
        </div>
      </main>
    </div>
  );
}
