import * as React from "react";

import {
  CalendarSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/calendarSidebar";
import { Calendar } from "../ui/calendar";
import { CalendarEventTypes } from "@/types/FormTypes";
import {
  BedIcon,
  BedSingle,
  CalendarMinus,
  CalendarPlusIcon,
  ClipboardPlusIcon,
  HistoryIcon,
  InboxIcon,
  LogOutIcon,
  PencilLineIcon,
  StethoscopeIcon,
  UserPlus,
  UserPlusIcon,
} from "lucide-react";
import {
  endOfDay,
  format,
  formatRelative,
  getTime,
  isSameDay,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePatientHistoryModalStore } from "@/lib/stores/patientHistoryModalStore";
import { enUS } from "date-fns/locale";
import { Button } from "../ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ScrollArea } from "../ui/scroll-area";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";

interface CalendarSidebarContentTypes {
  monthDate: Date;
  calendarData: CalendarEventTypes[];
  loader: boolean;
}

const customLocale = {
  ...enUS,
  formatRelative: (token: string) => {
    const formatWithoutTime: Record<string, string> = {
      lastWeek: "'last' eeee",
      yesterday: "'yesterday'",
      today: "'today'",
      tomorrow: "'tomorrow'",
      nextWeek: "eeee",
      other: "MMMM dd, yyyy",
    };
    return formatWithoutTime[token];
  },
};

export function CalendarSidebarContent({
  monthDate,
  calendarData,
  loader,
}: CalendarSidebarContentTypes) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { openModal } = usePatientHistoryModalStore();

  React.useEffect(() => {
    setDate(undefined);
  }, [monthDate]);

  const appointments = calendarData
    .filter((data) => data.event_type === "appointment")
    .filter((data) =>
      date ? isSameDay(date, data.appointment_details.registered_at) : true
    );

  const admissions = calendarData
    .filter((data) => data.event_type === "bed")
    .filter((data) =>
      date
        ? isWithinInterval(getTime(date), {
            start: startOfDay(data.bed_details.admission_at),
            end: endOfDay(data.bed_details.discharge_at),
          })
        : true
    );

  return (
    <CalendarSidebar
      variant="sidebar"
      className="h-full absolute top-0"
      side="right"
    >
      <SidebarHeader className="p-0 gap-0">
        <SidebarGroup className="px-0">
          <SidebarGroupContent className="flex justify-center">
            <Calendar
              mode="single"
              month={monthDate}
              showOutsideDays={false}
              hideNavigation
              selected={date}
              onSelect={(d) => {
                setDate(d);
              }}
              className="py-0"
              monthGridClassName="mt-2"
              showYearSwitcher={false}
            />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="py-0">
          <SidebarGroupLabel className="border-b">
            {date
              ? formatRelative(date, new Date(), { locale: customLocale })
              : format(monthDate, "MMMM, yyyy")}
          </SidebarGroupLabel>
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        <SidebarGroup className="py-0">
          <SidebarGroupLabel>Appointments</SidebarGroupLabel>
          <SidebarMenu>
            {loader ? (
              <>
                <SidebarMenuSkeleton />
                <SidebarMenuSkeleton />
              </>
            ) : appointments.length === 0 ? (
              <div className="w-full min-h-8 flex items-center justify-center text-muted-foreground">
                <InboxIcon />
              </div>
            ) : (
              <>
                {appointments.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <SidebarMenuButton
                          className={`border ${
                            item.appointment_details.prescribed
                              ? "border-[rgb(22,163,74)]"
                              : "border-[rgb(37,99,235)]"
                          } ${
                            item.appointment_details.prescribed
                              ? "bg-[rgba(22,163,74,0.1)] hover:bg-[rgba(22,163,74,1)]"
                              : "bg-[rgba(37,99,235,0.1)] hover:bg-[rgba(37,99,235,1)]"
                          } ${
                            item.appointment_details.prescribed
                              ? "text-[rgb(22,163,74)] hover:text-[rgb(255,255,255,1)]"
                              : "text-[rgb(37,99,235)] hover:text-[rgb(255,255,255,1)]"
                          }`}
                          asChild
                        >
                          <span>
                            <UserPlus className="size-2.5 sm:size-3.5 shrink-0" />
                            {item.patient_name}
                          </span>
                        </SidebarMenuButton>
                      </PopoverTrigger>
                      <PopoverContent
                        side="left"
                        collisionPadding={20}
                        sideOffset={10}
                        className="w-96 max-w-md bg-muted/50 backdrop-blur-3xl border-0 p-0 overflow-hidden"
                        style={{
                          boxShadow:
                            "0 3px 4px 0 rgba(0,0,0,.14),0 3px 3px -2px rgba(0,0,0,.12),0 1px 8px 0 rgba(0,0,0,.2)",
                        }}
                      >
                        <header className="flex flex-row items-center justify-end p-2.5 pb-0">
                          <PopoverClose asChild aria-label="Close">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="rounded-full"
                            >
                              <Cross2Icon />
                            </Button>
                          </PopoverClose>
                        </header>
                        <ScrollArea className="h-96 w-full">
                          <div className="pt-0 p-4 pb-0 flex flex-col gap-2">
                            <Timeline
                              orientation="vertical"
                              className="pt-2 px-2 pb-2"
                            >
                              <TimelineItem>
                                <TimelineSeparator>
                                  <UserPlusIcon
                                    size={36}
                                    className="bg-blue-600/10 text-blue-600 border border-blue-600 rounded-full p-2"
                                  />
                                  <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                  <TimelineTitle className="text-xs text-muted-foreground">
                                    {item.patient_id}
                                  </TimelineTitle>
                                  <TimelineDescription className="text-primary text-sm font-medium">
                                    {item.patient_name}
                                  </TimelineDescription>
                                </TimelineContent>
                              </TimelineItem>

                              {item.event_type === "appointment" && (
                                <>
                                  <TimelineItem>
                                    <TimelineSeparator>
                                      <div className="px-[6px]">
                                        <CalendarPlusIcon
                                          size={24}
                                          className="text-primary"
                                        />
                                      </div>
                                      <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                      <TimelineTitle className="text-xs text-muted-foreground">
                                        Registered On
                                      </TimelineTitle>
                                      <TimelineDescription className="text-primary text-sm font-medium">
                                        {format(
                                          item.appointment_details
                                            .registered_at,
                                          "h.mm a, MMMM d, yyyy"
                                        )}
                                      </TimelineDescription>
                                    </TimelineContent>
                                  </TimelineItem>

                                  <TimelineItem>
                                    <TimelineSeparator>
                                      <div className="px-[6px]">
                                        <ClipboardPlusIcon
                                          size={24}
                                          className="text-green-600"
                                        />
                                      </div>
                                    </TimelineSeparator>

                                    {item.appointment_details.prescribed &&
                                    item.appointment_details.prescribed_at ? (
                                      <TimelineContent>
                                        <TimelineTitle className="text-xs text-muted-foreground">
                                          Prescribed On
                                        </TimelineTitle>
                                        <TimelineDescription className="text-primary text-sm font-medium">
                                          {format(
                                            item.appointment_details
                                              .prescribed_at,
                                            "h.mm a, MMMM d, yyyy"
                                          )}
                                        </TimelineDescription>
                                      </TimelineContent>
                                    ) : (
                                      <TimelineContent className="pb-0 flex items-center">
                                        <TimelineTitle>
                                          Not Prescribed
                                        </TimelineTitle>
                                      </TimelineContent>
                                    )}
                                  </TimelineItem>
                                </>
                              )}
                            </Timeline>
                          </div>
                        </ScrollArea>
                        <footer className="flex flex-row justify-end p-1 border-t">
                          <Button
                            className="rounded-full"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              openModal({
                                patientId: item.patient_id,
                              });
                            }}
                          >
                            <HistoryIcon /> History
                          </Button>
                        </footer>
                      </PopoverContent>
                    </Popover>
                  </SidebarMenuItem>
                ))}
              </>
            )}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="py-0">
          <SidebarGroupLabel className="">Admissions</SidebarGroupLabel>
          <SidebarMenu>
            {loader ? (
              <>
                <SidebarMenuSkeleton />
                <SidebarMenuSkeleton />
              </>
            ) : admissions.length === 0 ? (
              <div className="w-full min-h-8 flex items-center justify-center text-muted-foreground">
                <InboxIcon />
              </div>
            ) : (
              <>
                {admissions.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <SidebarMenuButton
                          className={`border ${
                            item.bed_details.dischargeMarked
                              ? "border-[rgb(220,38,38)]"
                              : "border-primary"
                          } ${
                            item.bed_details.dischargeMarked
                              ? "bg-[rgba(220,38,38,0.1)] hover:bg-[rgba(220,38,38,1)]"
                              : "bg-popover hover:bg-primary"
                          } ${
                            item.bed_details.dischargeMarked
                              ? "text-[rgb(220,38,38)] hover:text-[rgb(255,255,255)]"
                              : "text-accent-foreground hover:text-primary-foreground"
                          }`}
                          asChild
                        >
                          <span>
                            <BedSingle className="size-2.5 sm:size-3.5 shrink-0" />
                            {item.patient_name}
                          </span>
                        </SidebarMenuButton>
                      </PopoverTrigger>
                      <PopoverContent
                        side="left"
                        collisionPadding={20}
                        sideOffset={10}
                        className="w-96 max-w-md bg-muted/50 backdrop-blur-3xl border-0 p-0 overflow-hidden"
                        style={{
                          boxShadow:
                            "0 3px 4px 0 rgba(0,0,0,.14),0 3px 3px -2px rgba(0,0,0,.12),0 1px 8px 0 rgba(0,0,0,.2)",
                        }}
                      >
                        <header className="flex flex-row items-center justify-end p-2.5 pb-0">
                          <PopoverClose asChild aria-label="Close">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="rounded-full"
                            >
                              <Cross2Icon />
                            </Button>
                          </PopoverClose>
                        </header>
                        <ScrollArea className="h-96 w-full">
                          <div className="pt-0 p-4 pb-0 flex flex-col gap-2">
                            <Timeline
                              orientation="vertical"
                              className="pt-2 px-2 pb-2"
                            >
                              <TimelineItem>
                                <TimelineSeparator>
                                  <UserPlusIcon
                                    size={36}
                                    className="bg-blue-600/10 text-blue-600 border border-blue-600 rounded-full p-2"
                                  />
                                  <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent>
                                  <TimelineTitle className="text-xs text-muted-foreground">
                                    {item.patient_id}
                                  </TimelineTitle>
                                  <TimelineDescription className="text-primary text-sm font-medium">
                                    {item.patient_name}
                                  </TimelineDescription>
                                </TimelineContent>
                              </TimelineItem>
                              {item.event_type === "bed" && (
                                <>
                                  <TimelineItem>
                                    <TimelineSeparator>
                                      <div className="px-[6px]">
                                        <CalendarPlusIcon
                                          size={24}
                                          className="text-yellow-400"
                                        />
                                      </div>
                                      <TimelineConnector className="bg-yellow-400" />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                      <TimelineTitle className="text-xs text-muted-foreground">
                                        Admitted on
                                      </TimelineTitle>
                                      <TimelineDescription className="text-primary text-sm font-medium">
                                        {format(
                                          item.bed_details.admission_at,
                                          "h.mm a, MMMM d, yyyy"
                                        )}
                                      </TimelineDescription>
                                    </TimelineContent>
                                  </TimelineItem>

                                  <TimelineItem>
                                    <TimelineSeparator>
                                      <PencilLineIcon
                                        size={36}
                                        className="bg-blue-600/10 text-blue-600 border border-blue-600 rounded-md p-2"
                                      />
                                    </TimelineSeparator>
                                    <TimelineContent className="pb-1.5">
                                      <TimelineTitle className="text-xs text-muted-foreground">
                                        Admitted By
                                      </TimelineTitle>
                                      <TimelineDescription className="text-primary text-sm font-medium">
                                        {item.bed_details.admission_by}
                                      </TimelineDescription>
                                    </TimelineContent>
                                  </TimelineItem>

                                  <TimelineItem>
                                    <TimelineSeparator>
                                      <StethoscopeIcon
                                        size={36}
                                        className="bg-green-500/10 text-green-600 border border-green-600 rounded-md p-2"
                                      />
                                    </TimelineSeparator>
                                    <TimelineContent className="pb-1.5">
                                      <TimelineTitle className="text-xs text-muted-foreground">
                                        Admitted For
                                      </TimelineTitle>
                                      <TimelineDescription className="text-primary text-sm font-medium">
                                        {item.bed_details.admission_for}
                                      </TimelineDescription>
                                    </TimelineContent>
                                  </TimelineItem>

                                  <TimelineItem>
                                    <TimelineSeparator>
                                      <BedIcon
                                        size={36}
                                        className="bg-blue-600/10 text-blue-600 border border-blue-600 rounded-md p-2"
                                      />
                                      <TimelineConnector className="bg-red-500" />
                                    </TimelineSeparator>

                                    <TimelineContent className="pb-10">
                                      <TimelineTitle className="text-xs text-muted-foreground">
                                        Bed ID
                                      </TimelineTitle>
                                      <TimelineDescription className="text-primary text-sm font-medium">
                                        {item.bed_details.bedId}
                                      </TimelineDescription>
                                    </TimelineContent>
                                  </TimelineItem>

                                  <TimelineItem>
                                    <TimelineSeparator>
                                      <div className="px-[6px]">
                                        <CalendarMinus
                                          size={24}
                                          className="text-red-500"
                                        />
                                      </div>
                                      {item.bed_details.dischargeMarked && (
                                        <TimelineConnector />
                                      )}
                                    </TimelineSeparator>
                                    <TimelineContent>
                                      <TimelineTitle className="text-xs text-muted-foreground">
                                        {item.bed_details.dischargeMarked
                                          ? "Discharged on"
                                          : "Discharge on"}
                                      </TimelineTitle>
                                      <TimelineDescription className="text-primary text-sm font-medium">
                                        {format(
                                          item.bed_details.discharge_at,
                                          "h.mm a, MMMM d, yyyy"
                                        )}
                                      </TimelineDescription>
                                    </TimelineContent>
                                  </TimelineItem>

                                  {item.bed_details.dischargeMarked && (
                                    <TimelineItem>
                                      <TimelineSeparator>
                                        <LogOutIcon
                                          size={36}
                                          className="bg-red-500/10 text-red-500 border border-red-500 rounded-md p-2"
                                        />
                                      </TimelineSeparator>
                                      <TimelineContent className="pb-1.5">
                                        <TimelineTitle className="text-xs text-muted-foreground">
                                          Discharged By
                                        </TimelineTitle>
                                        <TimelineDescription className="text-primary text-base font-medium">
                                          {item.bed_details?.discharged_by}
                                        </TimelineDescription>
                                      </TimelineContent>
                                    </TimelineItem>
                                  )}
                                </>
                              )}
                            </Timeline>
                          </div>
                        </ScrollArea>
                        <footer className="flex flex-row justify-end p-1 border-t">
                          <Button
                            className="rounded-full"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              openModal({
                                patientId: item.patient_id,
                              });
                            }}
                          >
                            <HistoryIcon /> History
                          </Button>
                        </footer>
                      </PopoverContent>
                    </Popover>
                  </SidebarMenuItem>
                ))}
              </>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </CalendarSidebar>
  );
}
