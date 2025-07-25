"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import PrescribeMedicineTable from "./PrescribeMedicineTable";
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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import PrescriptionAdditionalInfoForm from "./PrescriptionAdditionalInfoForm";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Upload, X } from "lucide-react";
import toast from "react-hot-toast";

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

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      duration: 3000,
      position: "bottom-right",
    });
  }, []);

  return (
    <form
      className="max-w-screen-[1600px] mx-auto px-2 sm:px-6 lg:px-8 mb-20 mt-2 sm:mt-6 2xl:flex 2xl:flex-row 2xl:gap-5 2xl:justify-center"
      onSubmit={handleSubmit}
      autoComplete="off"
      autoFocus={true}
    >
      <fieldset
        id="prescriptionForm"
        className="grid grid-cols-10 gap-4"
        disabled={submissionLoader}
      >
        <div className="col-span-10 2xl:col-span-7 w-full space-y-4">
          <div className="bg-card w-full border rounded-xl">
            {/* Disease text area */}
            <div className="sm:grid sm:grid-cols-3 sm:gap-4 p-2 md:px-8 md:py-4 border-b space-y-2 sm:space-y-0">
              <Label htmlFor="diseaseDetail" className="sm:text-lg">
                Disease and Diagnosis
                <span className="text-red-500">*</span>
              </Label>
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
            {medicinesLoading && (
              <div className="w-full">
                <div className="h-1 w-full bg-border overflow-hidden">
                  <div className="progress w-full h-full bg-primary left-right"></div>
                </div>
              </div>
            )}
            <div
              className={`col-span-full border-b relative ${
                medicinesLoading ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <Label className="p-2 md:px-8 md:py-3 block text-sm md:text-lg font-medium md:leading-7 text-muted-foreground md:text-inherit bg-border md:bg-transparent">
                Medicines
              </Label>
              <PrescribeMedicineTable
                rows={formData.medicines}
                setRows={(medicines) =>
                  setFormData((prevData) => ({ ...prevData, medicines }))
                }
              />
            </div>

            {/* Advice or special instructions text area */}
            <div className="p-2 md:py-4 md:px-8 space-y-2 md:space-y-4">
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 space-y-2 sm:space-y-0">
                <Label
                  htmlFor="advice"
                  className="block text-sm md:text-lg font-medium leading-7"
                >
                  Advice or special instructions
                </Label>
                <Input
                  id="advice"
                  autoComplete="new-off"
                  placeholder="Advice..."
                  name="advice"
                  wrapClassName="w-full sm:col-span-2"
                  value={formData.advice}
                  onChange={handleInputChange}
                />
              </div>
              <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 space-y-2 sm:space-y-0">
                <Label
                  htmlFor="nextVisit"
                  className="text-sm md:text-lg font-medium leading-7 flex items-center"
                >
                  Next visit date
                </Label>
                <Input
                  type="date"
                  name="nextVisit"
                  autoComplete="new-off"
                  id="nextVisit"
                  min={new Date().toISOString().split("T")[0]}
                  value={formData.nextVisit}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-card w-full border rounded-xl">
            <FileUpload
              maxFiles={5}
              maxSize={10 * 1024 * 1024}
              className="w-full p-4"
              value={formData.attachments}
              onValueChange={(files)=>{
                setFormData((prevData)=>({
                  ...prevData,
                  attachments:files
                }))
              }}
              onFileReject={onFileReject}
              multiple
            >
              <FileUploadDropzone>
                <div className="flex flex-col items-center gap-1 text-center">
                  <div className="flex items-center justify-center rounded-full border p-2.5">
                    <Upload className="size-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-sm">Drag & drop files here</p>
                  <p className="text-muted-foreground text-xs">
                    Or click to browse (max 5 files, up to 10MB each)
                  </p>
                </div>
                <FileUploadTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-2 w-fit">
                    Browse files
                  </Button>
                </FileUploadTrigger>
              </FileUploadDropzone>
              <FileUploadList>
                {formData.attachments && formData.attachments.map((file, index) => (
                  <FileUploadItem key={index} value={file}>
                    <FileUploadItemPreview />
                    <FileUploadItemMetadata />
                    <FileUploadItemDelete asChild>
                      <Button variant="ghost" size="icon" className="size-7">
                        <X />
                      </Button>
                    </FileUploadItemDelete>
                    
                  </FileUploadItem>
                ))}
              </FileUploadList>
            </FileUpload>
          </div>

          {/* Higher hospital Form */}
          <div className="bg-card w-full border rounded-xl">
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
                  <div className="px-0 pt-1 space-y-2 md:space-y-4">
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 space-y-2 sm:space-y-0">
                      <Label htmlFor="hospitalName">
                        Hospital Name
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        type="text"
                        placeholder="Hospital Name"
                        required={formData.diseaseDetail ? false : true}
                        name="hospitalName"
                        id="hospitalName"
                        autoComplete="new-off"
                        wrapClassName="col-span-2 w-full md:max-w-md lg:col-span-2"
                        value={formData.refer.hospitalName}
                        onChange={handleHigherHospitalChange}
                      />
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 space-y-2 sm:space-y-0">
                      <Label htmlFor="doctorName">Appointed Doctor Name</Label>
                      <Input
                        type="text"
                        placeholder="Doctor Name.."
                        name="doctorName"
                        id="doctorName"
                        autoComplete="new-off"
                        wrapClassName="col-span-2 w-full md:max-w-md lg:col-span-2"
                        value={formData.refer.doctorName}
                        onChange={handleHigherHospitalChange}
                      />
                    </div>
                    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 space-y-2 sm:space-y-0">
                      <Label htmlFor="referMessage">Refer message</Label>
                      <Input
                        id="referMessage"
                        placeholder="Message.."
                        name="referMessage"
                        autoComplete="new-off"
                        wrapClassName="col-span-2 w-full md:max-w-md lg:col-span-2"
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
        <div className="col-span-10 2xl:col-span-3 flex flex-col gap-4">
          <ReceiptForm
            receiptInfo={formData.receipt_details}
            setReceiptInfo={setFormData}
          />

          <PrescriptionAdditionalInfoForm
            additionalInfo={formData.prescription_additional_details}
            setAdditionalInfo={setFormData}
          />
        </div>

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
          <Button
            className="w-28 sm:w-32"
            type="submit"
            variant={"default"}
            effect={"ringHover"}
            loading={submissionLoader}
          >
            Prescribe
          </Button>
        </div>
      </fieldset>
    </form>
  );
};

export default PrescribeForm;
