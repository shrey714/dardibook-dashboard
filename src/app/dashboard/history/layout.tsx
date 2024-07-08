import { ReactNode } from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DardiBook-History",
  description: "Previous patients history",
};
export default function RootLayout({ children }: { children?: ReactNode }) {
  return <div className="px-0">{children}</div>;
}
