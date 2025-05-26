"use client";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { WeeklyDoctorComparison } from "@/types/FormTypes";

const DoctorsPerformanceChart = ({
  DoctorsPerformanceChartData,
}: {
  DoctorsPerformanceChartData: WeeklyDoctorComparison;
}) => {
  return (
    <div className="col-span-3 md:col-span-6">
      <div className="border dark:border-0 shadow bg-muted/50 text-card-foreground rounded-lg h-full">
        <div className="flex flex-col space-y-1.5 p-6">
          <div className="leading-none font-semibold tracking-tight">
            {DoctorsPerformanceChartData.title}
          </div>
          <div className="text-muted-foreground text-sm">
            {DoctorsPerformanceChartData.desc}
          </div>
        </div>
        <div className="p-6 pt-0 h-[calc(100%-90px)] flex items-center">
          <LineCharStackedExample
            counts={DoctorsPerformanceChartData.dayCount}
          />
        </div>
      </div>
    </div>
  );
};

export default DoctorsPerformanceChart;

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

interface countsTypes {
  doctor: string;
  lastWeek: number;
  currentWeek: number;
}

function LineCharStackedExample({ counts }: { counts: countsTypes[] }) {
  return (
    <ChartContainer
      className="h-60 md:h-96 w-full"
      config={{
        lastWeek: {
          label: "Last Week",
          color: "hsl(var(--chart-1))",
        },
        currentWeek: {
          label: "Current Week",
          color: "hsl(var(--chart-2))",
        },
      }}
    >
      <BarChart accessibilityLayer data={counts}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="doctor"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="lastWeek"
          stackId="a"
          fill="var(--color-lastWeek)"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="currentWeek"
          stackId="a"
          fill="var(--color-currentWeek)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
