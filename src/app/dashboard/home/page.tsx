import { notFound } from "next/navigation";
import StatusCharts from "@/components/Home/StatusCharts";
import QuickLinks from "@/components/Home/QuickLinks";
import DoctorsPerformanceChart from "@/components/Home/DoctorsPerformanceChart";
import BedAppointmentsActivity from "@/components/Home/BedAppointmentsActivity";
import WeekSelector from "@/components/Home/WeekSelector";
import { DashboardDataTypes } from "@/types/FormTypes";
import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";

type PageProps = {
  searchParams: Promise<{ weekDate?: string }>;
};

export default async function Home({ searchParams }: PageProps) {
  const { weekDate } = await searchParams;
  const weekTimestamp = weekDate ? parseInt(weekDate, 10) : Date.now();
  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const host = headersList.get("host") || "";
  const baseUrl = `${protocol}://${host}`;

  const authInstance = await auth();
  if (!authInstance.orgRole) {
    return (
      <div className="p-4 text-center text-red-500">
        You are not authorized for this organization..
      </div>
    );
  }

  if (isNaN(weekTimestamp)) {
    notFound();
  }

  let dashboardData: DashboardDataTypes;
  try {
    const res = await fetch(
      `${baseUrl}/api/dashboard-data?weekDate=${weekTimestamp}`,
      {
        method: "GET",
        headers: {
          "x-user-timezone": Intl.DateTimeFormat().resolvedOptions().timeZone,
          cookie: headersList.get("cookie") || "",
        },
        cache: "no-store",
      }
    );
    console.log("client-time-zone==", Intl.DateTimeFormat().resolvedOptions().timeZone);
    if (!res.ok) {
      throw new Error("Failed to fetch dashboard data");
    }
    const data = await res.json();
    dashboardData = data.data;
  } catch (error) {
    console.error("Error loading dashboard:", error);
    return (
      <div className="p-4 text-center text-red-500">
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
