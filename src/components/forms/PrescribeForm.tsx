"use client";
import React, { useState } from "react";
import Link from "next/link";
import PrescribeMedicineTable from "./PrescribeMedicineTable";

const PrescribeForm = () => {
  const [formData, setFormData] = useState({
    disease: "",
    advice: "",
    nextDate: new Date().toISOString().split("T")[0],
    higherHospital: {
      hospitalName: "",
      appointedDoctorName: "",
      referMessage: "",
    },
    medicines: [
      {
        id: 1,
        name: "",
        instruction: "",
        dosages: [{ id: 1, value: "" }],
        duration: "",
      },
    ],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleHigherHospitalChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      higherHospital: {
        ...prevData.higherHospital,
        [name]: value,
      },
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto max-w-5xl">
        {/* Disease text area */}
        <div className="col-span-full bg-white p-4 px-8 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] ">
          <label
            htmlFor="disease"
            className="block text-lg ext-base font-semibold leading-7 text-gray-900"
          >
            Disease and Diagnosis
          </label>
          <div className="mt-2">
            <textarea
              id="disease"
              name="disease"
              rows={5}
              className="form-textarea block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={formData.disease}
              onChange={handleInputChange}
            />
          </div>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Write a few sentences about Disease.
          </p>
        </div>

        {/* Medicine list */}
        <div className="mt-6 col-span-full bg-white py-4 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] ">
          <label className="block px-8 text-lg ext-base font-semibold leading-7 text-gray-900">
            Medicines
          </label>
          <PrescribeMedicineTable
            rows={formData.medicines}
            setRows={(medicines) =>
              setFormData((prevData) => ({ ...prevData, medicines }))
            }
          />
        </div>

        {/* Advice or special instructions text area */}
        <div className="mt-6 col-span-full bg-white p-4 px-8 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] ">
          <label
            htmlFor="advice"
            className="block text-lg ext-base font-semibold leading-7 text-gray-900"
          >
            Advice or special instructions
          </label>
          <div className="mt-2">
            <textarea
              id="advice"
              name="advice"
              rows={3}
              className="form-textarea block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={formData.advice}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-6 mb-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <label
              htmlFor="nextDate"
              className="text-lg font-semibold leading-7 text-gray-900 flex items-center"
            >
              Next visit date
            </label>
            <div className="flex mt-2 sm:mt-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input
                type="date"
                name="nextDate"
                id="nextDate"
                min={new Date().toISOString().split("T")[0]}
                className="form-input block flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={formData.nextDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        {/* Higher hospital Form */}
        <div className="mt-6 col-span-full bg-white px-8 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)] ">
          <div className="collapse collapse-arrow text-black ">
            <input type="checkbox" name="my-accordion-2" />
            <div className="collapse-title pr-3 pl-0 text-lg font-semibold text-gray-900">
              Refer to higher hospital
            </div>
            <div className="collapse-content px-0">
              <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <label
                  htmlFor="hospitalName"
                  className="text-sm font-medium leading-6 text-gray-900 flex items-center"
                >
                  Hospital Name
                </label>
                <div className="sm:col-span-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="hospitalName"
                    id="hospitalName"
                    autoComplete="street-address"
                    className="form-input block w-full flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    value={formData.higherHospital.hospitalName}
                    onChange={handleHigherHospitalChange}
                  />
                </div>
              </div>
              <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 border-t border-gray-900/10">
                <label
                  htmlFor="appointedDoctorName"
                  className="text-sm font-medium leading-6 text-gray-900 flex items-center"
                >
                  Appointed Doctor Name
                </label>
                <div className="sm:col-span-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="appointedDoctorName"
                    id="appointedDoctorName"
                    autoComplete="street-address"
                    className="form-input block w-full flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    value={formData.higherHospital.appointedDoctorName}
                    onChange={handleHigherHospitalChange}
                  />
                </div>
              </div>
              <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 border-t border-gray-900/10">
                <label
                  htmlFor="referMessage"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Refer message
                </label>
                <div className="sm:col-span-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <textarea
                    id="referMessage"
                    name="referMessage"
                    rows={3}
                    className="form-input block w-full rounded-md flex-1 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={formData.higherHospital.referMessage}
                    onChange={handleHigherHospitalChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="/">
            <button
              type="button"
              className="btn md:btn-wide text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="btn md:btn-wide rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
          <button type="button" className="btn btn-success md:btn-wide">
            Print
          </button>
        </div>
      </div>
    </form>
  );
};

export default PrescribeForm;
