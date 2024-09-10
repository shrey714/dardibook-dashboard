/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TokenBox from "../tokenFramer/TokenBox";
import {
  Cog6ToothIcon,
  HomeIcon,
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";
import {
  Cog6ToothIcon as Cog6ToothIconOutline,
  HomeIcon as HomeIconOutline,
  CalendarIcon as CalendarIconOutline,
  ClipboardDocumentCheckIcon as ClipboardDocumentCheckIconOutline,
  ClockIcon as ClockIconOutline,
} from "@heroicons/react/24/outline";
// import { HomeIcon as HomeIconoutline } from "@heroicons/react/24/outline";
// import { SlHome } from "react-icons/sl";
// import { BsInfoSquare, BsEnvelopeAt } from "react-icons/bs";
// import { FaTshirt, FaRedhat } from "react-icons/fa";
// import logo from "@/img/logo.svg";

const isSubPath = (pathname, route) => {
  // Ensure both pathname and route end with a slash
  const formattedPathname = pathname.endsWith("/") ? pathname : pathname + "/";
  const formattedRoute = route.endsWith("/") ? route : route + "/";

  // Check if the formattedRoute is a prefix of the formattedPathname
  return formattedPathname.startsWith(formattedRoute);
};

export default function Sidebar({ show, setter }) {
  const pathname = usePathname();
  // Define our base class
  const className =
    "flex flex-col bg-white w-[250px] transition-[margin-left] ease-in-out duration-500 fixed md:static h-screen top-0  z-50";
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
        className={`group transition-all duration-200 font-bold text-[15px] my-[6px] px-5 py-2 rounded-full mx-4 flex flex-row items-center leading-3 gap-1 ${colorClass}`}
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
        className={`group flex items-center my-4 px-1 py-1 rounded-full mx-4 self-center transition-all duration-200 border-2 ${colorClassBg}`}
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

  return (
    <>
      <div className={`${className}${appendClass}`}>
        <div className="p-2 flex">
          <TokenBox />
        </div>
        <div className="flex flex-col">
          <MenuItem name="Home" route="/dashboard/home" icon="home" />
          <MenuItem
            name="New registration"
            route="/dashboard/appointment"
            icon="new-registration"
          />
          <MenuItem
            name="Prescribe"
            route="/dashboard/prescribe"
            icon="prescribe"
          />
          <MenuItem name="History" route="/dashboard/history" icon="history" />
        </div>
        <div className="flex flex-1 flex-col justify-end pb-[calc(100vh-100svh)]">
          {/* <MenuItem name="Settings" route="/dashboard/home" icon={"icon"} /> */}
          <Settings />
        </div>
      </div>
      {show ? <ModalOverlay /> : <></>}
    </>
  );
}
