import { ReactNode } from "react";
import DashboardWrapper from "@/components/wrapper/DashboardWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DardiBook | Dashboard",
  description: "App to help doctors to track their patient",
};
export default function RootLayout({ children }: { children?: ReactNode }) {
  return (
    <DashboardWrapper>
      {children}
    </DashboardWrapper>
  );
}
