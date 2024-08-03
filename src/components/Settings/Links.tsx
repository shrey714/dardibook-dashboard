import React from "react";
import Link from "next/link";

const Links = () => {
  const allPaths = [
    "about-us",
    "cancellation-policy",
    "contact-us",
    "pricing",
    "privacy-policy",
    "terms-conditions",
  ];
  return (
    <div className="mt-3 md:mt-6 mx-auto max-w-4xl bg-white rounded-lg">
      <div className="px-3 py-2 md:px-8">
        <h3 className="text-sm sm:text-base font-semibold leading-7 text-gray-900 tracking-wide">
          Links
        </h3>
      </div>
      <div className="border-t-4 md:border-t-[6px] border-gray-300 px-3 py-2 md:px-8 flex flex-col md:items-center md:flex-row gap-3 md:gap-8">
        <div className="flex flex-1 flex-row flex-wrap">
          {allPaths.map((path, key) => {
            return (
              <Link
                className="text-xs sm:text-sm font-medium leading-6 underline text-gray-500 mr-3"
                key={key}
                href={`https://www.dardibook.in/documents/${path}`}
                target="_blank"
              >
                {path}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Links;
