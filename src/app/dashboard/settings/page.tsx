"use client";
import PersonalInfo from "@/components/Settings/PersonalInfo";
import { UserProfile } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function SettingsProfilePage() {
  const { resolvedTheme } = useTheme();
  return (
    <div className="w-full py-2 sm:py-5 px-2 md:px-5 2xl:flex 2xl:flex-row 2xl:gap-5 2xl:justify-center">
      <PersonalInfo />
      <UserProfile
        appearance={{
          elements: {
            rootBox:
              "mt-2 sm:mt-5 max-w-4xl 2xl:mt-0 mx-auto 2xl:mx-0 border rounded-lg w-full",
            cardBox:
              "rounded-md shadow-none max-w-full w-full",
          },
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
        }}
        routing="hash"
      />
    </div>
  );
}
