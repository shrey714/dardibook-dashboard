/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TokenBox from "../tokenFramer/TokenBox";
import { useAppSelector } from "@/redux/store";
import { getDocotr } from "@/app/services/getDoctor";
import {
  Cog6ToothIcon,
  HomeIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  NewspaperIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import {
  Cog6ToothIcon as Cog6ToothIconOutline,
  HomeIcon as HomeIconOutline,
  CalendarIcon as CalendarIconOutline,
  ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconOutline,
  ClockIcon as ClockIconOutline,
  NewspaperIcon as NewspaperIconOutline,
  UserGroupIcon as UserGroupIconOutline,
  PlusCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import CustomModal from "@/components/BlockedModal";
import RolesModal from "./RolesModal";
import Image from "next/image";

const isSubPath = (pathname, route) => {
  // Ensure both pathname and route end with a slash
  const formattedPathname = pathname.endsWith("/") ? pathname : pathname + "/";
  const formattedRoute = route.endsWith("/") ? route : route + "/";

  // Check if the formattedRoute is a prefix of the formattedPathname
  return formattedPathname.startsWith(formattedRoute);
};

export default function Sidebar({ show, setter }) {
  const userInfo = useAppSelector((state) => state.auth.user);
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorLoader, setdoctorLoader] = useState(true);
  const [doctorData, setdoctorData] = useState();
  useEffect(() => {
    const setDocotrData = async () => {
      if (userInfo?.uid) {
        setdoctorLoader(true);
        const doctorData = await getDocotr(userInfo?.uid);
        if (doctorData.data) {
          setdoctorData(doctorData.data);
        } else {
          console.log("No data available for the provided DoctorID.");
        }
        setdoctorLoader(false);
      } else {
        setdoctorLoader(false);
      }
    };
    setDocotrData();
  }, [userInfo?.uid]);
  // Define our base class
  const className =
    "flex flex-col bg-white w-[250px] transition-[margin-left] ease-in-out duration-500 fixed md:static h-screen top-0  z-50 overflow-y-auto overflow-x-hidden";
  // Append class based on state of sidebar visiblity
  const appendClass = show ? " ml-0" : " ml-[-250px] md:ml-0";

  // Clickable menu items
  const MenuItem = ({ icon, name, route }) => {
    // Highlight menu item based on currently displayed route
    const colorClass = isSubPath(pathname, route)
      ? "text-black bg-primary border-2 border-primary text-white"
      : "text-gray-600 bg-white border-2 border-gray-300 hover:border-primary hover:text-black";

    const renderIcon = (icon) => {
      switch (icon) {
        case "home":
          return (
            <>
              <HomeIconOutline
                className={`h-5 w-5 transition-transform duration-300 ${
                  isSubPath(pathname, route)
                    ? "hidden"
                    : "block group-hover:hidden"
                }`}
              />
              <HomeIcon
                className={`h-5 w-5 transition-transform duration-300 ${
                  isSubPath(pathname, route)
                    ? "block"
                    : "hidden group-hover:block"
                }`}
              />
            </>
          );
        case "new-registration":
          return (
            <>
              <CalendarIconOutline
                className={`h-5 w-5 transition-transform duration-300 ${
                  isSubPath(pathname, route)
                    ? "hidden"
                    : "block group-hover:hidden"
                }`}
              />
              <CalendarIcon
                className={`h-5 w-5 transition-transform duration-300 ${
                  isSubPath(pathname, route)
                    ? "block"
                    : "hidden group-hover:block"
                }`}
              />
            </>
          );
        case "prescribe":
          return (
            <>
              <ClipboardDocumentCheckIconOutline
                className={`h-5 w-5 transition-transform duration-300 ${
                  isSubPath(pathname, route)
                    ? "hidden"
                    : "block group-hover:hidden"
                }`}
              />
              <ClipboardDocumentCheckIcon
                className={`h-5 w-5 transition-transform duration-300 ${
                  isSubPath(pathname, route)
                    ? "block"
                    : "hidden group-hover:block"
                }`}
              />
            </>
          );
        case "history":
          return (
            <>
              <ClockIconOutline
                className={`h-5 w-5 transition-transform duration-300 ${
                  isSubPath(pathname, route)
                    ? "hidden"
                    : "block group-hover:hidden"
                }`}
              />
              <ClockIcon
                className={`h-5 w-5 transition-transform duration-300 ${
                  isSubPath(pathname, route)
                    ? "block"
                    : "hidden group-hover:block"
                }`}
              />
            </>
          );
        case "medical":
          return (
            <>
              <NewspaperIconOutline
                className={`h-5 w-5 transition-transform duration-300 ${
                  isSubPath(pathname, route)
                    ? "hidden"
                    : "block group-hover:hidden"
                }`}
              />
              <NewspaperIcon
                className={`h-5 w-5 transition-transform duration-300 ${
                  isSubPath(pathname, route)
                    ? "block"
                    : "hidden group-hover:block"
                }`}
              />
            </>
          );
        default:
          return null; // Fallback for unknown icons
      }
    };

    return (
      <Link
        onClick={() => {
          setter((oldVal) => !oldVal);
        }}
        href={route}
        className={`group tracking-[0.0125em] transition-all duration-200 font-bold text-[15px] my-[6px] px-5 py-2 rounded-full mx-4 flex flex-row items-center leading-3 gap-1 ${colorClass}`}
      >
        {renderIcon(icon)}
        {name}
      </Link>
    );
  };

  // Overlay to prevent clicks in background, also serves as our close button
  const ModalOverlay = () => (
    <div
      className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-40`}
      onClick={() => {
        setter((oldVal) => !oldVal);
      }}
    />
  );

  // Settings button
  const Settings = () => {
    const route = "/dashboard/settings";
    const colorClassBg = isSubPath(pathname, route)
      ? "bg-primary border-primary text-white"
      : "bg-white border-gray-300 hover:border-primary text-gray-600 hover:text-black";
    return (
      <Link
        onClick={() => {
          setter((oldVal) => !oldVal);
        }}
        href="/dashboard/settings"
        className={`group flex items-center px-1 py-1 rounded-full mx-2 transition-all duration-200 border-2 ${colorClassBg}`}
      >
        <Cog6ToothIconOutline
          className={`w-5 h-5 transition-transform duration-300 ${
            isSubPath(pathname, route) ? "hidden" : "block group-hover:hidden"
          }`}
        />
        <Cog6ToothIcon
          className={`w-5 h-5 transition-transform duration-300 ${
            isSubPath(pathname, route) ? "block" : "hidden group-hover:block"
          }`}
        />
      </Link>
    );
  };

  // Roles button
  const Roles = () => {
    const colorClassBg = isModalOpen
      ? "bg-primary border-primary text-white"
      : "bg-white border-gray-300 hover:border-primary text-gray-600 hover:text-black";
    return (
      <div
        onClick={() => {
          setIsModalOpen(true);
        }}
        className={`group flex items-center px-1 py-1 rounded-full mx-2 transition-all duration-200 border-2 ${colorClassBg}`}
      >
        <UserGroupIconOutline
          className={`w-5 h-5 transition-transform duration-300 ${
            isModalOpen ? "hidden" : "block group-hover:hidden"
          }`}
        />
        <UserGroupIcon
          className={`w-5 h-5 transition-transform duration-300 ${
            isModalOpen ? "block" : "hidden group-hover:block"
          }`}
        />
      </div>
    );
  };

  const BreakLine = () => (
    <hr className="w-[calc(100%-40px)] rounded mx-auto my-1 border-gray-300 border-t-2" />
  );
  return (
    <>
      <CustomModal isOpen={isModalOpen} mainScreenModal={false}>
        <RolesModal userInfo={userInfo} isOpen={isModalOpen} />
        <div className="flex flex-col items-center justify-center gap-y-7">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="btn animate-none border-2 btn-outline rounded-full min-h-min h-min py-2 px-7 text-xs leading-none"
          >
            Close
          </button>
        </div>
      </CustomModal>
      <div className={`${className}${appendClass}`}>
        <Link
          href={"/"}
          className="cursor-pointer flex flex-row items-center justify-center gap-1 mt-2 w-fit self-center"
        >
          <span className="self-center text-gray-800 text-xl font-semibold whitespace-nowrap">
            DardiBook
          </span>
          <span className="text-[7px] text-gray-800 font-semibold border-[1.5px] border-gray-800 px-2 rounded-full">
            {userInfo?.role === "admin"
              ? "Doctor"
              : userInfo?.role === "subDoctor"
              ? "subDoctor"
              : userInfo?.role === "medical"
              ? "Medical"
              : ""}
          </span>
        </Link>
        {(userInfo?.role === "admin" || userInfo?.role === "subDoctor") && (
          <div className="px-2 flex">
            <TokenBox />
          </div>
        )}
        <div className="flex flex-col">
          {(userInfo?.role === "admin" || userInfo?.role === "subDoctor") && (
            <MenuItem name="Home" route="/dashboard/home" icon="home" />
          )}
          {(userInfo?.role === "admin" || userInfo?.role === "subDoctor") && (
            <MenuItem
              name="Register"
              route="/dashboard/appointment"
              icon="new-registration"
            />
          )}
          {userInfo?.role === "admin" && (
            <MenuItem
              name="Prescribe"
              route="/dashboard/prescribe"
              icon="prescribe"
            />
          )}

          {(userInfo?.role === "admin" || userInfo?.role === "subDoctor") && (
            <MenuItem
              name="History"
              route="/dashboard/history"
              icon="history"
            />
          )}
          {(userInfo?.role === "admin" || userInfo?.role === "medical") && (
            <MenuItem
              name="Medical"
              route="/dashboard/medical"
              icon="medical"
            />
          )}
        </div>

        <div className="flex flex-row flex-1 items-end justify-center mt-1">
          {(userInfo?.role === "subDoctor" || userInfo?.role === "medical") && (
            <Roles />
          )}
          <Settings />
        </div>
        <BreakLine />

        <div className="flex flex-row items-center gap-3 justify-center px-5 mb-1 pb-[calc(100vh-100svh)]">
          <div
            className="flex items-center gap-2 p-1 bg-gray-300 rounded-full shadow-md tooltip before:bg-gray-800 before:text-white"
            data-tip={`${userInfo?.displayName}`}
          >
            <UserCircleIcon
              className={`size-6 text-gray-600 rounded-full bg-white`}
            />
            <Image
              width={24}
              height={24}
              className="size-6 rounded-full bg-gray-300 shadow-lg"
              src={userInfo?.photoURL || ""}
              alt="profile photo"
            />
          </div>
          <div
            className="flex items-center gap-2 p-1 bg-gray-300 rounded-full shadow-md tooltip before:bg-gray-800 before:text-white"
            data-tip={`${doctorData?.clinicName}`}
          >
            <PlusCircleIcon
              className={`size-6 text-gray-600 rounded-full bg-white`}
            />
            {doctorLoader ? (
              <div className="skeleton size-6 s rounded-full"></div>
            ) : (
              <Image
                width={24}
                height={24}
                className="size-6 rounded-full bg-gray-300 shadow-lg"
                src={doctorData?.clinicLogo || ""}
                alt="clinic photo"
              />
            )}
          </div>
        </div>
      </div>
      {show ? <ModalOverlay /> : <></>}
    </>
  );
}
