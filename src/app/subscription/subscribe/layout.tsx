import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DardiBook | Subscription",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
