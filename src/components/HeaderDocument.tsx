"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
const HeaderDocument = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const allPaths = [
    "cancellation-policy",
    "contact-us",
    "pricing",
    "privacy-policy",
    "terms-conditions",
  ];
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className=" fixed w-full z-20 top-0 start-0 p-4">
      <div className="rounded-lg shadow-lg bg-gray-800 max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-2">
        <a
          onClick={() => {
            router.push("/");
          }}
          className="cursor-pointer flex items-center mr-3"
        >
          {/* <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="Flowbite Logo"
          /> */}
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            DardiBook
          </span>
        </a>
        <div className="flex md:hidden items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            onClick={handleMenuToggle}
            type="button"
            className="h-10 inline-flex items-center p-2 w-10 justify-center text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>
        <div
          className={`items-center justify-between ${
            menuOpen ? "flex" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-sticky"
        >
          <ul className="flex flex-1 flex-col p-4 md:p-0 mt-4 font-medium border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0  border-gray-700">
            {allPaths.map((path, key) => {
              const colorClass =
                pathname === `/documents/${path}`
                  ? " text-white bg-blue-700 rounded md:bg-transparent md:p-0 md:text-blue-500"
                  : " rounded md:hover:bg-transparent md:p-0 md:hover:text-blue-500 text-white hover:bg-gray-700 border-gray-700";
              return (
                <li key={key}>
                  <a
                    onClick={() => {
                      router.push(`/documents/${path}`);
                      setMenuOpen(!menuOpen);
                    }}
                    className={`cursor-pointer block py-2 px-3 text-sm ${colorClass}`}
                    aria-current="page"
                  >
                    {path.charAt(0).toUpperCase() + path.slice(1)}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default HeaderDocument;
