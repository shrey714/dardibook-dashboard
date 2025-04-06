import React, { useState } from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { format, formatRelative } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import {} from "../ui/dialog";
import { Button } from "../ui/button";
import { Calendar } from "lucide-react";
import { MoreLinkArg } from "@fullcalendar/core/index.js";
import { enUS } from "date-fns/locale";

interface PatientData {
  id: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  age: string;
  gender: string;
  appointed: boolean;
  last_visited: number;
  visitedDates: number[]; //array of timestamps in milliseconds
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

export default function DataCalendar({ data }: { data: PatientData[] }) {
  const [moreLinkModel, setMoreLinkModel] = useState(false);
  const [moreLinkEvents, setMoreLinkEvents] = useState<MoreLinkArg>();
  const handleDateClick = (arg: { dateStr: any }) => {
    console.log(arg.dateStr);
  };
  const handleEventClick = (arg: any) => {
    console.log(arg.event.startStr);
  };
  return (
    <>
      {/* model for more links */}
      <Dialog open={moreLinkModel} onOpenChange={setMoreLinkModel}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center justify-start">
                <Calendar className="w-6 h-6" />
                <span className="ml-2">
                  All the events for{" "}
                  {moreLinkEvents?.date &&
                    formatRelative(moreLinkEvents.date, new Date(), {
                      locale: customLocale,
                    })}
                </span>
              </div>
            </DialogTitle>
            <DialogDescription>
              Click on an event to view more details.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 max-h-[50vh] overflow-y-auto bg-muted/50 max-w-full py-4 px-5 border-2 border-border rounded-md">
            <div className="grid grid-cols-4 items-center gap-4">Name</div>
            <div className="grid grid-cols-4 items-center gap-4">Username</div>
          </div>
          <DialogFooter className="f-full sm:justify-center">
            <Button type="submit">Add New</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        dayMaxEventRows={3}
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
        height={"100%"}
        dayMaxEvents={3}
        editable={true}
        handleWindowResize={true}
        eventClick={handleEventClick}
        selectable={true}
        selectMirror={true}
        dateClick={handleDateClick}
        events={data.map((event) => ({
          title: `${event.first_name} ${event.last_name} ${format(
            new Date(event.last_visited),
            "hh:mm a"
          )}`,
          date: format(new Date(event.last_visited), "yyyy-MM-dd"),
        }))}
      />
    </>
  );
}
