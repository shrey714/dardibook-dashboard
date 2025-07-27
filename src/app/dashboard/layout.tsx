import { ReactNode } from "react";
import DashboardWrapper from "@/components/wrapper/DashboardWrapper";
import type { Metadata } from "next";
import { RefProvider } from "@/hooks/RefContext";
import { TodayPatientsProvider } from "@/lib/providers/todayPatientsProvider";
import PatientHistoryGlobalModal from "@/components/common/PatientHistoryGlobalModal";
import InitializeZustandStore from "@/components/InitializeZustandStore";

export const metadata: Metadata = {
  title: "DardiBook | Dashboard",
  description: "App to help doctors to track their patient",
};
export default function RootLayout({ children }: { children?: ReactNode }) {
  return (
    <RefProvider>
      <DashboardWrapper>
        <TodayPatientsProvider>
          <InitializeZustandStore />
          <PatientHistoryGlobalModal />
          {children}
        </TodayPatientsProvider>
      </DashboardWrapper>
    </RefProvider>
  );
}
