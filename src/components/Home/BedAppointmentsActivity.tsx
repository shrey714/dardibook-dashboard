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
  InboxIcon,
} from "lucide-react";
import { format, formatDistanceToNow, isTomorrow, isToday } from "date-fns";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivityLog, Appointment, BedPatient } from "@/types/FormTypes";

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
              {patientsInBed.length > 0 ? (
                patientsInBed.map((bed) => {
                  const admittedAt = new Date(bed.admissionAt);
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
                          <span className="line-clamp-1">{bed.patientId}</span>
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
                            {bed.admissionFor}
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
                <EmptyBox message="No patients are currently admitted." />
              )}
            </CardContent>
            <FooterLink title="View Bed Status" link="beds" />
          </Card>

          <Card className="relative border dark:border-0 bg-muted/50 rounded-lg col-span-3 md:col-span-6 lg:col-span-3 overflow-hidden">
            <CardHeader className="px-3 pt-3 pb-2 space-y-0.5 items-center border-b">
              <CardTitle className="font-medium text-ring flex items-center gap-2 leading-normal">
                <CalendarIcon className="h-5 w-5" />
                Upcoming Appointments
              </CardTitle>
              <CardDescription className="text-xs">
                Scheduled patient visits in next two weeks.
              </CardDescription>
            </CardHeader>
            <CardContent className="bg-gradient-to-t from-muted via-muted/0 to-muted/0 overflow-y-auto min-h-96 h-[calc(100svh-140px)] lg:h-[550px] px-0 divide-border divide-y">
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => {
                  const appointmentDate = new Date(appointment.dateTime);

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
                      key={appointment.patientId}
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
                            {appointment.registeredFor}
                          </div>
                        </div>
                        <p className="text-xs text-blue-500 mt-1">
                          {timeFromNow}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <EmptyBox message="No appointments are currently registered for next two weeks." />
              )}
            </CardContent>
            <FooterLink title="View All Appointments" link="calendar" />
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
              {recentActivities.length > 0 ? (
                recentActivities.map((notification) => (
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
                ))
              ) : (
                <EmptyBox message="No activities are being currently recorded." />
              )}
            </CardContent>
            <FooterLink title="View Logs" link="logs" />
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
                {patientsInBed.length > 0 ? (
                  patientsInBed.map((bed) => {
                    const admittedAt = new Date(bed.admissionAt);
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
                            <span className="line-clamp-1">
                              {bed.patientId}
                            </span>
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
                              {bed.admissionFor}
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
                  <EmptyBox message="No patients are currently admitted." />
                )}
              </CardContent>
              <FooterLink title="View Bed Status" link="beds" />
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
                  Scheduled patient visits in next two weeks.
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-gradient-to-t from-muted via-muted/0 to-muted/0 overflow-y-auto min-h-96 h-[calc(100svh-216px)] md:h-[calc(100svh-240px)] lg:h-[550px] px-0 divide-border divide-y">
                {upcomingAppointments.length > 0 ? (
                  upcomingAppointments.map((appointment) => {
                    const appointmentDate = new Date(appointment.dateTime);

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
                        key={appointment.patientId}
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
                              {appointment.registeredFor}
                            </div>
                          </div>
                          <p className="text-xs text-blue-500 mt-1">
                            {timeFromNow}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <EmptyBox message="No appointments are currently registered for next two weeks." />
                )}
              </CardContent>
              <FooterLink title="View All Appointments" link="calendar" />
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
                {recentActivities.length ? (
                  recentActivities.map((notification) => (
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
                            {new Date(
                              notification.timestamp
                            ).toLocaleTimeString([], {
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </h1>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyBox message="No activities are being currently recorded." />
                )}
              </CardContent>
              <FooterLink title="View Logs" link="logs" />
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </>
  );
};

export default BedAppointmentsActivity;

const EmptyBox = ({ message }: { message: string }) => {
  return (
    <div className="text-sm text-muted-foreground px-4 py-8 h-full text-center flex items-center justify-center flex-col gap-y-2">
      <InboxIcon />
      {message}
    </div>
  );
};

const FooterLink = ({ title, link }: { title: string; link: string }) => {
  return (
    <div className="flex items-center justify-center py-1 absolute bg-clip-padding backdrop-filter backdrop-blur-sm bottom-0 left-0 right-0">
      <Link
        href={link}
        className="text-muted-foreground hover:underline flex flex-row gap-1 items-center text-xs leading-normal"
      >
        <Link2 size={12} />
        {title}
      </Link>
    </div>
  );
};
