/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import TokenBox from "../tokenFramer/TokenBox";
import { ChevronRightIcon, Cog6ToothIcon } from "@heroicons/react/24/solid";
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
      ? "text-black bg-primary"
      : "text-black/50 hover:text-black";

    return (
      <Link
        onClick={() => {
          setter((oldVal) => !oldVal);
        }}
        href={route}
        className={`font-bold border-2 border-primary text-md my-2 px-5 py-2 rounded-full mx-4  ${colorClass}`}
      >
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
    const status = !isSubPath(pathname, route);

    return (
      <Link
        href="/dashboard/settings"
        className={`group flex items-center my-4 ${
          status ? "px-1" : "px-2"
        } py-1 rounded-full mx-4 border-2 border-gray-800 self-center transition-all duration-300 hover:px-2`}
      >
        <Cog6ToothIcon
          className={`w-5 h-5 text-gray-800 transition-transform duration-300 ${
            status ? "rotate-0" : "rotate-45"
          } group-hover:rotate-45`}
        />
        <img
          src="/Right_arrow.svg"
          className={`transition-all duration-300 ${
            status ? "w-0" : "w-4"
          } h-4 group-hover:w-4`}
          alt="a"
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
          <MenuItem name="Home" route="/dashboard/home" icon={"icon"} />
          <MenuItem
            name="New registration"
            route="/dashboard/appointment"
            icon={"icon"}
          />
          <MenuItem
            name="Prescribe"
            route="/dashboard/prescribe"
            icon={"icon"}
          />
          <MenuItem name="History" route="/dashboard/history" icon={"icon"} />
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
