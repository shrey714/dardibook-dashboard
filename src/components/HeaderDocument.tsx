import Link from "next/link";
import React from "react";
const HeaderDocument = () => {
  return (
    <nav className=" fixed w-full z-20 top-0 start-0 p-4">
      <div className="rounded-lg shadow-lg bg-gray-800 max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-2">
        <Link href={"/"} className="cursor-pointer flex items-center mr-3">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            DardiBook
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default HeaderDocument;
