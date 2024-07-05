import { ReactNode } from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DardiBook-Appointment",
  description: "Add new appointments of the patients",
};
export default function RootLayout({ children }: { children?: ReactNode }) {
  return <div className="px-4 sm:px-6 lg:px-8">{children}</div>;
}
