"use client";

import { useAuth } from "@clerk/nextjs";
import DiseaseInfo from "@/components/Settings/DiseaseInfo/DiseaseInfo";

export default function SettingsDiseaseInfoPage() {
  const { orgId } = useAuth();

  return (
    <div className="w-full py-2 sm:py-5 px-1 md:px-5">
      <DiseaseInfo uid={orgId} />
    </div>
  );
}
