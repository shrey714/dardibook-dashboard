import { ReactNode } from "react";
import type { Metadata } from "next";
import { NavigationDock } from "@/components/History/NavigationDock";
export const metadata: Metadata = {
  title: "DardiBook | History",
  description:
    "Organisation History of patients, registrations, prescriptions, admissions and bills",
};
export default async function RootLayout({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <>
      {children}
      <NavigationDock />
    </>
  );
}
