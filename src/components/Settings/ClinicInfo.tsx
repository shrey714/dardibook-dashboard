/* eslint-disable @next/next/no-img-element */
import React, { ChangeEvent, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useOrganization } from "@clerk/nextjs";
import { updateOrgMetadata } from "@/app/dashboard/settings/clinic/_actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import toast from "react-hot-toast";

interface DoctorInfo {
  doctorName: string;
  degree: string;
  registrationNumber: string;
  clinicNumber: string;
  phoneNumber: string;
  clinicAddress: string;
}

const ClinicInfo = () => {
  const { organization, isLoaded } = useOrganization();
  const [loader, setloader] = useState<boolean>(false);
  const [formdata, setformdata] = useState<DoctorInfo>({
    degree: "",
    doctorName: "",
    phoneNumber: "",
    clinicNumber: "",
    clinicAddress: "",
    registrationNumber: "",
  });

  useEffect(() => {
    if (isLoaded && organization) {
      setformdata(organization.publicMetadata as unknown as DoctorInfo);
    }
  }, [organization, isLoaded]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setformdata((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setloader(true);
    if (!organization) return;
    toast.promise(
      async () => {
        await updateOrgMetadata(formdata).then(
          () => {
            setloader(false);
          },
          (error) => {
            console.error("Error updating metadata:", error);
            setloader(false);
          }
        );
      },
      {
        loading: "Updating...",
        success: "Updated successfully",
        error: "Error when updating",
      },
      {
        position: "bottom-right",
      }
    );
  };
  return (
    <Card className="mx-auto max-w-2xl 2xl:mx-0 shadow-none border h-min bg-sidebar/70">
      <CardHeader className="border-b p-5">
        <CardTitle>Clinic Information</CardTitle>
        <CardDescription>Update your basic clinic information.</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} autoFocus={false} autoComplete="off">
          <fieldset disabled={loader}>
            <div className="py-2 px-3 md:px-8 grid grid-cols-6 gap-1 md:gap-4">
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
            <div className="x-3 pt-2 pb-4 px-3 md:px-8 flex flex-row items-center justify-end">
              <Button disabled={loader} type="submit" className="ml-2">
                <h3 className="text-base font-medium leading-4 tracking-wide">
                  Save
                </h3>
              </Button>
            </div>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClinicInfo;
