/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import LogOutBTtn from "../common/LogOutBTtn";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth, useUser } from "@clerk/nextjs";

const PersonalInfo = () => {
  const { user } = useUser();
  const { orgRole } = useAuth();
  return (
    <Card className="mx-auto max-w-4xl 2xl:mx-0 shadow-none border h-min flex flex-1 flex-col bg-sidebar/70 2xl:max-w-xl">
      <CardHeader className="border-b p-5">
        <CardTitle>
          Personal Information
          <span className="ml-2 text-xs text-green-600 font-semibold border border-green-600 px-2 rounded-full">
            {orgRole === "org:clinic_head"
              ? "Admin"
              : orgRole === "org:doctor"
              ? "Doctor"
              : orgRole === "org:assistant_doctor"
              ? "SubDoctor"
              : orgRole === "org:medical_staff"
              ? "Medical"
              : ""}
          </span>
        </CardTitle>
        <CardDescription hidden></CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-3 py-2 md:px-8 flex flex-col md:items-center md:flex-row 2xl:flex-col gap-2 2xl:gap-2 2xl:px-3 md:gap-8">
          <Avatar className="h-20 w-20 rounded-lg self-center">
            <AvatarImage
              src={user?.imageUrl}
              alt={user?.firstName || "user profile"}
            />
            <AvatarFallback className="rounded-lg">
              {user?.firstName?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-1 flex-col w-full">
            <p className="text-xs sm:text-sm font-medium leading-3 text-gray-500">
              Name
            </p>
            <p className="form-input py-[6px] mt-1 w-full rounded-md border-border text-sm md:text-base font-medium bg-transparent">
              {user?.fullName}
            </p>
            <p className="mt-2 text-xs sm:text-sm font-medium leading-3 text-gray-500">
              Email
            </p>
            <p className="form-input py-[6px] mt-1 w-full rounded-md border-border text-sm md:text-base font-medium bg-transparent">
              {user?.emailAddresses[0].emailAddress}
            </p>
          </div>
        </div>
        <CardFooter className="flex justify-end px-3 py-3 pt-2 md:px-8">
          <LogOutBTtn size={"sm"} variant={"destructive"} />
        </CardFooter>
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;
