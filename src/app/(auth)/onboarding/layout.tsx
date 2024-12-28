import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "DardiBook | Onboarding",
  description:
    "Sign in to your DardiBook account to access your personalized healthcare management dashboard. Manage appointments, prescriptions, patient history, and more with ease. Continue your seamless healthcare experience with DardiBook.",
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if a user has completed onboarding
  // If yes, redirect them to /dashboard
  if ((await auth()).sessionClaims?.metadata?.onboardingComplete === true) {
    redirect("/");
  }

  return <>{children}</>;
}
