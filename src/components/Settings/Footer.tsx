import React from "react";
import Link from "next/link";
import { format } from "date-fns";

const Footer = () => {
  const allPaths = [
    "about-us",
    "cancellation-policy",
    "contact-us",
    "pricing",
    "privacy-policy",
    "terms-conditions",
  ];

  return (
    <footer className="border-t flex w-full flex-col lg:flex-row-reverse gap-y-1 gap-x-4 items-center justify-center my-1 px-2">
      <div className="flex flex-row flex-wrap justify-center">
        {allPaths.map((path, key) => (
          <Link
            className="text-xs text-muted-foreground font-medium underline mr-3 lg:leading-6"
            key={key}
            href={`https://www.dardibook.in/documents/${path}`}
            target="_blank"
          >
            {path
              .replace(/-/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase())}
          </Link>
        ))}
      </div>

      <p className="text-xs font-medium text-gray-500 text-center">
        © {format(new Date(), "yyyy")} dardibook.in. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
