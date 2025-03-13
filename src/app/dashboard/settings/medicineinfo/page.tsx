"use client";

import MedicineInfo from "@/components/Settings/MedicineInfo/MedicineInfo";
import { useAuth } from "@clerk/nextjs";

export default function SettingsMedicineInfoPage() {
  const { orgId } = useAuth();

  return (
    <div className="w-full py-2 sm:py-5 px-1 md:px-5">
      <MedicineInfo uid={orgId} />
    </div>
  );
}
