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
import { BedSingle, InboxIcon, UserPlus } from "lucide-react";
import {
  endOfDay,
  getTime,
  isSameDay,
  isWithinInterval,
  startOfDay,
} from "date-fns";

interface CalendarSidebarContentTypes {
  monthDate: Date;
  calendarData: CalendarEventTypes[];
  loader: boolean;
}

export function CalendarSidebarContent({
  monthDate,
  calendarData,
  loader,
}: CalendarSidebarContentTypes) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

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
      <SidebarHeader className="p-0">
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
                    <SidebarMenuButton
                      className={`border ${
                        item.appointment_details.prescribed
                          ? "border-[rgb(22,163,74)]"
                          : "border-[rgb(37,99,235)]"
                      } ${
                        item.appointment_details.prescribed
                          ? "bg-[rgba(22,163,74,0.1)]"
                          : "bg-[rgba(37,99,235,0.1)]"
                      } ${
                        item.appointment_details.prescribed
                          ? "text-[rgb(22,163,74)]"
                          : "text-[rgb(37,99,235)]"
                      }`}
                      asChild
                    >
                      <span>
                        <UserPlus className="size-2.5 sm:size-3.5 shrink-0" />
                        {item.patient_name}
                      </span>
                    </SidebarMenuButton>
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
                    <SidebarMenuButton
                      className={`border ${
                        item.bed_details.dischargeMarked
                          ? "border-[rgb(220,38,38)]"
                          : "border-primary"
                      } ${
                        item.bed_details.dischargeMarked
                          ? "bg-[rgba(220,38,38,0.1)]"
                          : "bg-popover"
                      } ${
                        item.bed_details.dischargeMarked
                          ? "text-[rgb(220,38,38)]"
                          : "text-accent-foreground"
                      }`}
                      asChild
                    >
                      <span>
                        <BedSingle className="size-2.5 sm:size-3.5 shrink-0" />
                        {item.patient_name}
                      </span>
                    </SidebarMenuButton>
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
