/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import LogOutBTtn from "../common/LogOutBTtn";

const PersonalInfo = ({ userInfo, role }: any) => {
  return (
    <>
      <div className="mx-auto max-w-4xl bg-gradient-to-b from-muted/50 to-muted border-2 rounded-lg">
        <div className="px-3 w-full py-2 md:px-8 flex flex-row justify-between items-center flex-wrap">
          <h3 className="text-sm sm:text-base font-medium tracking-wide">
            Personal Information
            <span className="ml-2 text-xs sm:text-sm text-green-600 font-semibold border-2 border-green-600 px-2 rounded-full">
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
          </h3>
          <LogOutBTtn size={"sm"} variant={"destructive"} />
        </div>
        <div className="border-t-2 px-3 py-2 md:px-8 flex flex-col md:items-center md:flex-row gap-3 md:gap-8">
          <Avatar className="h-20 w-20 rounded-lg self-center">
            <AvatarImage src={userInfo?.imageUrl} alt={userInfo?.firstName} />
            <AvatarFallback className="rounded-lg">
              {userInfo?.firstName?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-1 flex-col">
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
      </div>
    </>
  );
};

export default PersonalInfo;
