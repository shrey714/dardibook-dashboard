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
    <div className="mx-auto max-w-fill bg-background border-t">
      <div className="px-3 py-2 md:px-8 flex flex-col md:items-center md:flex-row gap-3 md:gap-8">
        <div className="flex flex-1 flex-row flex-wrap justify-center">
          {allPaths.map((path, key) => {
            return (
              <Link
                className="text-xs sm:text-sm text-muted-foreground font-medium leading-6 underline mr-3"
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
