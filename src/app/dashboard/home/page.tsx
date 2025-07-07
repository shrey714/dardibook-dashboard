import { notFound } from "next/navigation";
import StatusCharts from "@/components/Home/StatusCharts";
import QuickLinks from "@/components/Home/QuickLinks";
import DoctorsPerformanceChart from "@/components/Home/DoctorsPerformanceChart";
import BedAppointmentsActivity from "@/components/Home/BedAppointmentsActivity";
import WeekSelector from "@/components/Home/WeekSelector";
import { DashboardDataTypes } from "@/types/FormTypes";
import { auth } from "@clerk/nextjs/server";
import { getDashboardData } from "@/lib/DashboardHelpers";

type PageProps = {
  searchParams: Promise<{ weekDate?: string }>;
};

export default async function Home({ searchParams }: PageProps) {
  const { weekDate } = await searchParams;
  const weekTimestamp = weekDate ? parseInt(weekDate, 10) : Date.now();

  if (isNaN(weekTimestamp)) {
    notFound();
  }

  const authInstance = await auth();
  if (!authInstance.orgRole || !authInstance.orgId) {
    return (
      <div className="w-full h-full text-muted-foreground text-sm md:text-base p-4 overflow-hidden flex items-center justify-center gap-4 flex-col">
        <img
          className="w-full max-w-40 lg:mx-auto"
          src="/ErrorTriangle.svg"
          alt="Error"
        />
        You are not authorized for this organization..
      </div>
    );
  }

  let dashboardData: DashboardDataTypes;
  try {
    dashboardData = await getDashboardData(authInstance.orgId, weekTimestamp);
  } catch (error) {
    console.error("Error loading dashboard:", error);
    return (
      <div className="w-full h-full text-muted-foreground text-sm md:text-base p-4 overflow-hidden flex items-center justify-center gap-4 flex-col">
        <img
          className="w-full max-w-40 lg:mx-auto"
          src="/ErrorTriangle.svg"
          alt="Error"
        />
        Failed to load dashboard data. Please try again later.
      </div>
    );
  }

  return (
    <div className="p-1 py-2 gap-2 sm:p-2 sm:py-3 sm:gap-3 md:p-3 flex flex-col">
      <div className="w-full flex flex-row gap-2 sm:gap-3 items-center justify-end">
        <WeekSelector />
      </div>
      <div className="grid auto-rows-auto grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6 lg:grid-cols-9">
        <StatusCharts StatusChartsData={dashboardData.compareStats} />
        <QuickLinks role={authInstance.orgRole} />
        <DoctorsPerformanceChart
          DoctorsPerformanceChartData={dashboardData.doctorWeeklyComparison}
        />
        <BedAppointmentsActivity
          patientsInBed={dashboardData.patientsInBed}
          upcomingAppointments={dashboardData.upcomingAppointments}
          recentActivities={dashboardData.recentActivities}
        />
      </div>
    </div>
  );
}
