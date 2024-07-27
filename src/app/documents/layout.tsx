
import { ReactNode } from "react";
import HeaderDocument from "@/components/HeaderDocument";
import DocumentLinks from "@/components/DocumentLinks";
import Image from "next/image";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DardiBook-Dashboard",
  description: "App to help doctors to track their patient",
};

export default function RootLayout({ children }: { children?: ReactNode }) {
  return (
    <div className="pt-24">
      <Image
        src="/Logo.svg"
        fill={true}
        className="document-background-image"
        alt="logo"
      />
      <HeaderDocument />
      {children ? children : <DocumentLinks />}
    </div>
  );
};

