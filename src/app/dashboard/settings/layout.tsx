import { Metadata } from "next";
import { SettingSidebarNav } from "@/components/Settings/settings-sidebar-nav";
import Footer from "@/components/Settings/Footer";
import SettingsAccessWrapper from "@/components/Settings/SettingsAccessWrapper";

export const metadata: Metadata = {
  title: "DardiBook | Settings",
  description: "handle dardibook settings",
};

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="space-y-0.5 px-5 border-b py-4">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and clinic related settings.
        </p>
      </div>
      <SettingSidebarNav />
      <SettingsAccessWrapper>{children}</SettingsAccessWrapper>
      <Footer />
    </>
  );
}
