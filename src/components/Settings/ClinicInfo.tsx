/* eslint-disable @next/next/no-img-element */
import { createOrganization } from "@/app/services/createOrganization";
import React, { ChangeEvent, useEffect, useState } from "react";
import Loader from "../common/Loader";
import { CircleX, FileImage } from "lucide-react";
import { Button } from "../ui/button";

interface DoctorInfo {
  clinicName: string;
  doctorName: string;
  degree: string;
  registrationNumber: string;
  clinicNumber: string;
  phoneNumber: string;
  emailId: string;
  clinicAddress: string;
  clinicLogo: any;
  signaturePhoto: any;
  subscriptionId: string;
}

const getUpdatedFields = (
  oldObj: DoctorInfo,
  newObj: DoctorInfo
): Partial<DoctorInfo> =>
  Object.keys(newObj).reduce((acc, key) => {
    if (newObj[key as keyof DoctorInfo] !== oldObj[key as keyof DoctorInfo]) {
      acc[key as keyof DoctorInfo] = newObj[key as keyof DoctorInfo];
    }
    return acc;
  }, {} as Partial<DoctorInfo>);

const ClinicInfo = ({
  uid,
  role,
  doctorData,
  mainLoader,
  setdoctorData,
}: any) => {
  const [editableForm, seteditableForm] = useState(false);
  const [formdata, setformdata] = useState<any>(doctorData);
  const [loader, setloader] = useState(false);
  const [clinicLogoPreview, setClinicLogoPreview] = useState<string | null>(
    null
  );
  const [signaturePhotoPreview, setSignaturePhotoPreview] = useState<
    string | null
  >(null);

  useEffect(() => {
    setformdata(doctorData);
    setClinicLogoPreview(doctorData?.clinicLogo);
    setSignaturePhotoPreview(doctorData?.signaturePhoto);
  }, [doctorData]);

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

      setformdata((prevData: any) => ({
        ...prevData,
        [name]: file,
      }));
    } else {
      setformdata((prevData: any) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleRemoveImage = (name: string) => {
    setformdata((prevData: any) => ({
      ...prevData,
      [name]: null,
    }));
    if (name === "clinicLogo") {
      setClinicLogoPreview(null);
    } else if (name === "signaturePhoto") {
      setSignaturePhotoPreview(null);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const newdata = getUpdatedFields(doctorData, formdata);
    // console.log(newdata);
    if (uid) {
      setloader(true);
      const updateDoctorInfo = await createOrganization({
        uid: uid,
        formData: newdata,
      });
      if (updateDoctorInfo?.status === 200) {
        setloader(false);
        seteditableForm(false);
        setdoctorData({
          ...formdata,
          clinicLogo: clinicLogoPreview,
          signaturePhoto: signaturePhotoPreview,
        });
      } else {
        setloader(false);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit} autoFocus={true} autoComplete="off">
      <fieldset
        disabled={!editableForm}
        className="mx-auto max-w-4xl bg-muted/30 border-2 rounded-lg"
      >
        <div className="px-3 py-2 md:px-8">
          <h3 className="text-sm sm:text-base font-medium leading-7 tracking-wide flex flex-row justify-between items-center">
            Clinic Information
            {mainLoader && <Loader size="medium" />}
          </h3>
        </div>
        <div className="border-t-2 border-border flex flex-col md:flex-row">
          <div className="py-2 px-3 md:px-8 flex flex-1 flex-col border-b-2 md:border-r-2 md:border-b-0 border-border">
            <div className="grid grid-cols-6 gap-1 md:gap-6">
              {/* Clinic Name */}
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="clinicName"
                  className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                >
                  Clinic Name
                </label>
                <input
                  autoFocus={true}
                  required
                  type="text"
                  id="clinicName"
                  name="clinicName"
                  className="disabled:text-gray-400 form-input py-[6px] mt-1 w-full rounded-md border-border bg-transparent text-sm md:text-base font-medium"
                  value={formdata?.clinicName}
                  onChange={handleChange}
                />
              </div>
              {/* Doctor Name */}
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="doctorName"
                  className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                >
                  Doctor Name
                </label>
                <input
                  required
                  type="text"
                  id="doctorName"
                  name="doctorName"
                  className="disabled:text-gray-400 form-input py-[6px] mt-1 w-full rounded-md border-border bg-transparent text-sm md:text-base font-medium"
                  value={formdata?.doctorName}
                  onChange={handleChange}
                />
              </div>

              {/* Degree */}
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="clinicName"
                  className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                >
                  Degree
                </label>
                <input
                  autoFocus={true}
                  required
                  type="text"
                  id="degree"
                  name="degree"
                  className="disabled:text-gray-400 form-input py-[6px] mt-1 w-full rounded-md border-border bg-transparent text-sm md:text-base font-medium"
                  value={formdata?.degree}
                  onChange={handleChange}
                />
              </div>
              {/* Registraion number */}
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="doctorName"
                  className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                >
                  Registration Number
                </label>
                <input
                  required
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  className="disabled:text-gray-400 form-input py-[6px] mt-1 w-full rounded-md border-border bg-transparent text-sm md:text-base font-medium"
                  value={formdata?.registrationNumber}
                  onChange={handleChange}
                />
              </div>

              {/* Clinic Number */}
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="clinicNumber"
                  className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                >
                  Clinic Number
                </label>
                <input
                  required
                  type="number"
                  id="clinicNumber"
                  name="clinicNumber"
                  className="disabled:text-gray-400 form-input py-[6px] mt-1 w-full rounded-md border-border bg-transparent text-sm md:text-base font-medium"
                  value={formdata?.clinicNumber}
                  onChange={handleChange}
                />
              </div>
              {/* Phone Number */}
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="phoneNumber"
                  className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                >
                  Phone Number
                </label>
                <input
                  required
                  type="number"
                  id="phoneNumber"
                  name="phoneNumber"
                  className="disabled:text-gray-400 form-input py-[6px] mt-1 w-full rounded-md border-border bg-transparent text-sm md:text-base font-medium"
                  value={formdata?.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              {/* Email Id */}
              <div className="col-span-6 sm:col-span-4">
                <label
                  htmlFor="emailId"
                  className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                >
                  Email
                </label>
                <input
                  required
                  type="email"
                  id="emailId"
                  name="emailId"
                  className="disabled:text-gray-400 form-input py-[6px] mt-1 w-full rounded-md border-border bg-transparent text-sm md:text-base font-medium"
                  value={formdata?.emailId}
                  onChange={handleChange}
                />
              </div>
              {/* Clinic Address */}
              <div className="col-span-6">
                <label
                  htmlFor="clinicAddress"
                  className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                >
                  Clinic Address
                </label>
                <input
                  required
                  type="text"
                  id="clinicAddress"
                  name="clinicAddress"
                  className="disabled:text-gray-400 form-input py-[6px] mt-1 w-full rounded-md border-border bg-transparent text-sm md:text-base font-medium"
                  value={formdata?.clinicAddress}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="py-2 px-3 md:px-8 flex flex-wrap flex-row md:flex-col">
            {/* Clinic Logo */}
            <div className="p-1 min-w-40 flex flex-1 flex-col">
              <p className="block text-xs sm:text-sm font-medium leading-3 text-gray-500">
                Clinic Logo
              </p>
              <div className="mt-1 flex justify-center rounded-lg border border-dashed border-border px-6 py-8">
                <div className="text-center">
                  {clinicLogoPreview ? (
                    <div className="relative">
                      <img
                        src={clinicLogoPreview || "/Favicon.svg"}
                        alt="Clinic Logo"
                        className="mx-auto h-24 w-24 object-cover"
                      />
                      {editableForm && (
                        <button
                          type="button"
                          className="absolute top-0 right-0 -mt-2 -mr-2"
                          onClick={() => handleRemoveImage("clinicLogo")}
                        >
                          <CircleX className="h-6 w-6 text-red-600" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <FileImage
                        aria-hidden="true"
                        className="mx-auto h-14 w-14 text-gray-600"
                      />
                      <div className="mt-2 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="clinicLogo"
                          className="relative text-xs cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                          Clinic Logo
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
                      <p className="text-xs  text-gray-600">PNG, JPG</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Signature Photo */}
            <div className="p-1 min-w-40 flex flex-1 flex-col">
              <p className="block text-xs sm:text-sm font-medium leading-3 text-gray-500">
                Signature Photo
              </p>
              <div className="mt-1 flex justify-center rounded-lg border border-dashed border-border px-6 py-8">
                <div className="text-center">
                  {signaturePhotoPreview ? (
                    <div className="relative">
                      <img
                        src={signaturePhotoPreview || "/Favicon.svg"}
                        alt="Signature Photo"
                        className="mx-auto h-24 w-24 object-cover"
                      />
                      {editableForm && (
                        <button
                          type="button"
                          className="absolute top-0 right-0 -mt-2 -mr-2"
                          onClick={() => handleRemoveImage("signaturePhoto")}
                        >
                          <CircleX className="h-6 w-6 text-red-600" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <FileImage
                        aria-hidden="true"
                        className="mx-auto h-14 w-14 text-gray-600"
                      />
                      <div className="mt-2 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="signaturePhoto"
                          className="relative text-xs cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                          Signature
                          <input
                            required
                            id="signaturePhoto"
                            name="signaturePhoto"
                            accept="image/*"
                            type="file"
                            className="sr-only"
                            onChange={handleChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-600">PNG, JPG</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t-2 border-border px-3 py-2 md:px-8 flex flex-row items-center">
          {editableForm ? (
            <>
              <Button
                variant={"destructive"}
                onClick={() => {
                  setformdata(doctorData);
                  setClinicLogoPreview(doctorData?.clinicLogo);
                  setSignaturePhotoPreview(doctorData?.signaturePhoto);
                  seteditableForm(false);
                }}
              >
                <h3 className="text-base font-medium leading-4 tracking-wide">
                  Cancel
                </h3>
              </Button>
              <Button type="submit" variant={"outline"} className="ml-3">
                {loader ? (
                  <Loader size="medium" />
                ) : (
                  <h3 className="text-base font-medium leading-4 tracking-wide">
                    Save
                  </h3>
                )}
              </Button>
            </>
          ) : (
            <Button variant={"default"} asChild>
              <span
                className={`cursor-pointer ${
                  role === "admin" ? "" : "btn-disabled"
                }`}
                onClick={() => seteditableForm(true)}
              >
                <h3 className="text-base font-medium leading-4 tracking-wide">
                  Edit
                </h3>
              </span>
            </Button>
          )}
        </div>
      </fieldset>
    </form>
  );
};

export default ClinicInfo;
