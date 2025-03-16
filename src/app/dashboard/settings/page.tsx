"use client";
import PersonalInfo from "@/components/Settings/PersonalInfo";
import { useAuth, UserProfile, useUser } from "@clerk/nextjs";

export default function SettingsProfilePage() {
  const { user } = useUser();
  const { orgRole } = useAuth();
  return (
    <div className="w-full py-2 sm:py-5 px-2 md:px-5 2xl:flex 2xl:flex-row 2xl:gap-5 2xl:justify-center">
      <PersonalInfo userInfo={user} role={orgRole} />
      <UserProfile
        appearance={{
          elements: {
            rootBox:
              "mt-2 sm:mt-5 max-w-4xl 2xl:mt-0 mx-auto 2xl:mx-0 border rounded-lg w-full",
            cardBox:
              "bg-muted/30 dark:bg-gray-300 rounded-md shadow-none max-w-full w-full",
          },
        }}
        routing="hash"
      />
    </div>
  );
}
