"use client";
import React from "react";
import Link from "next/link";
import PrescribeMedicineTable from "./PrescribeMedicineTable";
import Loader from "../common/Loader";
import ReceiptForm from "./ReceiptForm";

const PrescribeForm = ({
  formData,
  setFormData,
  submissionLoader,
  handleSubmit,
  receiptInfo,
  setReceiptInfo,
}: any) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleHigherHospitalChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData: { refer: any }) => ({
      ...prevData,
      refer: {
        ...prevData.refer,
        [name]: value,
      },
    }));
  };

  return (
    <form
      className="px-4 sm:px-6 lg:px-8 py-12"
      onSubmit={handleSubmit}
      autoComplete="off"
      autoFocus={true}
    >
      <fieldset disabled={submissionLoader}>
        <div className="mx-auto max-w-5xl rounded-lg bg-white">
          {/* Disease text area */}
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 p-4 px-8">
            <label
              htmlFor="diseaseDetail"
              className="flex items-center text-lg font-semibold text-gray-900 "
            >
              Disease and Diagnosis<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="sm:col-span-2">
              <textarea
                autoFocus={true}
                required={formData.refer.hospitalName ? false : true}
                id="diseaseDetail"
                name="diseaseDetail"
                rows={1}
                autoComplete="new-off"
                className="form-textarea block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={formData.diseaseDetail}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Medicine list */}
          <div className="col-span-full py-4 sm:px-8 border-t border-gray-900/10">
            <label className="px-8 sm:px-0 block text-lg font-semibold leading-7 text-gray-900">
              Medicines
            </label>
            <PrescribeMedicineTable
              rows={formData.medicines}
              setRows={(medicines) =>
                setFormData((prevData: any) => ({ ...prevData, medicines }))
              }
            />
          </div>

          {/* Advice or special instructions text area */}
          <div className="p-4 px-8 border-t border-gray-900/10">
            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
              <label
                htmlFor="advice"
                className="block text-lg font-semibold leading-7 text-gray-900"
              >
                Advice or special instructions
              </label>
              <div className="sm:col-span-2">
                <textarea
                  id="advice"
                  autoComplete="new-off"
                  name="advice"
                  rows={1}
                  className="form-textarea block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.advice}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 border-t border-gray-900/10">
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
                  autoComplete="new-off"
                  id="nextVisit"
                  min={new Date().toISOString().split("T")[0]}
                  className="form-input block flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  value={formData.nextVisit}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-6 mx-auto max-w-5xl rounded-lg bg-white">
          {/* Higher hospital Form */}
          <div className="mt-4 sm:mt-6 col-span-full px-8 ">
            <div className="collapse collapse-arrow text-black ">
              <input
                type="checkbox"
                name="my-accordion-2"
                autoComplete="new-off"
              />
              <div className="collapse-title pr-3 pl-0 text-lg font-semibold text-gray-900">
                Refer to higher hospital
              </div>
              <div className="collapse-content px-0">
                <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <label
                    htmlFor="hospitalName"
                    className="text-sm font-medium leading-6 text-gray-900 flex items-center"
                  >
                    Hospital Name<span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="sm:col-span-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                    <input
                      type="text"
                      required={formData.diseaseDetail ? false : true}
                      name="hospitalName"
                      id="hospitalName"
                      autoComplete="new-off"
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
                      autoComplete="new-off"
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
                      autoComplete="new-off"
                      rows={1}
                      className="form-textarea block w-full rounded-md flex-1 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      value={formData.refer.referMessage}
                      onChange={handleHigherHospitalChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-6 mx-auto max-w-5xl rounded-lg bg-white">
          {/* fees inputs */}

          <ReceiptForm
            setReceiptInfo={setReceiptInfo}
            receiptInfo={receiptInfo}
          />
        </div>

        {/* Submit button */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link href="./">
            <button
              type="button"
              className="btn md:btn-wide bg-white border-0 text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
          </Link>
          <button
            type="submit"
            className="btn md:btn-wide rounded-md bg-indigo-600 border-0 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {submissionLoader ? (
              <Loader
                size="medium"
                color="text-primary"
                secondaryColor="text-white"
              />
            ) : (
              "Save"
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              console.log("formData==", formData);
            }}
            className="btn md:btn-wide bg-white border-0 text-sm font-semibold leading-6 text-gray-900"
          >
            Print
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default PrescribeForm;
