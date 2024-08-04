import { ReactNode } from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DardiBook | Appointment",
  description: "Add new appointments of the patients",
};
export default function RootLayout({ children }: { children?: ReactNode }) {
  return <div>{children}</div>;
}
