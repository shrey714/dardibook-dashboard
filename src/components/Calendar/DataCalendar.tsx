import React, { createRef } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format } from "date-fns";
import { Button } from "../ui/button";
import {
  BedIcon,
  BedSingle,
  CalendarMinus,
  CalendarPlusIcon,
  ClipboardPlusIcon,
  HistoryIcon,
  LogOutIcon,
  PencilLineIcon,
  StethoscopeIcon,
  UserPlus,
  UserPlusIcon,
} from "lucide-react";
import { DatesSetArg } from "@fullcalendar/core/index.js";
import { CalendarEventTypes } from "@/types/FormTypes";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePatientHistoryModalStore } from "@/lib/stores/patientHistoryModalStore";
import { CalendarHeader } from "./CalendarHeader";
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

export default function DataCalendar({
  calendarData,
  handleDatesSet,
}: {
  calendarData: CalendarEventTypes[];
  handleDatesSet: (arg: DatesSetArg) => void;
}) {
  const { openModal } = usePatientHistoryModalStore();
  const calendarRef = createRef<FullCalendar>();
  return (
    <div className="w-full p-0 pt-1 sm:p-1 h-full space-y-1 relative">
      <CalendarHeader calendarRef={calendarRef} />
      <FullCalendar
        ref={calendarRef}
        // navLinks
        datesSet={handleDatesSet}
        fixedWeekCount={false}
        plugins={[dayGridPlugin, interactionPlugin]} //timeGridPlugin
        dayMaxEventRows={true}
        headerToolbar={{
          right: "",
          center: "",
          left: "", // title prev,next today dayGridMonth,timeGridWeek
        }}
        nowIndicator={true}
        height={"calc(100% - 44px)"}
        dayMaxEvents={3}
        editable={true}
        handleWindowResize={true}
        eventClick={() => {
          return "none";
        }}
        selectable={true}
        selectMirror={true}
        dateClick={() => {}}
        events={calendarData.map((event) => {
          if (event.event_type === "bed") {
            return {
              title: `${event.bed_details.bedId} - ${event.patient_name}`,
              start: format(
                new Date(event.bed_details.admission_at),
                "yyyy-MM-dd'T'HH:mm:ss"
              ),
              end: format(
                new Date(event.bed_details.discharge_at),
                "yyyy-MM-dd'T'HH:mm:ss"
              ),
              Data: event as CalendarEventTypes,
              durationEditable: false,
              borderColor: event.bed_details.dischargeMarked
                ? "rgb(220 38 38 / 1)"
                : "hsl(var(--primary))",
              backgroundColor: event.bed_details.dischargeMarked
                ? "rgb(220 38 38 / 0.1)"
                : "hsl(var(--popover))",
              textColor: event.bed_details.dischargeMarked
                ? "rgb(220 38 38 / 1)"
                : "hsl(var(--accent-foreground))",
            };
          } else if (event.event_type === "appointment") {
            return {
              title: `${event.patient_name}`,
              date: format(
                new Date(event.appointment_details.registered_at),
                "yyyy-MM-dd"
              ),
              Data: event as CalendarEventTypes,
              durationEditable: false,
              borderColor: event.appointment_details.prescribed
                ? "rgb(22 163 74 / 1)"
                : "rgb(37 99 235 / 1)",
              backgroundColor: event.appointment_details.prescribed
                ? "rgb(22 163 74 / 0.1)"
                : "rgb(37 99 235 / 0.1)",
              textColor: event.appointment_details.prescribed
                ? "rgb(22 163 74 / 1)"
                : "rgb(37 99 235 / 1)",
            };
          } else {
            return {};
          }
        })}
        eventContent={(eventInfo) => {
          return (
            <Popover>
              <PopoverTrigger asChild>
                <span className="flex flex-row gap-0.5 sm:gap-1 items-center px-1 sm:px-2 text-[8px] sm:text-sm overflow-hidden text-clip">
                  {eventInfo.event.extendedProps?.Data.event_type === "bed" ? (
                    <BedSingle className="size-2.5 sm:size-3.5 shrink-0" />
                  ) : (
                    <UserPlus className="size-2.5 sm:size-3.5 shrink-0" />
                  )}
                  {eventInfo.event.title}
                </span>
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
                    <Timeline orientation="vertical" className="pt-2 px-2 pb-2">
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
                            {eventInfo.event.extendedProps?.Data?.patient_id}
                          </TimelineTitle>
                          <TimelineDescription className="text-primary text-sm font-medium">
                            {eventInfo.event.extendedProps?.Data?.patient_name}
                          </TimelineDescription>
                        </TimelineContent>
                      </TimelineItem>

                      {eventInfo.event.extendedProps?.Data.event_type ===
                        "appointment" && (
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
                                  eventInfo.event.extendedProps?.Data
                                    .appointment_details.registered_at,
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

                            {eventInfo.event.extendedProps?.Data
                              .appointment_details.prescribed ? (
                              <TimelineContent>
                                <TimelineTitle className="text-xs text-muted-foreground">
                                  Prescribed On
                                </TimelineTitle>
                                <TimelineDescription className="text-primary text-sm font-medium">
                                  {format(
                                    eventInfo.event.extendedProps?.Data
                                      .appointment_details.prescribed_at,
                                    "h.mm a, MMMM d, yyyy"
                                  )}
                                </TimelineDescription>
                              </TimelineContent>
                            ) : (
                              <TimelineContent className="pb-0 flex items-center">
                                <TimelineTitle>Not Prescribed</TimelineTitle>
                              </TimelineContent>
                            )}
                          </TimelineItem>
                        </>
                      )}

                      {eventInfo.event.extendedProps?.Data.event_type ===
                        "bed" && (
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
                                  eventInfo.event.extendedProps?.Data
                                    .bed_details.admission_at,
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
                                {
                                  eventInfo.event.extendedProps?.Data
                                    .bed_details.admission_by
                                }
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
                                {
                                  eventInfo.event.extendedProps?.Data
                                    .bed_details.admission_for
                                }
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
                                {
                                  eventInfo.event.extendedProps?.Data
                                    .bed_details.bedId
                                }
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
                              {eventInfo.event.extendedProps?.Data.bed_details
                                .dischargeMarked && <TimelineConnector />}
                            </TimelineSeparator>
                            <TimelineContent>
                              <TimelineTitle className="text-xs text-muted-foreground">
                                {eventInfo.event.extendedProps?.Data.bed_details
                                  .dischargeMarked
                                  ? "Discharged on"
                                  : "Discharge on"}
                              </TimelineTitle>
                              <TimelineDescription className="text-primary text-sm font-medium">
                                {format(
                                  eventInfo.event.extendedProps?.Data
                                    .bed_details.discharge_at,
                                  "h.mm a, MMMM d, yyyy"
                                )}
                              </TimelineDescription>
                            </TimelineContent>
                          </TimelineItem>

                          {eventInfo.event.extendedProps?.Data.bed_details
                            .dischargeMarked && (
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
                                  {
                                    eventInfo.event.extendedProps?.Data
                                      .bed_details?.discharged_by
                                  }
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
                        patientId:
                          eventInfo.event.extendedProps?.Data.patient_id,
                      });
                    }}
                  >
                    <HistoryIcon /> History
                  </Button>
                </footer>
              </PopoverContent>
            </Popover>
          );
        }}
        eventAllow={(_, draggedEvent) =>
          draggedEvent?.extendedProps?.Data.event_type === "bed" ? false : false
        }
      />
    </div>
  );
}
