"use client";

import MedicineInfo from "@/components/Settings/MedicineInfo/MedicineInfo";
import { useAuth } from "@clerk/nextjs";

export default function SettingsMedicineInfoPage() {
  const { orgId } = useAuth();

  return <MedicineInfo uid={orgId} />;
}
