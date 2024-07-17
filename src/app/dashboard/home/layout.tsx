import { ReactNode } from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DardiBook",
  description: "Welcome to dardibook paltform",
};
export default function RootLayout({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
