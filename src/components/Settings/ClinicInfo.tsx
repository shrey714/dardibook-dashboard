/* eslint-disable @next/next/no-img-element */
import { createDoctor } from "@/app/services/createDoctor";
import { PhotoIcon, XCircleIcon } from "@heroicons/react/24/solid";
import React, { ChangeEvent, useEffect, useState } from "react";

interface DoctorInfo {
  clinicName: string;
  doctorName: string;
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

const ClinicInfo = ({ uid, doctorData, mainLoader, setdoctorData }: any) => {
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
      const updateDoctorInfo = await createDoctor({
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
        className="mt-3 md:mt-6 mx-auto max-w-4xl bg-white rounded-lg"
      >
        <div className="px-3 py-2 md:px-8">
          <h3 className="text-sm sm:text-base font-semibold leading-7 text-gray-900 tracking-wide flex flex-row justify-between items-center">
            Clinic Information
            {mainLoader && (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="inline w-6 h-6 text-gray-300 animate-spin fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            )}
          </h3>
        </div>
        <div className="border-t-4 md:border-t-[6px] border-gray-300 flex flex-col md:flex-row">
          <div className="py-2 px-3 md:px-8 flex flex-1 flex-col border-b-4 md:border-b-0 md:border-r-[6px] border-gray-300">
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
                  className="disabled:text-gray-500 form-input py-[6px] mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700"
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
                  className="disabled:text-gray-500 form-input py-[6px] mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700"
                  value={formdata?.doctorName}
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
                  className="disabled:text-gray-500 form-input py-[6px] mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700"
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
                  className="disabled:text-gray-500 form-input py-[6px] mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700"
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
                  className="disabled:text-gray-500 form-input py-[6px] mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700"
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
                  className="disabled:text-gray-500 form-input py-[6px] mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700"
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
              <div className="mt-1 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-8">
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
                          <XCircleIcon className="h-6 w-6 text-red-600" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <PhotoIcon
                        aria-hidden="true"
                        className="mx-auto h-14 w-14 text-gray-600"
                      />
                      <div className="mt-2 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="clinicLogo"
                          className="relative text-xs cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                          Upload a Clinic Logo
                          <input
                            required
                            id="clinicLogo"
                            name="clinicLogo"
                            type="file"
                            className="sr-only"
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
              <div className="mt-1 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-8">
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
                          <XCircleIcon className="h-6 w-6 text-red-600" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <PhotoIcon
                        aria-hidden="true"
                        className="mx-auto h-14 w-14 text-gray-600"
                      />
                      <div className="mt-2 flex text-sm leading-6 text-gray-600">
                        <label
                          htmlFor="signaturePhoto"
                          className="relative text-xs cursor-pointer font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                          Upload a Signature
                          <input
                            required
                            id="signaturePhoto"
                            name="signaturePhoto"
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
        <div className="border-t-4 md:border-t-[6px] border-gray-300 px-3 py-2 md:px-8 flex flex-row items-center">
          {editableForm ? (
            <>
              <button
                className="btn animate-none btn-neutral btn-sm "
                onClick={() => {
                  setformdata(doctorData);
                  setClinicLogoPreview(doctorData?.clinicLogo);
                  setSignaturePhotoPreview(doctorData?.signaturePhoto);
                  seteditableForm(false);
                }}
              >
                <h3 className="text-base font-semibold leading-4 tracking-wide">
                  Cancel
                </h3>
              </button>
              <button
                type="submit"
                className="btn animate-none btn-sm btn-primary ml-3"
              >
                {loader ? (
                  <span className="loading loading-spinner loading-xs"></span>
                ) : (
                  <h3 className="text-base font-semibold leading-4 tracking-wide">
                    Save
                  </h3>
                )}
              </button>
            </>
          ) : (
            <span
              className="btn btn-sm cursor-pointer animate-none btn-primary"
              onClick={() => seteditableForm(true)}
            >
              <h3 className="text-base font-semibold leading-4 text-white tracking-wide">
                Edit
              </h3>
            </span>
          )}
        </div>
      </fieldset>
    </form>
  );
};

export default ClinicInfo;
