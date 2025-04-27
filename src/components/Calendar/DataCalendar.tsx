import React, { useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  addDays,
  endOfDay,
  endOfMonth,
  format,
  formatRelative,
  isSameDay,
  startOfDay,
  startOfMonth,
} from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { BedSingle, Calendar, UserPlus, UserRoundPlus } from "lucide-react";
import {
  DatesSetArg,
  EventApi,
  MoreLinkArg,
} from "@fullcalendar/core/index.js";
import { enUS } from "date-fns/locale";
import { EventImpl } from "@fullcalendar/core/internal";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { OrgBed, RegisterPatientFormTypes } from "@/types/FormTypes";

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

interface CalendarDataTypes {
  beds: OrgBed[];
  patients: RegisterPatientFormTypes[];
}

export default function DataCalendar({
  calendarData,
  handleDatesSet,
}: {
  calendarData: CalendarDataTypes;
  handleDatesSet: (arg: DatesSetArg) => void;
}) {
  const [moreLinkModel, setMoreLinkModel] = useState(false);
  const [moreLinkEvents, setMoreLinkEvents] = useState<MoreLinkArg>();
  const [eventModel, setEventModel] = useState(false);
  const [eventData, setEventData] = useState<EventImpl | EventApi>();

  return (
    <>
      {/* model for more links */}
      <Dialog open={moreLinkModel} onOpenChange={setMoreLinkModel}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center justify-start">
                <Calendar className="w-6 h-6" />
                <span className="ml-2">
                  All the appointments for{" "}
                  {moreLinkEvents?.date &&
                    formatRelative(moreLinkEvents.date, new Date(), {
                      locale: customLocale,
                    })}
                </span>
              </div>
            </DialogTitle>
            <DialogDescription>
              Click on an appointment to view more details.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 max-h-[50vh] overflow-y-auto max-w-full">
            {moreLinkEvents?.allSegs?.map((event, index) => (
              <Button
                key={index}
                type="button"
                variant={"outline"}
                className="border-2 w-full bg-muted/50 rounded-md min-h-min h-min flex flex-row items-center justify-start overflow-hidden p-0"
                onClick={() => {
                  setEventData(event?.event);
                  setEventModel(true);
                  return "none";
                }}
              >
                <div className="bg-green-500/90 w-[3px] h-full"></div>

                <div className="relative flex flex-1 flex-row items-center gap-2 p-2">
                  <BedSingle />

                  <Link
                    href={{
                      pathname: "history/patientHistory",
                      query: {
                        patientId: event?.event?.extendedProps?.patientData?.id,
                      },
                    }}
                    className={`ml-2 text-sm underline`}
                  >
                    {event?.event?.extendedProps?.patientData?.id}
                  </Link>
                  {" - "}
                  <p className="flex flex-row flex-1">
                    {event?.event?.extendedProps?.patientData?.first_name}{" "}
                    {event?.event?.extendedProps?.patientData?.last_name}
                  </p>
                </div>

                <div className="bg-red-500/90 w-[3px] h-full"></div>
              </Button>
            ))}
            <Separator />
            {moreLinkEvents?.allSegs?.map((event, index) => (
              <Button
                key={index}
                type="button"
                variant={"outline"}
                className="border-2 w-full bg-muted/50 rounded-md min-h-min h-min flex flex-row items-center justify-start px-3"
                onClick={() => {
                  setEventData(event?.event);
                  setEventModel(true);
                  return "none";
                }}
              >
                <UserRoundPlus />

                <Link
                  href={{
                    pathname: "history/patientHistory",
                    query: {
                      patientId: event?.event?.extendedProps?.patientData?.id,
                    },
                  }}
                  className={`ml-2 text-sm underline`}
                >
                  {event?.event?.extendedProps?.patientData?.id}
                </Link>
                {" - "}
                <p className="flex flex-row flex-1">
                  {event?.event?.extendedProps?.patientData?.first_name}{" "}
                  {event?.event?.extendedProps?.patientData?.last_name}
                </p>
                <p className="ml-2">
                  {format(
                    new Date(
                      event?.event?.extendedProps?.patientData?.last_visited
                    ),
                    "hh:mm a"
                  )}
                </p>
              </Button>
            ))}
            {/* pls arrnage according to the type of patient/appointment */}
          </div>
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button
                type="button"
                variant={"outline"}
                className="border-2 self-center rounded-full min-h-min h-min py-2 px-7 text-xs leading-none"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* model for event link */}
      <Dialog open={eventModel} onOpenChange={setEventModel}>
        <DialogContent className="sm:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center justify-start">
                <Calendar className="w-6 h-6" />
                <span className="ml-2">
                  Event timeline :{" "}
                  {/* {eventData?.event?.start &&
                    formatRelative(eventData?.event?.start, new Date(), {
                      locale: customLocale,
                    })}
                  {" - "}
                  {eventData?.event?.end &&
                    formatRelative(eventData?.event?.end, new Date(), {
                      locale: customLocale,
                    })} */}
                </span>
              </div>
            </DialogTitle>
            <DialogDescription>
              Click on an event to view more details.
              {/* {eventData?.event?.title} */}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 max-h-[50vh] overflow-y-auto bg-muted/50 max-w-full py-4 px-5 border-2 border-border rounded-md">
            <div className="grid grid-cols-4 items-center gap-4">
              Name : {eventData?.extendedProps?.patientData.first_name}{" "}
              {eventData?.extendedProps?.patientData.last_name}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">Username</div>
          </div>
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button
                type="button"
                variant={"outline"}
                className="border-2 self-center rounded-full min-h-min h-min py-2 px-7 text-xs leading-none"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FullCalendar
        datesSet={handleDatesSet}
        fixedWeekCount={false}
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        dayMaxEventRows={true}
        headerToolbar={{
          right: "prev,next today",
          center: "title",
          left: "dayGridMonth,timeGridWeek",
        }}
        nowIndicator={true}
        moreLinkClick={(events) => {
          setMoreLinkEvents(events);
          setMoreLinkModel(true);
          return "none";
        }}
        // eventBackgroundColor="transparent"
        // eventBorderColor="transparent"
        height={"100%"}
        dayMaxEvents={3}
        editable={true}
        handleWindowResize={true}
        eventClick={(event) => {
          setEventData(event?.event);
          setEventModel(true);
          return "none";
        }}
        selectable={true}
        selectMirror={true}
        dateClick={() => {}}
        events={[...calendarData.beds, ...calendarData.patients].map(
          (event) => {
            if ("bedId" in event) {
              return {
                title: `${event.bedId} (${event.patient_id})`,
                start: format(new Date(event.admission_at), "yyyy-MM-dd"),
                end: format(
                  new Date(addDays(event.discharge_at, 1)),
                  "yyyy-MM-dd"
                ),
                Data: event as OrgBed,
                durationEditable: true,
                borderColor: "hsl(var(--primary))",
                backgroundColor: "hsl(var(--popover))",
                textColor: "hsl(var(--accent-foreground))",
              };
            } else {
              const prescribed = event.prescribed_date_time.some((dateTime) =>
                isSameDay(dateTime, new Date())
              );
              return {
                title: `${event.patient_id}`,
                date: format(new Date(event.registered_date[0]), "yyyy-MM-dd"),
                Data: event as RegisterPatientFormTypes,
                durationEditable: true,
                borderColor: prescribed
                  ? "rgb(22 163 74 / 1)"
                  : "rgb(37 99 235 / 1)",
                backgroundColor: prescribed
                  ? "rgb(22 163 74 / 0.1)"
                  : "rgb(37 99 235 / 0.1)",
                textColor: prescribed
                  ? "rgb(22 163 74 / 1)"
                  : "rgb(37 99 235 / 1)",
              };
            }
          }
        )}
        eventContent={(eventInfo) => (
          <span className="flex flex-row gap-1 items-center px-2">
            {"bedId" in eventInfo.event.extendedProps?.Data ? (
              <BedSingle size={15} />
            ) : (
              <UserPlus size={15} />
            )}
            {eventInfo.event.title}
          </span>
        )}
        eventAllow={(_, draggedEvent) =>
          "bedId" in draggedEvent?.extendedProps?.Data ? true : false
        }
      />
    </>
  );
}
