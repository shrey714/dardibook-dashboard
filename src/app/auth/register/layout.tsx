import { ReactNode } from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DardiBook | Register",
  description: "Join DardiBook, the comprehensive healthcare management platform, designed to streamline your medical processes. Register now to access appointment scheduling, prescription management, patient history tracking, and more. Simplify healthcare management with DardiBook.",
};
export default function RootLayout({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
