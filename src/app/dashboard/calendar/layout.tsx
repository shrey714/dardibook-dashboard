import { ReactNode } from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DardiBook | Calendar",
  description: "Calendar page contains registered and prescribed appointments",
};
export default function RootLayout({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
