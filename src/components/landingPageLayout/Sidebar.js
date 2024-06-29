import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

// import { SlHome } from "react-icons/sl";
// import { BsInfoSquare, BsEnvelopeAt } from "react-icons/bs";
// import { FaTshirt, FaRedhat } from "react-icons/fa";

// import logo from "@/img/logo.svg";

export default function Sidebar({ show, setter }) {
  const router = useRouter();
  const pathname = usePathname();
  // Define our base class
  const className =
    "bg-base-300 w-[250px] transition-[margin-left] ease-in-out duration-500 fixed md:static top-0 bottom-0 left-0 z-40";
  // Append class based on state of sidebar visiblity
  const appendClass = show ? " ml-0" : " ml-[-250px] md:ml-0";

  // Clickable menu items
  const MenuItem = ({ icon, name, route }) => {
    // Highlight menu item based on currently displayed route
    const colorClass =
      pathname === route
        ? "text-black bg-primary"
        : "text-black/50 hover:text-black";

    return (
      <button
        onClick={() => {
          router.push(route);
          setter((oldVal) => !oldVal);
        }}
        className={`font-bold border-2 border-primary text-md my-2 px-5 py-2 rounded-full mx-4  ${colorClass}`}
      >
        {name}
      </button>
    );
  };

  // Overlay to prevent clicks in background, also serves as our close button
  const ModalOverlay = () => (
    <div
      className={`flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30`}
      onClick={() => {
        setter((oldVal) => !oldVal);
      }}
    />
  );

  return (
    <>
      <div className={`${className}${appendClass}`}>
        <div className="p-2 flex">
          <Link href="/">
            {/*eslint-disable-next-line*/}
            {/* <img src={logo.src} alt="Company Logo" width={300} height={300} /> */}
          </Link>
        </div>
        <div className="flex flex-col">
          <MenuItem name="Home" route="/pages/home" icon={"icon"} />
          <MenuItem name="T-Shirts" route="/pages/t-shirts" icon={"icon"} />
          <MenuItem name="Hats" route="/pages/hats" icon={"icon"} />
          <MenuItem name="About Us" route="/pages/about" icon={"icon"} />
          <MenuItem name="Contact" route="/pages/contact" icon={"icon"} />
        </div>
      </div>
      {show ? <ModalOverlay /> : <></>}
    </>
  );
}
