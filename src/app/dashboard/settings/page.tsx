"use client";
import PersonalInfo from "@/components/Settings/PersonalInfo";
import { useAuth, UserProfile, useUser } from "@clerk/nextjs";

export default function SettingsProfilePage() {
  const { user } = useUser();
  const { orgRole } = useAuth();
  return (
    <>
      <PersonalInfo userInfo={user} role={orgRole} />
      <UserProfile
        appearance={{
          elements: {
            rootBox: "mx-auto mt-5 max-w-4xl border-2 rounded-lg",
            cardBox: "bg-muted/30 dark:bg-gray-300 rounded-md shadow-none",
            navbar: {
              background: "none",
            },
            scrollBox: { background: "none" },
          },
        }}
        routing="hash"
      />
    </>
  );
}
