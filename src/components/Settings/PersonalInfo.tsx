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

const PersonalInfo = ({ userInfo, role }: any) => {
  return (
    <Card className="mx-auto max-w-4xl 2xl:mx-0 2xl:max-w-3xl shadow-none border h-min flex flex-1 flex-col">
      <CardHeader className="border-b p-5">
        <CardTitle>
          Personal Information
          <span className="ml-2 text-xs text-green-600 font-semibold border border-green-600 px-2 rounded-full">
            {role === "org:clinic_head"
              ? "Admin"
              : role === "org:doctor"
              ? "Doctor"
              : role === "org:assistant_doctor"
              ? "SubDoctor"
              : role === "org:medical_staff"
              ? "Medical"
              : ""}
          </span>
        </CardTitle>
        <CardDescription hidden></CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-3 py-2 md:px-8 flex flex-col md:items-center md:flex-row 2xl:flex-col gap-2 2xl:gap-2 2xl:px-3 md:gap-8">
          <Avatar className="h-20 w-20 rounded-lg self-center">
            <AvatarImage src={userInfo?.imageUrl} alt={userInfo?.firstName} />
            <AvatarFallback className="rounded-lg">
              {userInfo?.firstName?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-1 flex-col w-full">
            <p className="text-xs sm:text-sm font-medium leading-3 text-gray-500">
              Name
            </p>
            <p className="form-input py-[6px] mt-1 w-full rounded-md border-border text-sm md:text-base font-medium bg-transparent">
              {userInfo?.firstName}
            </p>
            <p className="mt-2 text-xs sm:text-sm font-medium leading-3 text-gray-500">
              Email
            </p>
            <p className="form-input py-[6px] mt-1 w-full rounded-md border-border text-sm md:text-base font-medium bg-transparent">
              {userInfo?.emailAddresses[0].emailAddress}
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
