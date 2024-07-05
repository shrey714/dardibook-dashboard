import { ReactNode } from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DardiBook-Prescribe",
  description: "Create new prescription of the patients",
};
export default function RootLayout({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
