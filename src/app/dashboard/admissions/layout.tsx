import { ReactNode } from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DardiBook | Admissions",
  description: "Admit and discharge patients",
};
export default function RootLayout({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
