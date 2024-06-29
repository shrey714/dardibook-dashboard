import React, { ReactNode } from "react";
import HeaderDocument from "../components/HeaderDocument";
import DocumentLinks from "../components/DocumentLinks";
import Image from "next/image";

interface props {
  children?: ReactNode;
}

const page: React.FC<props> = ({ children }) => {
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

export default page;
