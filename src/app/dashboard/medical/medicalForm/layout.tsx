import { ReactNode } from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DardiBook-Medical-form",
  description: "Add new prescriptions of the patients",
};
export default function RootLayout({ children }: { children?: ReactNode }) {
  return <div className="relative h-full overflow-hidden">{children}</div>;
}
