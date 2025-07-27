import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DardiBook | Organizations",
  description:
    "Sign in to your DardiBook account to access your personalized healthcare management dashboard. Manage appointments, prescriptions, patient history, and more with ease. Continue your seamless healthcare experience with DardiBook.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
