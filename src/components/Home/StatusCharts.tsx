"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  CalendarClockIcon,
  Info,
  ReceiptTextIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UserPlusIcon,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Line, LineChart } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { StatComparison } from "@/types/FormTypes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatusChartsDataTypes {
  newPatients: StatComparison;
  totalAppointments: StatComparison;
  totalBills: StatComparison;
  totalRevenue: StatComparison;
}

const iconMap = [UserPlusIcon, CalendarClockIcon, ReceiptTextIcon];
const StatusCharts = ({
  StatusChartsData,
}: {
  StatusChartsData: StatusChartsDataTypes;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <TooltipProvider>
      {isDesktop ? (
        <>
          {[
            StatusChartsData.newPatients,
            StatusChartsData.totalAppointments,
            StatusChartsData.totalBills,
          ].map((status, index) => {
            const Icon = iconMap[index];
            return (
              <div
                key={index}
                className="text-card-foreground rounded-lg shadow-sm border dark:border-0 col-span-3 h-full lg:col-span-2 xl:col-span-2 bg-gradient-to-b from-muted to-muted/50"
              >
                <div className="p-6 flex flex-row items-center justify-between gap-5 space-y-0 pt-4 pb-2">
                  <div className="tracking-tight flex items-center gap-2 truncate text-sm font-medium leading-none">
                    <Icon className="size-5" /> {status.title}
                  </div>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="p-0 size-auto"
                      >
                        <Info className="text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{status.info}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="p-6 flex h-[calc(100%-48px)] flex-col justify-between pt-4 pb-1">
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="text-3xl font-bold">{status.count}</div>
                      <LineChartExample dayCount={status.dayCount} />
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Current week
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-5">
                    <div
                      className={`flex items-center gap-1 ${
                        status.status === "increase"
                          ? "text-emerald-500 dark:text-emerald-400"
                          : "text-red-500 dark:text-red-400"
                      }`}
                    >
                      <p className="text-[13px] leading-none font-medium">
                        {status.percentage}%
                      </p>
                      {status.status === "increase" ? (
                        <TrendingUpIcon />
                      ) : (
                        <TrendingDownIcon />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="col-span-3">
            <div className="text-card-foreground rounded-lg shadow-sm border dark:border-0 h-full bg-gradient-to-b from-muted to-muted/50">
              <div className="p-6 flex flex-row items-center justify-between space-y-0 pt-4 pb-2">
                <div className="tracking-tight text-sm font-medium">
                  {StatusChartsData.totalRevenue.title}
                </div>
              </div>
              <div className="p-6 pt-0 h-[calc(100%-52px)] pb-0">
                <div className="text-2xl font-bold">
                  ₹{StatusChartsData.totalRevenue.count}
                </div>
                <p className="text-muted-foreground text-xs">
                  {StatusChartsData.totalRevenue.status === "increase"
                    ? "+"
                    : "-"}{" "}
                  {StatusChartsData.totalRevenue.percentage}% from last week
                </p>
                <LineChartWithDotsExample
                  dayCount={StatusChartsData.totalRevenue.dayCount}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="col-span-3 flex items-center justify-center">
          <Carousel
            className="w-full"
            opts={{
              loop: true,
              slidesToScroll: 1,
            }}
          >
            <CarouselContent className="m-0">
              {[
                StatusChartsData.newPatients,
                StatusChartsData.totalAppointments,
                StatusChartsData.totalBills,
              ].map((status, index) => {
                const Icon = iconMap[index];
                return (
                  <CarouselItem
                    key={index}
                    className={`basis-[90%] sm:basis-[80%] px-1 sm:px-1.5`}
                  >
                    <div className="text-card-foreground rounded-lg shadow-sm border dark:border-0 col-span-3 h-full lg:col-span-2 xl:col-span-2 bg-gradient-to-b from-muted to-muted/50">
                      <div className="p-6 flex flex-row items-center justify-between gap-5 space-y-0 pt-4 pb-2">
                        <div className="tracking-tight flex items-center gap-2 truncate text-sm font-medium leading-none">
                          <Icon className="size-5" /> {status.title}
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="p-0 size-auto"
                            >
                              <Info className="text-muted-foreground" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{status.info}</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <div className="p-6 flex h-[calc(100%-48px)] flex-col justify-between pt-4 pb-1">
                        <div className="flex flex-col">
                          <div className="flex flex-wrap items-center justify-between gap-6">
                            <div className="text-3xl font-bold">
                              {status.count}
                            </div>
                            <LineChartExample dayCount={status.dayCount} />
                          </div>
                          <p className="text-muted-foreground text-xs">
                            Current week
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-end gap-5">
                          <div
                            className={`flex items-center gap-1 ${
                              status.status === "increase"
                                ? "text-emerald-500 dark:text-emerald-400"
                                : "text-red-500 dark:text-red-400"
                            }`}
                          >
                            <p className="text-[13px] leading-none font-medium">
                              {status.percentage}%
                            </p>
                            {status.status === "increase" ? (
                              <TrendingUpIcon />
                            ) : (
                              <TrendingDownIcon />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}

              <CarouselItem className={`basis-[80%] px-1 sm:px-1.5`}>
                <div className="text-card-foreground rounded-lg shadow-sm border dark:border-0 h-full bg-gradient-to-b from-muted to-muted/50">
                  <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                    <div className="tracking-tight text-sm font-normal">
                      {StatusChartsData.totalRevenue.title}
                    </div>
                  </div>
                  <div className="p-6 pt-0 h-[calc(100%-52px)] pb-0">
                    <div className="text-2xl font-bold">
                      ₹{StatusChartsData.totalRevenue.count}
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {StatusChartsData.totalRevenue.status === "increase"
                        ? "+"
                        : "-"}{" "}
                      {StatusChartsData.totalRevenue.percentage}% from last week
                    </p>
                    <LineChartWithDotsExample
                      dayCount={StatusChartsData.totalRevenue.dayCount}
                    />
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </TooltipProvider>
  );
};

export default StatusCharts;

function LineChartExample({ dayCount }: { dayCount: number[] }) {
  const chartData = dayCount.map((value) => ({ value }));

  return (
    <ChartContainer
      className="w-[70px]"
      config={{
        month: {
          theme: {
            light: "hsl(var(--chart-1))",
            dark: "hsl(var(--chart-1))",
          },
        },
      }}
    >
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
      >
        <Line
          type="monotone"
          dataKey="value"
          name="month"
          strokeWidth={1.5}
          stroke="var(--color-month)"
          strokeDasharray="100.97642517089844px 0px"
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

function LineChartWithDotsExample({ dayCount }: { dayCount: number[] }) {
  const chartData = dayCount.map((value) => ({ value }));

  return (
    <ChartContainer
      className="h-[80px] py-[10px] w-full"
      config={{
        revenue: {
          theme: {
            light: "hsl(var(--primary))",
            dark: "hsl(var(--primary))",
          },
        },
        subscription: {
          theme: {
            light: "hsl(var(--primary))",
            dark: "hsl(var(--primary))",
          },
        },
      }}
    >
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 10, bottom: 0, left: 10 }}
      >
        <Line
          type="monotone"
          dataKey="value"
          name="revenue"
          strokeWidth={2}
          stroke="var(--color-revenue)"
          dot={{
            r: 3,
            strokeWidth: 2,
            stroke: "var(--color-revenue)",
            fill: "#fff",
          }}
        />
      </LineChart>
    </ChartContainer>
  );
}
