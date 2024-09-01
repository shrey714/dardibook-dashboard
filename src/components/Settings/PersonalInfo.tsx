/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";
import { signOutUser } from "@/firebase/firebaseAuth";
import { useAppDispatch } from "@/redux/store";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import CustomModal from "@/components/BlockedModal";
import Lottie from "react-lottie";
import * as animationData from "@/lottieFiles/SignOut.json";


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
      <Lottie
        options={defaultOptions}
        height={100}
        width={100}
      />
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
      <div className="mx-auto max-w-4xl bg-white rounded-lg">
        <div className="px-3 w-full py-2 md:px-8 flex flex-row justify-between items-center">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 tracking-wide">
            Personal Information
          </h3>
          <button
            className="btn animate-none h-3 btn-sm text-sm btn-error text-white"
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {/* arrow-right-start-on-rectangle */}
            <ArrowRightStartOnRectangleIcon className="size-4 text-white" />
            sign out
          </button>
        </div>
        <div className="border-t-4 md:border-t-[6px] border-gray-300 px-3 py-2 md:px-8 flex flex-col md:items-center md:flex-row gap-3 md:gap-8">
          <img
            className="w-20 h-20 rounded-lg self-center"
            src={userInfo?.photoURL}
            alt="user photo"
          />
          <div className="flex flex-1 flex-col">
            <p className="text-xs sm:text-sm font-medium leading-3 text-gray-500">
              Name
            </p>
            <p className="form-input py-[6px] mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700">
              {userInfo?.displayName}
            </p>
            <p className="mt-2 text-xs sm:text-sm font-medium leading-3 text-gray-500">
              Email
            </p>
            <p className="form-input py-[6px] mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700">
              {userInfo?.email}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PersonalInfo;
