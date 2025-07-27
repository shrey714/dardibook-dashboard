import { ReactNode } from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DardiBook | Medical",
  description: "Create new medical reports of the patients",
};
export default function RootLayout({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
