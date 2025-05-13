import { Metadata } from "next";
import { SettingSidebarNav } from "@/components/Settings/settings-sidebar-nav";
import Footer from "@/components/Settings/Footer";

export const metadata: Metadata = {
  title: "DardiBook | Settings",
  description: "handle dardibook settings",
};

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/dashboard/settings",
    roles: [
      "org:clinic_head",
      "org:doctor",
      "org:assistant_doctor",
      "org:medical_staff",
    ],
  },
  {
    title: "Clinic",
    href: "/dashboard/settings/clinic",
    roles: ["org:clinic_head", "org:doctor"],
  },
  {
    title: "Subscription",
    href: "/dashboard/settings/subscription",
    roles: ["org:clinic_head"],
  },
  {
    title: "DiseaseInfo",
    href: "/dashboard/settings/diseaseinfo",
    roles: ["org:clinic_head", "org:doctor", "org:assistant_doctor"],
  },
  {
    title: "MedicineInfo",
    href: "/dashboard/settings/medicineinfo",
    roles: ["org:clinic_head", "org:doctor", "org:assistant_doctor"],
  },
];

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
      <SettingSidebarNav items={sidebarNavItems} />
      {children}
      <Footer />
    </>
  );
}
