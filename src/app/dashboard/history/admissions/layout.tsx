import { ReactNode } from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DardiBook | Admissions",
  description: "Previous admissions history",
};
export default async function RootLayout({
  children,
}: {
  children?: ReactNode;
}) {
  return <>{children}</>;
}
