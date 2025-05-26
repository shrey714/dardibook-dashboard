"use client";
import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  CalendarIcon,
  AlertCircleIcon,
  ActivityIcon,
  Link2,
  Clock,
  User,
  Bed,
  BedIcon,
} from "lucide-react";
import { format, formatDistanceToNow, isTomorrow, isToday } from "date-fns";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityLog, Appointment, BedPatient } from "@/types/FormTypes";

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

const BedAppointmentsActivity = ({
  patientsInBed,
  upcomingAppointments,
  recentActivities,
}: {
  patientsInBed: BedPatient[];
  upcomingAppointments: Appointment[];
  recentActivities: ActivityLog[];
}) => {
  const isMiddleDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <>
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
              <CardHeader className="data-[state=active]:flex-[0.5] data-[state=inactive]:flex-[0.25] group px-3 pt-3 pb-2 space-y-0.5 items-center">
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
              <CardHeader className="data-[state=active]:flex-[0.5] data-[state=inactive]:flex-[0.25] group px-3 pt-3 pb-2 space-y-0.5 items-center">
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
              <CardHeader className="data-[state=active]:flex-[0.5] data-[state=inactive]:flex-[0.25] group px-3 pt-3 pb-2 space-y-0.5 items-center">
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
    </>
  );
};

export default BedAppointmentsActivity;
