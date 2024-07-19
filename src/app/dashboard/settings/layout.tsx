import { ReactNode } from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DardiBook-settings",
  description: "handle dardibook settings",
};
export default function RootLayout({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
