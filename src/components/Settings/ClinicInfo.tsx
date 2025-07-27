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
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { SaveIcon } from "lucide-react";

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
    setformdata((prevData: DoctorInfo) => ({
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
            organization.reload();
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
    <Card className="mx-auto max-w-4xl 2xl:mx-0 h-min flex flex-1 flex-col 2xl:max-w-2xl">
      <CardHeader>
        <CardTitle className="font-medium">Clinic Information</CardTitle>
        <CardDescription>Update your basic clinic information.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} autoFocus={false} autoComplete="off">
          <fieldset disabled={loader}>
            <div className="grid grid-cols-6 gap-4">
              {/* Doctor Name */}
              <div className="col-span-6 sm:col-span-3 space-y-2">
                <Label htmlFor="doctorName">Doctor Name</Label>
                <Input
                  required
                  type="text"
                  id="doctorName"
                  name="doctorName"
                  value={formdata?.doctorName}
                  onChange={handleChange}
                />
              </div>

              {/* Degree */}
              <div className="col-span-6 sm:col-span-3 space-y-2">
                <Label htmlFor="clinicName">Degree</Label>
                <Input
                  required
                  type="text"
                  id="degree"
                  name="degree"
                  value={formdata?.degree}
                  onChange={handleChange}
                />
              </div>
              {/* Registraion number */}
              <div className="col-span-6 sm:col-span-3 space-y-2">
                <Label htmlFor="doctorName">Registration Number</Label>
                <Input
                  required
                  type="text"
                  id="registrationNumber"
                  name="registrationNumber"
                  value={formdata?.registrationNumber}
                  onChange={handleChange}
                />
              </div>

              {/* Clinic Number */}
              <div className="col-span-6 sm:col-span-3 space-y-2">
                <Label htmlFor="clinicNumber">Clinic Number</Label>
                <Input
                  required
                  type="number"
                  id="clinicNumber"
                  name="clinicNumber"
                  value={formdata?.clinicNumber}
                  onChange={handleChange}
                />
              </div>
              {/* Phone Number */}
              <div className="col-span-6 sm:col-span-3 space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  required
                  type="number"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formdata?.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              {/* Clinic Address */}
              <div className="col-span-6 space-y-2">
                <Label htmlFor="clinicAddress">Clinic Address</Label>
                <Input
                  required
                  type="text"
                  id="clinicAddress"
                  name="clinicAddress"
                  value={formdata?.clinicAddress}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mt-4 flex flex-row items-center justify-end">
              <Button
                disabled={loader}
                type="submit"
                className="ml-2"
                effect={"ringHover"}
                icon={SaveIcon}
                iconPlacement="right"
                loading={loader}
                loadingText={"Saving"}
              >
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
