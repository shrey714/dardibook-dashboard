import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "DardiBook | Create-Organization",
  description:
    "Sign in to your DardiBook account to access your personalized healthcare management dashboard. Manage appointments, prescriptions, patient history, and more with ease. Continue your seamless healthcare experience with DardiBook.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if ((await auth()).orgId) {
    redirect("/");
  }

  return <>{children}</>;
}
