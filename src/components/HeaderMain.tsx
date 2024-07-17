"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signOutUser } from "@/firebase/firebaseAuth";
import { useAppDispatch } from "@/redux/store";
const HeaderMain = ({ user }: any) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const allPaths = [
    "about-us",
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
      <div className="rounded-2xl shadow-lg bg-gray-900 max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a
          onClick={() => {
            router.push("/");
          }}
          className="cursor-pointer flex items-center ml-4 mr-3"
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
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {/* user menu */}
          <div className="dropdown dropdown-bottom dropdown-end">
            <button
              type="button"
              className="flex m-1 text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              tabIndex={0}
              role="button"
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src={user?.photoURL}
                alt="user photo"
              />
            </button>
            {/* <!-- Dropdown menu --> */}
            <div
              tabIndex={0}
              className="dropdown-content menu w-52 p-2 z-50 my-1 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
              id="user-dropdown"
            >
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  {user?.displayName}
                </span>
                <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                  {user?.email}
                </span>
              </div>
              <ul className="py-2" aria-labelledby="user-menu-button">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      signOutUser(dispatch);
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* ========= */}
          <button
            onClick={handleMenuToggle}
            type="button"
            className="h-10 inline-flex items-center p-2 w-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
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
          } w-full`}
          id="navbar-sticky"
        >
          <ul className="flex flex-1 flex-col p-4  mt-4 font-medium border rounded-lg bg-gray-800 border-gray-700">
            <li >
              <a
                onClick={() => {
                  router.push(`/documents/helllo`);
                }}
                className={`cursor-pointer block py-2 px-3 rounded text-white hover:bg-gray-700 hover:text-white border-gray-700`}
                aria-current="page"
              >
                Home
              </a>
            </li>
            <div className="collapse collapse-arrow  text-white ">
              <input type="checkbox" name="my-accordion-2" />
              <div className="collapse-title px-3 text-base font-medium">
                Documents
              </div>
              <div className="collapse-content">
                {allPaths.map((path, key) => {
                  const colorClass =
                    pathname === `/documents/${path}`
                      ? " text-white bg-blue-700 rounded"
                      : " rounded text-white hover:bg-gray-700 hover:text-white border-gray-700";
                  return (
                    <li key={key}>
                      <a
                        onClick={() => {
                          router.push(`/documents/${path}`);
                        }}
                        className={`cursor-pointer block py-2 px-3 ${colorClass}`}
                        aria-current="page"
                      >
                        {path.charAt(0).toUpperCase() + path.slice(1)}
                      </a>
                    </li>
                  );
                })}
              </div>
            </div>
            <li >
              <a
                onClick={() => {
                  router.push(`/documents/helllo`);
                }}
                className={`cursor-pointer block py-2 px-3 rounded text-white hover:bg-gray-700 hover:text-white border-gray-700`}
                aria-current="page"
              >
                Setting
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default HeaderMain;
