"use client";

import { useAuth } from "@clerk/nextjs";
import DiseaseInfo from "@/components/Settings/DiseaseInfo/DiseaseInfo";

export default function SettingsDiseaseInfoPage() {
  const { orgId } = useAuth();

  return <DiseaseInfo uid={orgId} />;
}
