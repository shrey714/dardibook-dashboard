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
    <div className="mt-3 md:mt-6 mx-auto max-w-4xl bg-gradient-to-b from-muted/50 to-muted border-2 rounded-lg">
      <div className="px-3 py-2 md:px-8">
        <h3 className="text-sm sm:text-base font-medium leading-7 tracking-wide">
          Links
        </h3>
      </div>
      <div className="border-t-2 border-border px-3 py-2 md:px-8 flex flex-col md:items-center md:flex-row gap-3 md:gap-8">
        <div className="flex flex-1 flex-row flex-wrap">
          {allPaths.map((path, key) => {
            return (
              <Link
                className="text-xs sm:text-sm font-medium leading-6 underline mr-3"
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
