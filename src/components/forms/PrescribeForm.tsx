"use client";
import React, { useState } from "react";
import Link from "next/link";
import PrescribeMedicineTable from "./PrescribeMedicineTable";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { createPrescription } from "@/app/services/createPrescription";
const PrescribeForm = () => {
  const searchParams = useSearchParams();
  const user = useAppSelector<any>((state) => state.auth.user);
  const [submissionLoader, setSubmissionLoader] = useState(false);
  const patientId = searchParams.get("patientId");
  const [formData, setFormData] = useState({
    diseaseDetail: "",
    advice: "",
    nextVisit: undefined,
    refer: {
      hospitalName: "",
      doctorName: "",
      referMessage: "",
    },
    medicines: [
      {
        id: 1,
        medicineName: "",
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
      refer: {
        ...prevData.refer,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setSubmissionLoader(true);
    // console.log({
    //   ...formData,
    //   uid: user.uid,
    //   id: patientId,
    // });
    const data = await createPrescription({
      ...formData,
      uid: user.uid,
      id: patientId,
    });
    console.log("status", data);
    setSubmissionLoader(false);
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off" autoFocus={true}>
      <fieldset disabled={submissionLoader}>
        <div className="mx-auto max-w-5xl">
          {/* Disease text area */}
          <div className="col-span-full bg-white p-4 px-8 rounded-lg ">
            <label
              htmlFor="diseaseDetail"
              className="block text-lg ext-base font-semibold leading-7 text-gray-900"
            >
              Disease and Diagnosis<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="mt-2">
              <textarea
                required
                id="diseaseDetail"
                name="diseaseDetail"
                rows={5}
                className="form-textarea block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={formData.diseaseDetail}
                onChange={handleInputChange}
              />
            </div>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Write a few sentences about Disease.
            </p>
          </div>

          {/* Medicine list */}
          <div className="mt-6 col-span-full bg-white py-4 rounded-lg ">
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
          <div className="mt-6 col-span-full bg-white p-4 px-8 rounded-lg ">
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
                htmlFor="nextVisit"
                className="text-lg font-semibold leading-7 text-gray-900 flex items-center"
              >
                Next visit date
              </label>
              <div className="flex mt-2 sm:mt-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  type="date"
                  name="nextVisit"
                  id="nextVisit"
                  min={new Date().toISOString().split("T")[0]}
                  className="form-input block flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  value={formData.nextVisit}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          {/* Higher hospital Form */}
          <div className="mt-6 col-span-full bg-white px-8 rounded-lg ">
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
                      value={formData.refer.hospitalName}
                      onChange={handleHigherHospitalChange}
                    />
                  </div>
                </div>
                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 border-t border-gray-900/10">
                  <label
                    htmlFor="doctorName"
                    className="text-sm font-medium leading-6 text-gray-900 flex items-center"
                  >
                    Appointed Doctor Name
                  </label>
                  <div className="sm:col-span-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      name="doctorName"
                      id="doctorName"
                      autoComplete="street-address"
                      className="form-input block w-full flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      value={formData.refer.doctorName}
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
                      className="form-textarea block w-full rounded-md flex-1 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={formData.refer.referMessage}
                      onChange={handleHigherHospitalChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="./">
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
              {submissionLoader ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Save"
              )}
            </button>
            <button type="button" className="btn btn-success md:btn-wide">
              Print
            </button>
          </div>
        </div>
      </fieldset>
    </form>
  );
};

export default PrescribeForm;
