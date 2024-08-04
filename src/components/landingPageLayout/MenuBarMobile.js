import React from "react";
import Link from "next/link";
import { Bars3Icon } from "@heroicons/react/24/outline";
// import { FiMenu as Icon } from 'react-icons/fi'
// import { FaUser } from 'react-icons/fa'

// import logo from '@/img/logo.svg'

export default function MenuBarMobile({ setter }) {
  return (
    <nav className="md:hidden z-40 fixed top-0 left-0 h-[50px] bg-transparent flex [&>*]:my-auto px-2">
      <button
        className="flex"
        onClick={() => {
          setter((oldVal) => !oldVal);
        }}
      >
        <Bars3Icon className="size-7 p-[2px] text-gray-800/60 border-2 rounded-md border-gray-800/60" />
      </button>
    </nav>
  );
}
