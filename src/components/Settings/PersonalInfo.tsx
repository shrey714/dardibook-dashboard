/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { signOutUser } from "@/firebase/firebaseAuth";
import { useAppDispatch } from "@/redux/store";
import CustomModal from "@/components/BlockedModal";
import Lottie from "react-lottie";
import * as animationData from "@/lottieFiles/SignOut.json";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import LogOutBTtn from "../common/LogOutBTtn";

const PersonalInfo = ({ userInfo }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <>
      <CustomModal isOpen={isModalOpen} mainScreenModal={false}>
        <Lottie options={defaultOptions} height={100} width={100} />
        <h3 className="text-base pb-8 md:text-lg font-semibold self-center text-gray-800">
          Are you sure you want to Logout?
        </h3>
        <div className="mt-3 flex items-center gap-x-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="flex flex-1 btn btn-outline text-sm font-semibold leading-6 text-gray-900"
          >
            No
          </button>
          <button
            onClick={() => {
              signOutUser(dispatch);
            }}
            className="flex flex-1 btn rounded-md btn-error text-sm font-semibold text-white shadow-sm"
          >
            Yes
          </button>
        </div>
      </CustomModal>
      <div className="mx-auto max-w-4xl bg-gradient-to-b from-muted/50 to-muted border-2 rounded-lg">
        <div className="px-3 w-full py-2 md:px-8 flex flex-row justify-between items-center flex-wrap">
          <h3 className="text-sm sm:text-base font-medium tracking-wide">
            Personal Information
            <span className="ml-2 text-xs sm:text-sm text-green-600 font-semibold border-2 border-green-600 px-2 rounded-full">
              {userInfo?.role === "admin"
                ? "Doctor"
                : userInfo?.role === "subDoctor"
                ? "subDoctor"
                : userInfo?.role === "medical"
                ? "Medical"
                : ""}
            </span>
          </h3>
          <LogOutBTtn size={"sm"} variant={"destructive"} />
        </div>
        <div className="border-t-2 px-3 py-2 md:px-8 flex flex-col md:items-center md:flex-row gap-3 md:gap-8">
          <Avatar className="h-20 w-20 rounded-lg self-center">
            <AvatarImage src={userInfo?.photoURL} alt={userInfo?.displayName} />
            <AvatarFallback className="rounded-lg">
              {userInfo?.displayName?.slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-1 flex-col">
            <p className="text-xs sm:text-sm font-medium leading-3 text-gray-500">
              Name
            </p>
            <p className="form-input py-[6px] mt-1 w-full rounded-md border-border text-sm md:text-base font-medium bg-transparent">
              {userInfo?.displayName}
            </p>
            <p className="mt-2 text-xs sm:text-sm font-medium leading-3 text-gray-500">
              Email
            </p>
            <p className="form-input py-[6px] mt-1 w-full rounded-md border-border text-sm md:text-base font-medium bg-transparent">
              {userInfo?.email}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalInfo;
