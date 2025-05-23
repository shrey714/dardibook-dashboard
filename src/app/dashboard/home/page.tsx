"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Info, TableCellsMergeIcon, TrendingUpIcon } from "lucide-react";
import { Line, LineChart } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
// import Temp from "./temp";
const IconMapping = [
  UserPlusIcon,
  CalendarIcon,
  ClipboardIcon,
  ActivityIcon,
  PillIcon,
  BarChartIcon,
];
const ColorMapping = [
  "bg-gradient-to-t from-purple-500/20 to-purple-500/10",
  "bg-gradient-to-t from-primary/20 to-primary/10",
  "bg-gradient-to-t from-blue-500/20 to-blue-500/10",
  "bg-gradient-to-t from-lime-500/20 to-lime-500/10",
  "bg-gradient-to-t from-orange-500/20 to-orange-500/10",
  "bg-gradient-to-t from-amber-500/20 to-amber-500/10",
];
const Home = () => {
  return (
    <div className=" bg- p-2 flex flex-col sm:p-3 gap-2 sm:gap-3">
      <div className="w-full flex flex-col gap-2 sm:gap-3 items-end justify-center">
        <Button variant="outline" size="icon" className="relative">
          <BellIcon className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
            3
          </span>
        </Button>
      </div>
      <NewStatusGrid />
    </div>
  );
};

export default Home;

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
const NewStatusGrid = () => {
  return (
    <div className="grid auto-rows-auto grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6 lg:grid-cols-9">
      {/* small--charts--start */}
      {[1, 2, 3].map((ele) => (
        <div
          key={ele}
          className="text-card-foreground hidden md:block rounded-lg shadow-sm border dark:border-0 col-span-3 h-full lg:col-span-2 xl:col-span-2 bg-gradient-to-b from-muted to-muted/50"
        >
          <div className="p-6 flex flex-row items-center justify-between gap-5 space-y-0 pt-4 pb-2">
            <div className="tracking-tight flex items-center gap-2 truncate text-sm font-medium">
              <TableCellsMergeIcon /> New Subscriptions
            </div>
            <Button variant="ghost" size="icon" className="p-0 size-auto">
              <Info />
            </Button>
          </div>
          <div className="p-6 flex h-[calc(100%-48px)] flex-col justify-between py-4">
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="text-3xl font-bold">4,682</div>
                <LineChartExample />
              </div>
              <p className="text-muted-foreground text-xs">Since Last week</p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div className="text-sm font-semibold">Details</div>
              <div className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400">
                <p className="text-[13px] leading-none font-medium">15.54%</p>
                <TrendingUpIcon />
              </div>
            </div>
          </div>
        </div>
      ))}

      <div className="col-span-3 hidden md:block">
        <div className="text-card-foreground rounded-lg shadow-sm border dark:border-0 h-full bg-gradient-to-b from-muted to-muted/50">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="tracking-tight text-sm font-normal">
              Total Revenue
            </div>
          </div>
          <div className="p-6 pt-0 h-[calc(100%-52px)] pb-0">
            <div className="text-2xl font-bold">$15,231.89</div>
            <p className="text-muted-foreground text-xs">
              +20.1% from last month
            </p>
            <LineChartWithDotsExample />
          </div>
        </div>
      </div>

      <div className="col-span-3 flex md:hidden items-center justify-center">
        <Carousel
          className="w-full"
          opts={{
            loop: true,
            slidesToScroll: 1,
          }}
        >
          <CarouselContent className="m-0">
            {[1, 2, 3].map((ele) => (
              <CarouselItem
                key={ele}
                className={`basis-[90%] sm:basis-[80%] px-1 sm:px-1.5`}
              >
                <div className="text-card-foreground rounded-lg shadow-sm border dark:border-0 col-span-3 h-full lg:col-span-2 xl:col-span-2 bg-gradient-to-b from-muted to-muted/50">
                  <div className="p-6 flex flex-row items-center justify-between gap-5 space-y-0 pt-4 pb-2">
                    <div className="tracking-tight flex items-center gap-2 truncate text-sm font-medium">
                      <TableCellsMergeIcon /> New Subscriptions
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-0 size-auto"
                    >
                      <Info />
                    </Button>
                  </div>
                  <div className="p-6 flex h-[calc(100%-48px)] flex-col justify-between py-4">
                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-center justify-between gap-6">
                        <div className="text-3xl font-bold">4,682</div>
                        <LineChartExample />
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Since Last week
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-5">
                      <div className="text-sm font-semibold">Details</div>
                      <div className="flex items-center gap-1 text-emerald-500 dark:text-emerald-400">
                        <p className="text-[13px] leading-none font-medium">
                          15.54%
                        </p>
                        <TrendingUpIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}

            <CarouselItem
              className={`basis-[80%] px-1 sm:px-1.5`}
            >
              <div className="text-card-foreground rounded-lg shadow-sm border dark:border-0 h-full bg-gradient-to-b from-muted to-muted/50">
                <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="tracking-tight text-sm font-normal">
                    Total Revenue
                  </div>
                </div>
                <div className="p-6 pt-0 h-[calc(100%-52px)] pb-0">
                  <div className="text-2xl font-bold">$15,231.89</div>
                  <p className="text-muted-foreground text-xs">
                    +20.1% from last month
                  </p>
                  <LineChartWithDotsExample />
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>

      {/* small--charts--end */}

      {/* coursel--start */}
      <div className="col-span-3 flex md:hidden items-center justify-center">
        <Carousel
          className="w-full"
          opts={{
            loop: true,
            slidesToScroll: 2,
          }}
        >
          <CarouselContent className="m-0">
            {[
              "Register Patient",
              "Appointments",
              "Prescriptions",
              "Lab Results",
              "Pharmacy",
              "Reports",
            ].map((item, index) => {
              return (
                <CarouselItem
                  key={index}
                  className={`basis-[40%] sm:basis-[32%] px-1 sm:px-1.5`}
                >
                  <PageSlider index={index} item={item} />
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="hidden md:grid col-span-3 md:col-span-6 lg:col-span-3 grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3">
        {[
          "Register Patient",
          "Appointments",
          "Prescriptions",
          "Lab Results",
          "Pharmacy",
          "Reports",
        ].map((item, index) => {
          return <PageSlider key={index} index={index} item={item} />;
        })}
      </div>
      {/* coursel--end */}

      <div className="col-span-3 md:col-span-6">
        <div className="border dark:border-0 shadow bg-muted/50 text-card-foreground rounded-lg h-full">
          <div className="flex flex-col space-y-1.5 p-6">
            <div className="leading-none font-semibold tracking-tight">
              Sale Activity - Monthly
            </div>
            <div className="text-muted-foreground text-sm">
              Showing total sales for the last 6 months
            </div>
          </div>
          <div className="p-6 pt-0 h-[calc(100%-90px)] flex items-center">
            <LineCharStackedExample />
          </div>
        </div>
      </div>

      <Card className="border dark:border-0 bg-muted/50 rounded-lg col-span-3 md:col-span-6 lg:col-span-3">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your clinic</CardDescription>
        </CardHeader>
        <CardContent className="overflow-y-auto space-y-2 h-60 md:h-72 lg:h-[370px] px-0">
          {mockNotifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <div className="flex items-start gap-4 px-2">
                <div
                  className={`rounded-full p-2
                          ${
                            notification.type === "Alert"
                              ? "bg-red-500/10 text-red-500"
                              : notification.type === "Info"
                              ? "bg-blue-500/10 text-blue-500"
                              : notification.type === "Success"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}
                >
                  <AlertCircleIcon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{notification.title}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(notification.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {notification.id !==
                mockNotifications[mockNotifications.length - 1].id && (
                <Separator />
              )}
            </React.Fragment>
          ))}
        </CardContent>
        <CardFooter className="border-t p-4">
          <Button variant="ghost" size="sm" className="w-full gap-2">
            <ArrowRightIcon className="h-4 w-4" />
            View All Notifications
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const PageSlider = ({ index, item }: { index: number; item: string }) => {
  const Icon = IconMapping[index];
  return (
    <div
      className={`${ColorMapping[index]} col-span-1 flex flex-col items-center justify-center p-4 sm:p-5 hover:bg-accent/20 border dark:border-0 transition-colors cursor-pointer rounded-lg text-card-foreground shadow`}
    >
      <div className="rounded-full p-3 bg-primary/10 mb-2">
        <Icon className="h-6 w-6 text-ring" />
      </div>
      <h3 className="font-medium text-ring text-center line-clamp-1 text-sm sm:text-base">
        {item}
      </h3>
    </div>
  );
};

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  ClipboardIcon,
  UserPlusIcon,
  AlertCircleIcon,
  ArrowRightIcon,
  ActivityIcon,
  PillIcon,
  BarChartIcon,
  BellIcon,
} from "lucide-react";

const mockNotifications = [
  {
    id: "notif-001",
    type: "Alert",
    title: "Medication Stock Alert",
    message: "Insulin supplies are running low. Please reorder.",
    timestamp: "2025-05-20T14:15:00Z",
    read: false,
  },
  {
    id: "notif-002",
    type: "Info",
    title: "Staff Meeting Reminder",
    message: "Weekly staff meeting today at 4:00 PM in Conference Room A.",
    timestamp: "2025-05-20T12:30:00Z",
    read: false,
  },
  {
    id: "notif-003",
    type: "Success",
    title: "New Health Guidelines Available",
    message: "Updated COVID-19 protocols have been published.",
    timestamp: "2025-05-19T16:45:00Z",
    read: true,
  },
  {
    id: "notif-004",
    type: "Warning",
    title: "System Maintenance",
    message:
      "Scheduled system maintenance on May 22, 2025 from 2:00 AM to 4:00 AM.",
    timestamp: "2025-05-18T09:20:00Z",
    read: true,
  },
];

const data = [
  { value: 15.875 },
  { value: 6.359 },
  { value: 12.522 },
  { value: 27.384 },
  { value: 15.059 },
  { value: 33.094 },
  { value: 14.606 },
];

export function LineChartExample() {
  return (
    <ChartContainer
      className="w-[70px]"
      config={{
        month: {
          // Using the color variable from the original chart
          theme: {
            light: "hsl(var(--chart-1))",
            dark: "hsl(var(--chart-1))",
          },
        },
      }}
    >
      <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
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

const data2 = [
  { value: 52.143 },
  { value: 41.415 },
  { value: 54.821 },
  { value: 58.036 },
  { value: 61.25 },
  { value: 54.286 },
  { value: 49.882 },
  { value: 9.085 },
];

export function LineChartWithDotsExample() {
  return (
    <ChartContainer
      className="h-[80px] w-full"
      config={{
        revenue: {
          // Using the color variable from the original chart
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
        data={data2}
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

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

function LineCharStackedExample() {
  return (
    <ChartContainer className="h-60 md:h-96 w-full" config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="desktop"
          stackId="a"
          fill="var(--color-desktop)"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="mobile"
          stackId="a"
          fill="var(--color-mobile)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
