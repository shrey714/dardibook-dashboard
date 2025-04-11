"use client";
import React, { useState } from "react";
import Link from "next/link";
import PrescribeMedicineTable from "./PrescribeMedicineTable";
import Loader from "../common/Loader";
import ReceiptForm from "./ReceiptForm";
import DiseaseSuggetion from "../Prescribe/DiseaseSuggetion";
import uniqid from "uniqid";
import { Button } from "../ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MedicinesDetails, PrescriptionFormTypes } from "@/types/FormTypes";

interface PrescribeFormProps {
  formData: PrescriptionFormTypes;
  setFormData: React.Dispatch<React.SetStateAction<PrescriptionFormTypes>>;
  submissionLoader: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const PrescribeForm: React.FC<PrescribeFormProps> = ({
  formData,
  setFormData,
  submissionLoader,
  handleSubmit,
}) => {
  const [medicinesLoading, setmedicinesLoading] = useState(false);
  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | { target: { name: string; value: MedicinesDetails[] } }
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

  const handleDiseaseComingData = (data: {
    diseaseId: string;
    diseaseDetail: string;
  }) => {
    setFormData((prevData) => ({
      ...prevData,
      diseaseId: data.diseaseId || uniqid(),
      diseaseDetail: data.diseaseDetail || "",
    }));
  };

  return (
    <form
      className="max-w-screen-[1600px] mx-auto px-2 sm:px-6 lg:px-8 mb-20 mt-2 sm:mt-6 2xl:flex 2xl:flex-row 2xl:gap-5 2xl:justify-center"
      onSubmit={handleSubmit}
      autoComplete="off"
      autoFocus={true}
    >
      <fieldset id="prescriptionForm" className="grid grid-cols-10 gap-4" disabled={submissionLoader}>
        <div className="col-span-10 2xl:col-span-7 w-full space-y-4">
          <div className="bg-sidebar/70 w-full border rounded-lg">
            {/* Disease text area */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 p-2 md:px-8 md:py-4 border-b">
              <label
                htmlFor="diseaseDetail"
                className="flex items-center text-sm md:text-lg font-medium leading-7"
              >
                Disease and Diagnosis
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="sm:col-span-2">
                <DiseaseSuggetion
                  required={formData.refer?.hospitalName ? false : true}
                  diseaseValue={formData.diseaseDetail}
                  diseaseId={formData.diseaseId}
                  medicines={formData.medicines}
                  handleDiseaseComingData={handleDiseaseComingData}
                  handleInputChange={handleInputChange}
                  setmedicinesLoading={setmedicinesLoading}
                />
              </div>
            </div>

            {/* Medicine list */}
            {medicinesLoading ? (
              <div className="w-full">
                <div className="h-1 w-full bg-border overflow-hidden">
                  <div className="progress w-full h-full bg-blue-600 left-right"></div>
                </div>
              </div>
            ) : (
              <></>
            )}
            <div
              className={`col-span-full border-b relative ${
                medicinesLoading ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <label className="p-2 md:px-8 md:py-3 block text-sm md:text-lg font-medium md:leading-7 text-muted-foreground md:text-primary bg-border md:bg-transparent">
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
            <div className="p-2 md:py-4 md:px-8 space-y-2 md:space-y-4">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <label
                  htmlFor="advice"
                  className="block text-sm md:text-lg font-medium leading-7"
                >
                  Advice or special instructions
                </label>
                <textarea
                  id="advice"
                  autoComplete="new-off"
                  placeholder="Advice..."
                  name="advice"
                  rows={1}
                  className="w-full sm:col-span-2 disabled:text-primary shadow-sm rounded-md border-border bg-transparent form-input block py-1 pl-2 sm:text-sm sm:leading-6"
                  value={formData.advice}
                  onChange={handleInputChange}
                />
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <label
                  htmlFor="nextVisit"
                  className="text-sm md:text-lg font-medium leading-7 flex items-center"
                >
                  Next visit date
                </label>
                <input
                  type="date"
                  name="nextVisit"
                  autoComplete="new-off"
                  id="nextVisit"
                  min={new Date().toISOString().split("T")[0]}
                  className="disabled:text-primary shadow-sm rounded-md border-border bg-transparent form-input block py-1 pl-2 sm:text-sm sm:leading-6"
                  value={formData.nextVisit}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          {/* Higher hospital Form */}
          <div className="bg-sidebar/70 w-full border rounded-lg">
            <Accordion
              type="single"
              collapsible
              className="w-full col-span-full px-4 md:px-8"
            >
              <AccordionItem value="item-1" className="border-0">
                <AccordionTrigger className="text-sm md:text-lg font-medium">
                  Refer to higher hospital
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-0 space-y-2 md:space-y-4">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <label
                        htmlFor="hospitalName"
                        className="text-sm font-medium leading-6 flex items-center"
                      >
                        Hospital Name
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Hospital Name"
                        required={formData.diseaseDetail ? false : true}
                        name="hospitalName"
                        id="hospitalName"
                        autoComplete="new-off"
                        className="col-span-2 w-full md:max-w-md lg:col-span-2 disabled:text-primary shadow-sm rounded-md border-border bg-transparent form-input block py-1 pl-2 sm:text-sm sm:leading-6"
                        value={formData.refer.hospitalName}
                        onChange={handleHigherHospitalChange}
                      />
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <label
                        htmlFor="doctorName"
                        className="text-sm font-medium leading-6 flex items-center"
                      >
                        Appointed Doctor Name
                      </label>
                      <input
                        type="text"
                        placeholder="Doctor Name.."
                        name="doctorName"
                        id="doctorName"
                        autoComplete="new-off"
                        className="col-span-2 w-full md:max-w-md lg:col-span-2 disabled:text-primary shadow-sm rounded-md border-border bg-transparent form-input block py-1 pl-2 sm:text-sm sm:leading-6"
                        value={formData.refer.doctorName}
                        onChange={handleHigherHospitalChange}
                      />
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <label
                        htmlFor="referMessage"
                        className="block text-sm font-medium leading-6"
                      >
                        Refer message
                      </label>
                      <textarea
                        id="referMessage"
                        placeholder="Message.."
                        name="referMessage"
                        autoComplete="new-off"
                        rows={1}
                        className="col-span-2 w-full md:max-w-md lg:col-span-2 disabled:text-primary shadow-sm rounded-md border-border bg-transparent form-input block py-1 pl-2 sm:text-sm sm:leading-6"
                        value={formData.refer.referMessage}
                        onChange={handleHigherHospitalChange}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* fees inputs */}
        <ReceiptForm
          receiptInfo={formData.receipt_details}
          setReceiptInfo={setFormData}
        />

        {/* Submit-cancel button */}
        <div
          className="flex items-center justify-center gap-x-4 sm:gap-x-6 absolute 
      bg-clip-padding backdrop-filter backdrop-blur-sm
      bottom-0 py-2 border-t sm:py-3 left-0 right-0"
        >
          <Button variant={"destructive"} className="w-28 sm:w-32" asChild>
            <Link
              href={"./"}
              scroll={true}
              type="button"
              className="border-0 text-sm font-semibold leading-6"
            >
              Cancel
            </Link>
          </Button>
          <Button className="w-28 sm:w-32" type="submit" variant={"default"}>
            {submissionLoader ? <Loader size="medium" /> : "Prescribe"}
          </Button>
        </div>
      </fieldset>
    </form>
  );
};

export default PrescribeForm;
