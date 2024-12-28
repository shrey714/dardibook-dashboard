"use client";

import React, { useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "../ui/button";
import { startOfMonth, endOfMonth, getTime, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { getAllPatients } from "@/app/services/getAllPatients";
import Loader from "../common/Loader";
import { useAuth } from "@clerk/nextjs";
export const description = "An interactive bar chart";

const chartConfig = {
  views: {
    label: "Patients Prescribed",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const PatientsPerDayChart = () => {
  const { isLoaded, orgId } = useAuth();
  const [chartData, setChartData] = useState<any>();
  const [loader, setLoader] = useState(true);
  const [patientsCollection, setpatientsCollection] = useState([]);
  // ===================
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });
  // ========================
  useEffect(() => {
    const fetchPatients = async () => {
      if (isLoaded && orgId) {
        try {
          setLoader(true);
          const data = await getAllPatients(
            orgId,
            getTime(date?.from || 0),
            getTime(date?.to || 0)
          );
          if (data.data) {
            setLoader(false);
            setpatientsCollection(data.data);
          } else {
            setpatientsCollection([]);
          }
        } catch (error){
          console.log(error);
          setpatientsCollection([]);
          setLoader(false);
        }
      }
    };

    fetchPatients();
  }, [isLoaded, date, orgId]);

  const fetchPatientVisitData = () => {
    const fromDate = getTime(date?.from || 0);
    const toDate = getTime(date?.to || 0);
    const visitCounts: any = {};

    patientsCollection.forEach((patient: any) => {
      const visit_dates = patient.visitedDates || [patient.last_visited];
      visit_dates.forEach((visitDate: number) => {
        if (visitDate >= fromDate && visitDate <= toDate) {
          const formattedDate = format(new Date(visitDate), "yyyy-MM-dd");
          visitCounts[formattedDate] = (visitCounts[formattedDate] || 0) + 1;
        }
      });
    });
    const visitData = Object.entries(visitCounts).map(([date, count]) => ({
      date,
      count,
    }));
    setChartData(visitData);
  };

  useEffect(() => {
    fetchPatientVisitData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientsCollection]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col gap-4 items-stretch space-y-0 border-b p-0 sm:flex-row sm:py-6 px-6 py-5">
        <div className="flex flex-1 flex-col justify-center gap-1">
          <CardTitle>Patients Per Day</CardTitle>
          <CardDescription>
            Showing total patients for the selected month
          </CardDescription>
        </div>
        <div className={"flex flex-1 items-center justify-end z-10"}>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {date?.from ? (
                  date.to ? (
                    <>
                      {format(date.from, "LLL dd, y")} -{" "}
                      {format(date.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                min={2}
                mode="range"
                className="bg-background border-[1px] rounded-md mt-1"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          {loader ? (
            <div className="flex h-full flex-1 items-center justify-center">
              <Loader size="medium" />
            </div>
          ) : (
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Bar dataKey={"count"} fill={`hsl(var(--chart-1))`} />
            </BarChart>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PatientsPerDayChart;
