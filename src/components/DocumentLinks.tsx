"use client";
import React from "react";
import { useRouter } from "next/navigation";

const DocumentLinks = () => {
  const router = useRouter();
  const allPaths = [
    "about-us",
    "cancellation-policy",
    "contact-us",
    "pricing",
    "privacy-policy",
    "terms-conditions",
  ];
  return (
    <div
      className={`items-center justify-between mx-4 flex  md:flex md:w-auto md:order-1`}
    >
      <ul className="flex flex-1 flex-col p-4 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 rtl:space-x-reverse  dark:bg-gray-800 dark:border-gray-700">
        {allPaths.map((path, key) => {
          const colorClass =
            " text-gray-900 rounded hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white dark:border-gray-700";
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
      </ul>
    </div>
  );
};

export default DocumentLinks;
