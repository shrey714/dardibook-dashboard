import { ReactNode } from "react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "DardiBook | Sign In",
  description: "Sign in to your DardiBook account to access your personalized healthcare management dashboard. Manage appointments, prescriptions, patient history, and more with ease. Continue your seamless healthcare experience with DardiBook.",
};

export default function RootLayout({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
