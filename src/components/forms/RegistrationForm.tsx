"use client";
/* eslint-disable @next/next/no-img-element */
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Loader from "../common/Loader";
import { CircleX, FileImage } from "lucide-react";
import LogOutBTtn from "../common/LogOutBTtn";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createDoctor } from "@/app/services/createDoctor";

const RegistrationForm = () => {
  const { isLoaded, orgId } = useAuth();
  const router = useRouter();
  const [clinicLogoPreview, setClinicLogoPreview] = useState<string | null>(
    null
  );
  const [signaturePhotoPreview, setSignaturePhotoPreview] = useState<
    string | null
  >(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === "clinicLogo") {
          setClinicLogoPreview(reader.result as string);
        } else if (name === "signaturePhoto") {
          setSignaturePhotoPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
      setFormData((prevData) => ({
        ...prevData,
        [name]: file,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleRemoveImage = (name: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: null,
    }));
    if (name === "clinicLogo") {
      setClinicLogoPreview(null);
    } else if (name === "signaturePhoto") {
      setSignaturePhotoPreview(null);
    }
  };

  const [submissionLoader, setSubmissionLoader] = useState(false);
  useEffect(() => {
    if (isLoaded && orgId) {
      router.replace("/");
    }
  }, [router, isLoaded, orgId]);
  const [formData, setFormData] = useState({
    clinicName: "",
    doctorName: "",
    degree: "",
    registrationNumber: "",
    clinicNumber: "",
    phoneNumber: "",
    emailId: "XXX",
    clinicAddress: "",
    clinicLogo: null as File | null,
    signaturePhoto: null as File | null,
  });
  // upload form data to docotr's collection============

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (orgId) {
      setSubmissionLoader(true);
      const data = await createDoctor({
        uid: orgId,
        formData,
      });
      // open modal on submitting the register patoent form
      if (data?.status === 200) {
        // createOrganization({ name: formData.clinicName });
      } else {
        setSubmissionLoader(false);
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoFocus={true}
      autoComplete="off"
      className="w-full"
    >
      <fieldset disabled={submissionLoader} className="grid grid-cols-12 gap-6">
        {/* Clinic Name */}
        <div className="col-span-12 sm:col-span-6">
          <label htmlFor="clinicName" className="block text-sm font-medium">
            Clinic Name<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            required
            type="text"
            id="clinicName"
            name="clinicName"
            className="form-input py-[6px] mt-1 w-full rounded-md border-gray-200 bg-gray-300 text-sm text-gray-700"
            value={formData.clinicName}
            autoFocus={true}
            onChange={handleChange}
          />
        </div>
        {/* Doctor Name */}
        <div className="col-span-12 sm:col-span-6">
          <label htmlFor="doctorName" className="block text-sm font-medium">
            Doctor Name<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            required
            type="text"
            id="doctorName"
            name="doctorName"
            className="form-input py-[6px] mt-1 w-full rounded-md border-gray-200 bg-gray-300 text-sm text-gray-700"
            value={formData.doctorName}
            onChange={handleChange}
          />
        </div>

        {/* Degree */}
        <div className="col-span-12 sm:col-span-6">
          <label htmlFor="degree" className="block text-sm font-medium">
            Degree<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            required
            type="text"
            id="degree"
            name="degree"
            className="form-input py-[6px] mt-1 w-full rounded-md border-gray-200 bg-gray-300 text-sm text-gray-700"
            value={formData.degree}
            onChange={handleChange}
          />
        </div>
        {/* Registraion number */}
        <div className="col-span-12 sm:col-span-6">
          <label
            htmlFor="registrationNumber"
            className="block text-sm font-medium"
          >
            Registration Number<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            required
            type="text"
            id="registrationNumber"
            name="registrationNumber"
            className="form-input py-[6px] mt-1 w-full rounded-md border-gray-200 bg-gray-300 text-sm text-gray-700"
            value={formData.registrationNumber}
            onChange={handleChange}
          />
        </div>

        {/* Clinic Number */}
        <div className="col-span-12 sm:col-span-6">
          <label htmlFor="clinicNumber" className="block text-sm font-medium">
            Clinic Number<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            required
            type="tel"
            id="clinicNumber"
            name="clinicNumber"
            className="form-input py-[6px] mt-1 w-full rounded-md border-gray-200 bg-gray-300 text-sm text-gray-700"
            value={formData.clinicNumber}
            pattern="\d*" // Ensures only numeric input
            title="Please enter a valid mobile number."
            onChange={handleChange}
          />
        </div>
        {/* Phone Number */}
        <div className="col-span-12 sm:col-span-6">
          <label htmlFor="phoneNumber" className="block text-sm font-medium">
            Phone Number<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            required
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            className="form-input py-[6px] mt-1 w-full rounded-md border-gray-200 bg-gray-300 text-sm text-gray-700"
            value={formData.phoneNumber}
            pattern="^\d{10}$" // Adjust the pattern to match the format you want
            title="Please enter a valid 10-digit mobile number."
            maxLength={10}
            onChange={handleChange}
          />
        </div>
        {/* Email Id */}
        <div className="col-span-12 sm:col-span-6">
          <label htmlFor="emailId" className="block text-sm font-medium">
            Email<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            required
            type="email"
            id="emailId"
            name="emailId"
            className="form-input py-[6px] mt-1 w-full rounded-md border-gray-200 bg-gray-300 text-sm text-gray-700"
            value={formData.emailId ? formData.emailId : ""}
            onChange={handleChange}
            disabled
          />
        </div>
        {/* Clinic Address */}
        <div className="col-span-12">
          <label htmlFor="clinicAddress" className="block text-sm font-medium">
            Clinic Address<span className="text-red-500 ml-1">*</span>
          </label>
          <input
            required
            type="text"
            id="clinicAddress"
            name="clinicAddress"
            className="form-input py-[6px] mt-1 w-full rounded-md border-gray-200 bg-gray-300 text-sm text-gray-700"
            value={formData.clinicAddress}
            onChange={handleChange}
          />
        </div>

        {/* Clinic Logo */}
        <div className="col-span-12 sm:col-span-6">
          <label
            htmlFor="clinicLogo"
            className="block text-sm font-medium leading-6"
          >
            Clinic Logo<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-ring px-6 py-8">
            <div className="text-center">
              {clinicLogoPreview ? (
                <div className="relative">
                  <img
                    src={clinicLogoPreview}
                    alt="Clinic Logo"
                    className="mx-auto h-24 w-24 object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 -mt-2 -mr-2"
                    onClick={() => handleRemoveImage("clinicLogo")}
                  >
                    <CircleX className="h-6 w-6 text-red-500" />
                  </button>
                </div>
              ) : (
                <>
                  <FileImage aria-hidden="true" className="mx-auto h-12 w-12" />
                  <div className="mt-4 flex text-sm leading-6">
                    <label
                      htmlFor="clinicLogo"
                      className="relative cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      <span>Upload a Clinic Logo</span>
                      <input
                        required
                        id="clinicLogo"
                        name="clinicLogo"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs leading-5 text-gray-600">PNG, JPG</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Signature Photo */}
        <div className="col-span-12 sm:col-span-6">
          <label
            htmlFor="signaturePhoto"
            className="block text-sm font-medium leading-6"
          >
            Signature Photo<span className="text-red-500 ml-1">*</span>
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-ring px-6 py-8">
            <div className="text-center">
              {signaturePhotoPreview ? (
                <div className="relative">
                  <img
                    src={signaturePhotoPreview}
                    alt="Signature Photo"
                    className="mx-auto h-24 w-24 object-cover"
                  />
                  <button
                    type="button"
                    className="absolute top-0 right-0 -mt-2 -mr-2"
                    onClick={() => handleRemoveImage("signaturePhoto")}
                  >
                    <CircleX className="h-6 w-6 text-red-500" />
                  </button>
                </div>
              ) : (
                <>
                  <FileImage aria-hidden="true" className="mx-auto h-12 w-12" />
                  <div className="mt-4 flex text-sm leading-6">
                    <label
                      htmlFor="signaturePhoto"
                      className="relative cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      <span>Upload a Signature Logo</span>
                      <input
                        required
                        id="signaturePhoto"
                        name="signaturePhoto"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs leading-5">PNG, JPG</p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-12">
          <p className="text-xs sm:text-sm">
            By creating an account, you agree to our{" "}
            <a
              href="https://dardibook.in/documents/terms-conditions"
              target="_blank"
              className="text-gray-500 underline"
            >
              terms and conditions
            </a>
            {"  "}
            and{"  "}
            <a
              href="https://dardibook.in/documents/privacy-policy"
              target="_blank"
              className="text-gray-500 underline"
            >
              privacy policy
            </a>
            .
          </p>
        </div>

        <div className="col-span-12 flex justify-center sm:gap-6">
          <button
            disabled={submissionLoader}
            className="bg-gray-300 border-0 animate-none btn px-5 py-[10px] text-gray-800 outline-none min-w-40 transition-all flex items-center justify-center h-10 text-base sm:text-lg font-bold tracking-wide w-full rounded-full select-none"
          >
            {submissionLoader ? <Loader size="medium" /> : "Register myself"}
          </button>
        </div>

        <div className="col-span-12">
          <p className="text-xs font-medium sm:text-sm">
            Want to use another account :{" "}
            <LogOutBTtn size={"sm"} variant={"destructive"} />
          </p>
        </div>
      </fieldset>
    </form>
  );
};

export default RegistrationForm;
