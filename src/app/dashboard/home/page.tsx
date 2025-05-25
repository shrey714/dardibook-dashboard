"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  CalendarIcon,
  ClipboardIcon,
  UserPlusIcon,
  AlertCircleIcon,
  ActivityIcon,
  PillIcon,
  BarChartIcon,
  BellIcon,
  Info,
  TableCellsMergeIcon,
  TrendingUpIcon,
  Link2,
  Clock,
  User,
  Bed,
  BedIcon,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Bar, BarChart, CartesianGrid, XAxis, Line, LineChart } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  addDays,
  format,
  startOfWeek,
  endOfWeek,
  formatDistanceToNow,
  isTomorrow,
  isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedWeek, setSelectedWeek] = useState<{
    startDate: Date;
    endDate: Date;
  } | null>(null);
  return (
    <div className="p-1 py-2 gap-2 sm:p-2 sm:py-3 sm:gap-3 md:p-3 flex flex-col ">
      <div className="w-full flex flex-row gap-2 sm:gap-3 items-center justify-end">
        <WeekSelector onWeekChange={(weekInfo) => setSelectedWeek(weekInfo)} />
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

const mockAppointments = [
  {
    patient_id: "P001",
    name: "John Smith",
    date_time: Date.now() + 1000 * 60 * 30, // 30 minutes from now
    registerd_for: "Annual Check-up",
  },
  {
    patient_id: "P002",
    name: "Emily Johnson",
    date_time: Date.now() + 1000 * 60 * 60 * 2, // 2 hours from now
    registerd_for: "Dental Cleaning",
  },
  {
    patient_id: "P003",
    name: "Michael Brown",
    date_time: Date.now() + 1000 * 60 * 60 * 4, // 4 hours from now
    registerd_for: "Blood Test",
  },
  {
    patient_id: "P004",
    name: "Sarah Wilson",
    date_time: Date.now() + 1000 * 60 * 60 * 24, // 1 day from now
    registerd_for: "Physical Therapy",
  },
  {
    patient_id: "P005",
    name: "David Lee",
    date_time: Date.now() + 1000 * 60 * 60 * 26, // 1 day and 2 hours from now
    registerd_for: "Vaccination",
  },
  {
    patient_id: "P006",
    name: "Jennifer Martinez",
    date_time: Date.now() + 1000 * 60 * 60 * 48, // 2 days from now
    registerd_for: "Consultation",
  },
  {
    patient_id: "P007",
    name: "Robert Taylor",
    date_time: Date.now() + 1000 * 60 * 60 * 72, // 3 days from now
    registerd_for: "Follow-up",
  },
];

const dummyBeds = [
  {
    bedBookingId: "b1",
    bedId: "101A",
    patient_id: "p1",
    admission_at: Date.now() - 1000 * 60 * 60 * 5,
    discharge_at: Date.now() + 1000 * 60 * 60 * 12,
    admission_for: { name: "Dr. Sharma" },
  },
  {
    bedBookingId: "b2",
    bedId: "102A",
    patient_id: "p2",
    admission_at: Date.now() - 1000 * 60 * 60 * 10,
    discharge_at: Date.now() + 1000 * 60 * 60 * 2,
    admission_for: { name: "Dr. Mehta" },
  },
  {
    bedBookingId: "b3",
    bedId: "103B",
    patient_id: "p3",
    admission_at: Date.now() - 1000 * 60 * 30,
    discharge_at: Date.now() + 1000 * 60 * 60 * 1,
    admission_for: { name: "Dr. Verma" },
  },
  {
    bedBookingId: "b4",
    bedId: "104C",
    patient_id: "p4",
    admission_at: Date.now() - 1000 * 60 * 60 * 8,
    discharge_at: Date.now() + 1000 * 60 * 60 * 8,
    admission_for: { name: "Dr. Rathi" },
  },
  {
    bedBookingId: "b5",
    bedId: "105D",
    patient_id: "p5",
    admission_at: Date.now() - 1000 * 60 * 60 * 2,
    discharge_at: Date.now() + 1000 * 60 * 60 * 1.5,
    admission_for: { name: "Dr. Iyer" },
  },
  {
    bedBookingId: "b6",
    bedId: "106A",
    patient_id: "p6",
    admission_at: Date.now() - 1000 * 60 * 15,
    discharge_at: Date.now() + 1000 * 60 * 60 * 4,
    admission_for: { name: "Dr. Kapoor" },
  },
  {
    bedBookingId: "b7",
    bedId: "107B",
    patient_id: "p7",
    admission_at: Date.now() - 1000 * 60 * 60 * 3,
    discharge_at: Date.now() + 1000 * 60 * 60 * 2,
    admission_for: { name: "Dr. Bose" },
  },
  {
    bedBookingId: "b8",
    bedId: "108C",
    patient_id: "p8",
    admission_at: Date.now() - 1000 * 60 * 60 * 6,
    discharge_at: Date.now() + 1000 * 60 * 60 * 10,
    admission_for: { name: "Dr. Joshi" },
  },
  {
    bedBookingId: "b9",
    bedId: "109D",
    patient_id: "p9",
    admission_at: Date.now() - 1000 * 60 * 45,
    discharge_at: Date.now() + 1000 * 60 * 60 * 1.5,
    admission_for: { name: "Dr. Khan" },
  },
  {
    bedBookingId: "b10",
    bedId: "110A",
    patient_id: "p10",
    admission_at: Date.now() - 1000 * 60 * 60 * 1.5,
    discharge_at: Date.now() + 1000 * 60 * 60 * 5,
    admission_for: { name: "Dr. Reddy" },
  },
  {
    bedBookingId: "b11",
    bedId: "111B",
    patient_id: "p11",
    admission_at: Date.now() - 1000 * 60 * 60 * 9,
    discharge_at: Date.now() + 1000 * 60 * 60 * 3,
    admission_for: { name: "Dr. Saxena" },
  },
  {
    bedBookingId: "b12",
    bedId: "112C",
    patient_id: "p12",
    admission_at: Date.now() - 1000 * 60 * 60 * 7,
    discharge_at: Date.now() + 1000 * 60 * 60 * 4,
    admission_for: { name: "Dr. Bhatt" },
  },
  {
    bedBookingId: "b13",
    bedId: "113D",
    patient_id: "p13",
    admission_at: Date.now() - 1000 * 60 * 20,
    discharge_at: Date.now() + 1000 * 60 * 60 * 6,
    admission_for: { name: "Dr. Rao" },
  },
  {
    bedBookingId: "b14",
    bedId: "114A",
    patient_id: "p14",
    admission_at: Date.now() - 1000 * 60 * 60 * 12,
    discharge_at: Date.now() + 1000 * 60 * 60 * 1,
    admission_for: { name: "Dr. Naik" },
  },
  {
    bedBookingId: "b15",
    bedId: "115B",
    patient_id: "p15",
    admission_at: Date.now() - 1000 * 60 * 60 * 2.5,
    discharge_at: Date.now() + 1000 * 60 * 60 * 3,
    admission_for: { name: "Dr. Desai" },
  },
];

const NewStatusGrid = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const isMiddleDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="grid auto-rows-auto grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6 lg:grid-cols-9">
      {/* small--charts--start */}
      {isDesktop ? (
        <>
          {[1, 2, 3].map((ele) => (
            <div
              key={ele}
              className="text-card-foreground rounded-lg shadow-sm border dark:border-0 col-span-3 h-full lg:col-span-2 xl:col-span-2 bg-gradient-to-b from-muted to-muted/50"
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
          ))}

          <div className="col-span-3">
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

              <CarouselItem className={`basis-[80%] px-1 sm:px-1.5`}>
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
      )}
      {/* small--charts--end */}

      {/* coursel--start */}
      {isDesktop ? (
        <div className="grid col-span-3 md:col-span-6 lg:col-span-3 grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3">
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
      ) : (
        <div className="col-span-3 flex items-center justify-center">
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
      )}
      {/* coursel--end */}

      {/* doctors--performance--chart--start */}
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
      {/* doctors--performance--chart--end */}

      {/* bed--appointments--activity--start */}
      {isMiddleDesktop ? (
        <>
          <Card className="relative border dark:border-0 bg-muted/50 rounded-lg col-span-3 md:col-span-6 lg:col-span-3 overflow-hidden">
            <CardHeader className="px-3 pt-3 pb-2 space-y-0.5 items-center border-b">
              <CardTitle className="font-medium text-ring flex items-center gap-2 leading-normal">
                <BedIcon className="h-5 w-5" />
                Patients in Bed
              </CardTitle>
              <CardDescription className="text-xs">
                Currently admitted patients
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-gradient-to-t from-muted via-muted/0 to-muted/0 overflow-y-auto min-h-96 h-[calc(100svh-140px)] lg:h-[550px] px-0 divide-y divide-border">
              {dummyBeds.length > 0 ? (
                dummyBeds.map((bed) => {
                  const admittedAt = new Date(bed.admission_at);
                  const admittedAgo = formatDistanceToNow(admittedAt, {
                    addSuffix: true,
                  });
                  const timeDisplay = format(admittedAt, "h:mm a, MMM d");

                  return (
                    <div
                      key={bed.bedBookingId}
                      className="flex items-start gap-2 px-2 py-2"
                    >
                      <div className="bg-green-500/10 text-green-500 rounded-md p-2.5">
                        <Bed className="h-4 w-4" />
                      </div>
                      <div className="w-full">
                        <h1 className="w-full text-sm font-medium leading-none flex justify-between items-center">
                          <span className="line-clamp-1">Aarav Shah</span>
                          <span className="text-xs font-medium bg-green-200 text-green-700 dark:bg-green-900/50 dark:text-green-500 px-2 py-0.5 rounded-full">
                            Bed #{bed.bedId}
                          </span>
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {timeDisplay}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <User className="h-3 w-3 mr-1" />
                            {bed.admission_for?.name}
                          </div>
                        </div>
                        <p className="text-xs text-green-600 mt-1">
                          Discharge in {admittedAgo}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-muted-foreground p-4 text-center">
                  No patients are currently admitted.
                </div>
              )}
            </CardContent>
            <div className="flex items-center justify-center py-1 absolute bg-clip-padding backdrop-filter backdrop-blur-sm bottom-0 left-0 right-0">
              <a
                href={"/beds"}
                className="text-muted-foreground hover:underline flex items-center gap-1 text-xs"
              >
                <Link2 size={12} />
                View Bed Status
              </a>
            </div>
          </Card>

          <Card className="relative border dark:border-0 bg-muted/50 rounded-lg col-span-3 md:col-span-6 lg:col-span-3 overflow-hidden">
            <CardHeader className="px-3 pt-3 pb-2 space-y-0.5 items-center border-b">
              <CardTitle className="font-medium text-ring flex items-center gap-2 leading-normal">
                <CalendarIcon className="h-5 w-5" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription className="text-xs">
                Scheduled patient visits.
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-gradient-to-t from-muted via-muted/0 to-muted/0 overflow-y-auto min-h-96 h-[calc(100svh-140px)] lg:h-[550px] px-0 divide-border divide-y">
              {mockAppointments.map((appointment) => {
                const appointmentDate = new Date(appointment.date_time);

                // Format the date display
                let dateDisplay = "";
                if (isToday(appointmentDate)) {
                  dateDisplay = "Today";
                } else if (isTomorrow(appointmentDate)) {
                  dateDisplay = "Tomorrow";
                } else {
                  dateDisplay = format(appointmentDate, "MMM d, yyyy");
                }

                // Time display
                const timeDisplay = format(appointmentDate, "h:mm a");

                // How soon is the appointment
                const timeFromNow = formatDistanceToNow(appointmentDate, {
                  addSuffix: true,
                });

                return (
                  <div
                    key={appointment.patient_id}
                    className="flex items-start gap-2 px-2 py-2"
                  >
                    <div className="bg-blue-500/10 text-blue-500 rounded-md p-2.5">
                      <CalendarIcon className="h-4 w-4" />
                    </div>
                    <div className="w-full">
                      <h1 className="w-full text-sm font-medium leading-none flex flex-row items-center gap-1 justify-between">
                        <p className="line-clamp-1 w-fit">{appointment.name}</p>
                        <span className="text-xs font-medium bg-blue-200 text-blue-700 dark:bg-blue-900/50 dark:text-blue-500 px-2 py-0.5 rounded-full">
                          {dateDisplay}
                        </span>
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {timeDisplay}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <User className="h-3 w-3 mr-1" />
                          {appointment.registerd_for}
                        </div>
                      </div>
                      <p className="text-xs text-blue-500 mt-1">
                        {timeFromNow}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
            <div className="flex items-center justify-center py-1 absolute bg-clip-padding backdrop-filter backdrop-blur-sm bottom-0 left-0 right-0">
              <a
                href={"/appointments"}
                className="text-muted-foreground hover:underline flex flex-row gap-1 items-center text-xs"
                style={{
                  fontSize: "12px",
                  lineHeight: "normal",
                }}
              >
                <Link2 size={12} />
                View All Appointments
              </a>
            </div>
          </Card>

          <Card className="relative border dark:border-0 bg-muted/50 rounded-lg col-span-3 md:col-span-6 lg:col-span-3 overflow-hidden">
            <CardHeader className="px-3 pt-3 pb-2 space-y-0.5 items-center border-b">
              <CardTitle className="font-medium text-ring flex items-center gap-2 leading-normal">
                <ActivityIcon className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription className="text-xs">
                Latest updates from your clinic.
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-gradient-to-t from-muted via-muted/0 to-muted/0 overflow-y-auto min-h-96 h-[calc(100svh-140px)] lg:h-[550px] px-0 divide-border divide-y">
              {mockNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-2 px-2 py-2"
                >
                  <div
                    className={`rounded-md p-2.5
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
                  <div className="w-full">
                    <h1 className="w-full text-sm font-medium leading-none flex flex-row items-center gap-1 justify-between">
                      <p className="line-clamp-1 w-fit text-muted-foreground">
                        {notification.title}
                      </p>
                      <p className="text-xs text-ring text-nowrap">
                        {new Date(notification.timestamp).toLocaleTimeString(
                          [],
                          {
                            hour: "numeric",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </h1>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
            <div className="flex items-center justify-center py-1 absolute bg-clip-padding backdrop-filter backdrop-blur-sm bottom-0 left-0 right-0">
              <Link
                href={"/"}
                className="text-muted-foreground hover:underline flex flex-row gap-1 items-center"
                style={{
                  fontSize: "12px",
                  lineHeight: "normal",
                }}
              >
                <Link2 size={12} />
                View Logs
              </Link>
            </div>
          </Card>
        </>
      ) : (
        <Tabs defaultValue="bed" className="col-span-full">
          <TabsList className="w-full h-auto">
            <TabsTrigger value="bed" asChild>
              <CardHeader className="data-[state=active]:flex-[0.5] data-[state=inactive]:flex-[0.25] group px-3 pt-3 pb-2 space-y-0.5 items-center border-b">
                <CardTitle className="font-medium text-ring flex items-center gap-2 leading-normal group-data-[state=active]:flex-col">
                  <BedIcon className="h-5 w-5 shrink-0" />
                  <span className="hidden group-data-[state=active]:inline">
                    Patients in Bed
                  </span>
                </CardTitle>
                <CardDescription className="text-xs hidden md:group-data-[state=active]:inline">
                  Currently admitted patients
                </CardDescription>
              </CardHeader>
            </TabsTrigger>
            <TabsTrigger value="appointments" asChild>
              <CardHeader className="data-[state=active]:flex-[0.5] data-[state=inactive]:flex-[0.25] group px-3 pt-3 pb-2 space-y-0.5 items-center border-b">
                <CardTitle className="font-medium text-ring flex items-center gap-2 leading-normal group-data-[state=active]:flex-col">
                  <CalendarIcon className="h-5 w-5 shrink-0" />
                  <span className="hidden group-data-[state=active]:inline">
                    Upcoming Appointments
                  </span>
                </CardTitle>
                <CardDescription className="text-xs hidden md:group-data-[state=active]:inline">
                  Scheduled patient visits.
                </CardDescription>
              </CardHeader>
            </TabsTrigger>
            <TabsTrigger value="activity" asChild>
              <CardHeader className="data-[state=active]:flex-[0.5] data-[state=inactive]:flex-[0.25] group px-3 pt-3 pb-2 space-y-0.5 items-center border-b">
                <CardTitle className="font-medium text-ring flex items-center gap-2 leading-normal group-data-[state=active]:flex-col">
                  <ActivityIcon className="h-5 w-5 shrink-0" />
                  <span className="hidden group-data-[state=active]:inline">
                    Recent Activity
                  </span>
                </CardTitle>
                <CardDescription className="text-xs hidden md:group-data-[state=active]:inline">
                  Latest updates from your clinic.
                </CardDescription>
              </CardHeader>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="bed">
            <Card className="relative border dark:border-0 bg-muted/50 rounded-lg col-span-3 md:col-span-6 lg:col-span-3 overflow-hidden">
              <CardHeader className="px-3 pt-3 pb-2 space-y-0.5 items-center border-b">
                <CardTitle className="font-medium text-ring flex items-center gap-2 leading-normal">
                  <BedIcon className="h-5 w-5" />
                  Patients in Bed
                </CardTitle>
                <CardDescription className="text-xs">
                  Currently admitted patients
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-gradient-to-t from-muted via-muted/0 to-muted/0 overflow-y-auto min-h-96 h-[calc(100svh-216px)] md:h-[calc(100svh-240px)] lg:h-[550px] px-0 divide-y divide-border">
                {dummyBeds.length > 0 ? (
                  dummyBeds.map((bed) => {
                    const admittedAt = new Date(bed.admission_at);
                    const admittedAgo = formatDistanceToNow(admittedAt, {
                      addSuffix: true,
                    });
                    const timeDisplay = format(admittedAt, "h:mm a, MMM d");

                    return (
                      <div
                        key={bed.bedBookingId}
                        className="flex items-start gap-2 px-2 py-2"
                      >
                        <div className="bg-green-500/10 text-green-500 rounded-md p-2.5">
                          <Bed className="h-4 w-4" />
                        </div>
                        <div className="w-full">
                          <h1 className="w-full text-sm font-medium leading-none flex justify-between items-center">
                            <span className="line-clamp-1">Aarav Shah</span>
                            <span className="text-xs font-medium bg-green-200 text-green-700 dark:bg-green-900/50 dark:text-green-500 px-2 py-0.5 rounded-full">
                              Bed #{bed.bedId}
                            </span>
                          </h1>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {timeDisplay}
                            </div>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <User className="h-3 w-3 mr-1" />
                              {bed.admission_for?.name}
                            </div>
                          </div>
                          <p className="text-xs text-green-600 mt-1">
                            Discharge in {admittedAgo}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-muted-foreground p-4 text-center">
                    No patients are currently admitted.
                  </div>
                )}
              </CardContent>
              <div className="flex items-center justify-center py-1 absolute bg-clip-padding backdrop-filter backdrop-blur-sm bottom-0 left-0 right-0">
                <a
                  href={"/beds"}
                  className="text-muted-foreground hover:underline flex items-center gap-1 text-xs"
                >
                  <Link2 size={12} />
                  View Bed Status
                </a>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="appointments">
            <Card className="relative border dark:border-0 bg-muted/50 rounded-lg col-span-3 md:col-span-6 lg:col-span-3 overflow-hidden">
              <CardHeader className="px-3 pt-3 pb-2 space-y-0.5 items-center border-b">
                <CardTitle className="font-medium text-ring flex items-center gap-2 leading-normal">
                  <CalendarIcon className="h-5 w-5" />
                  Upcoming Appointments
                </CardTitle>
                <CardDescription className="text-xs">
                  Scheduled patient visits.
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-gradient-to-t from-muted via-muted/0 to-muted/0 overflow-y-auto min-h-96 h-[calc(100svh-216px)] md:h-[calc(100svh-240px)] lg:h-[550px] px-0 divide-border divide-y">
                {mockAppointments.map((appointment) => {
                  const appointmentDate = new Date(appointment.date_time);

                  // Format the date display
                  let dateDisplay = "";
                  if (isToday(appointmentDate)) {
                    dateDisplay = "Today";
                  } else if (isTomorrow(appointmentDate)) {
                    dateDisplay = "Tomorrow";
                  } else {
                    dateDisplay = format(appointmentDate, "MMM d, yyyy");
                  }

                  // Time display
                  const timeDisplay = format(appointmentDate, "h:mm a");

                  // How soon is the appointment
                  const timeFromNow = formatDistanceToNow(appointmentDate, {
                    addSuffix: true,
                  });

                  return (
                    <div
                      key={appointment.patient_id}
                      className="flex items-start gap-2 px-2 py-2"
                    >
                      <div className="bg-blue-500/10 text-blue-500 rounded-md p-2.5">
                        <CalendarIcon className="h-4 w-4" />
                      </div>
                      <div className="w-full">
                        <h1 className="w-full text-sm font-medium leading-none flex flex-row items-center gap-1 justify-between">
                          <p className="line-clamp-1 w-fit">
                            {appointment.name}
                          </p>
                          <span className="text-xs font-medium bg-blue-200 text-blue-700 dark:bg-blue-900/50 dark:text-blue-500 px-2 py-0.5 rounded-full">
                            {dateDisplay}
                          </span>
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {timeDisplay}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <User className="h-3 w-3 mr-1" />
                            {appointment.registerd_for}
                          </div>
                        </div>
                        <p className="text-xs text-blue-500 mt-1">
                          {timeFromNow}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
              <div className="flex items-center justify-center py-1 absolute bg-clip-padding backdrop-filter backdrop-blur-sm bottom-0 left-0 right-0">
                <a
                  href={"/appointments"}
                  className="text-muted-foreground hover:underline flex flex-row gap-1 items-center text-xs"
                  style={{
                    fontSize: "12px",
                    lineHeight: "normal",
                  }}
                >
                  <Link2 size={12} />
                  View All Appointments
                </a>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="activity">
            <Card className="relative border dark:border-0 bg-muted/50 rounded-lg col-span-3 md:col-span-6 lg:col-span-3 overflow-hidden">
              <CardHeader className="px-3 pt-3 pb-2 space-y-0.5 items-center border-b">
                <CardTitle className="font-medium text-ring flex items-center gap-2 leading-normal">
                  <ActivityIcon className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription className="text-xs">
                  Latest updates from your clinic.
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-gradient-to-t from-muted via-muted/0 to-muted/0 overflow-y-auto min-h-96 h-[calc(100svh-216px)] md:h-[calc(100svh-240px)] lg:h-[550px] px-0 divide-border divide-y">
                {mockNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-2 px-2 py-2"
                  >
                    <div
                      className={`rounded-md p-2.5
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
                    <div className="w-full">
                      <h1 className="w-full text-sm font-medium leading-none flex flex-row items-center gap-1 justify-between">
                        <p className="line-clamp-1 w-fit text-muted-foreground">
                          {notification.title}
                        </p>
                        <p className="text-xs text-ring text-nowrap">
                          {new Date(notification.timestamp).toLocaleTimeString(
                            [],
                            {
                              hour: "numeric",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </h1>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <div className="flex items-center justify-center py-1 absolute bg-clip-padding backdrop-filter backdrop-blur-sm bottom-0 left-0 right-0">
                <Link
                  href={"/"}
                  className="text-muted-foreground hover:underline flex flex-row gap-1 items-center"
                  style={{
                    fontSize: "12px",
                    lineHeight: "normal",
                  }}
                >
                  <Link2 size={12} />
                  View Logs
                </Link>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      {/* bed--appointments--activity--end */}
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

const mockNotifications = [
  {
    id: "notif-001",
    type: "Alert",
    title:
      "Medication Stock Alert Medication Stock Alert Medication Stock Alert",
    message:
      "Insulin supplies are running low. Please reorder. Insulin supplies are running low. Please reorder.",
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
  {
    id: "noif-001",
    type: "Alert",
    title: "Medication Stock Alert",
    message: "Insulin supplies are running low. Please reorder.",
    timestamp: "2025-05-20T14:15:00Z",
    read: false,
  },
  {
    id: "noif-002",
    type: "Info",
    title: "Staff Meeting Reminder",
    message: "Weekly staff meeting today at 4:00 PM in Conference Room A.",
    timestamp: "2025-05-20T12:30:00Z",
    read: false,
  },
  {
    id: "noif-003",
    type: "Success",
    title: "New Health Guidelines Available",
    message: "Updated COVID-19 protocols have been published.",
    timestamp: "2025-05-19T16:45:00Z",
    read: true,
  },
  {
    id: "noif-004",
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

function LineChartExample() {
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

function LineChartWithDotsExample() {
  return (
    <ChartContainer
      className="h-[80px] w-full"
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

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

function LineCharStackedExample() {
  return (
    <ChartContainer
      className="h-60 md:h-96 w-full"
      config={{
        desktop: {
          label: "Desktop",
          color: "hsl(var(--chart-1))",
        },
        mobile: {
          label: "Mobile",
          color: "hsl(var(--chart-2))",
        },
      }}
    >
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

interface WeekSelectorProps {
  onWeekChange: (weekInfo: { startDate: Date; endDate: Date }) => void;
}

function WeekSelector({ onWeekChange }: WeekSelectorProps) {
  const [date, setDate] = React.useState<Date>(new Date());
  const [currentWeekStart, setCurrentWeekStart] = React.useState<Date>(
    startOfWeek(new Date())
  );
  const weekEnd = endOfWeek(currentWeekStart);
  React.useEffect(() => {
    const weekStart = startOfWeek(date);
    setCurrentWeekStart(weekStart);
    onWeekChange({
      startDate: weekStart,
      endDate: endOfWeek(weekStart),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const previousWeek = () => {
    setDate(addDays(date, -7));
  };

  const nextWeek = () => {
    setDate(addDays(date, 7));
  };

  const modifiers = {
    inSelectedWeek: {
      from: startOfWeek(date),
      to: endOfWeek(date),
    },
    today: new Date(),
  };

  const modifiersStyles = {
    inSelectedWeek: {
      backgroundColor: "hsl(var(--muted-foreground))",
      color: "hsl(var(--primary-foreground))",
    },
    // today: {
    // color: "hsl(var(--primary-foreground))",
    // },
  };

  return (
    <Popover>
      <div className="flex flex-row h-full w-full sm:w-auto">
        <Button
          variant="outline"
          size="icon"
          onClick={previousWeek}
          className="size-9 rounded-r-none bg-border"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous week</span>
        </Button>
        <PopoverTrigger className="border-y px-2 w-full sm:w-auto">
          <div className="text-sm font-medium text-muted-foreground min-w-44 w-full sm:w-min">
            {format(currentWeekStart, "MMM d")} -{" "}
            {format(weekEnd, "MMM d, yyyy")}
          </div>
        </PopoverTrigger>
        <Button
          variant="outline"
          size="icon"
          onClick={nextWeek}
          className="size-9 rounded-l-none bg-border"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next week</span>
        </Button>
      </div>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          mode="single"
          // selected={date}
          onSelect={(newDate) => newDate && setDate(newDate)}
          className="rounded-md border"
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
        />
      </PopoverContent>
    </Popover>
  );
}
