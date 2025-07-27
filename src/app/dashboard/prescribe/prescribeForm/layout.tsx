import { ReactNode } from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DardiBook-prescription-form",
  description: "Add new prescriptions of the patients",
};
export default function RootLayout({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
