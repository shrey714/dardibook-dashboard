import { ReactNode } from "react";
import DashboardWrapper from "@/components/wrapper/DashboardWrapper";
import type { Metadata } from "next";
// import NextBreadcrumb from "@/components/common/NextBreadcrumb";

export const metadata: Metadata = {
  title: "DardiBook-Dashboard",
  description: "App to help doctors to track their patient",
};
export default function RootLayout({ children }: { children?: ReactNode }) {
  return (
    <DashboardWrapper>
       {/* <NextBreadcrumb
        homeElement={"DardiBook"}
        separator={<span> &gt; </span>}
        activeClasses="text-gray-500"
        containerClasses="flex py-1 fixed bg-[#e5e6e6]"
        listClasses="hover:underline mx-2 font-bold"
        capitalizeLinks
      />  */}
      {children}
    </DashboardWrapper>
  );
}
