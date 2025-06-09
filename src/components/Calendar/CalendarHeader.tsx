import { ReactElement, RefObject, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import { Button } from "../ui/button";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isThisMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { SidebarTrigger } from "../ui/calendarSidebar";

export type TCalendarHeader = {
  calendarRef: RefObject<FullCalendar>;
};

export const CalendarHeader = ({
  calendarRef,
}: TCalendarHeader): ReactElement => {
  const handleDateChange = (direction: "prev" | "today" | "next"): void => {
    const calApi = calendarRef.current?.getApi();

    if (calApi) {
      if (direction === "prev") {
        calApi.prev();
      } else if (direction === "next") {
        calApi.next();
      } else {
        calApi.today();
      }

      //   setDate(moment(calApi.getDate()));
    }
  };

  useEffect(() => {
    const calApi = calendarRef.current?.getApi();

    if (calApi) {
      setDate(calApi.getDate());
    }
  }, [calendarRef]);

  const [date, setDate] = useState<Date>();

  return (
    <header className="flex flex-row h-10 px-1 sm:px-0 w-full">
      <div className="flex flex-1 h-full flex-row gap-1 items-center">
        <Button
          data-trackid="prev-button"
          size="icon"
          variant="secondary"
          onClick={(): void => handleDateChange("prev")}
        >
          <ChevronLeftIcon />
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="secondary"
              className={cn(
                "min-w-[180px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="flex flex-1">
                {date ? format(date, "MMM yyyy") : "Pick a month"}
              </span>
              <ChevronDownIcon className="ml-0 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (d) {
                  setDate(d);
                  calendarRef.current?.getApi().gotoDate(d);
                } else {
                  setDate(date);
                }
              }}
            />
          </PopoverContent>
        </Popover>

        <Button
          data-trackid="next-button"
          size="icon"
          variant="secondary"
          onClick={(): void => handleDateChange("next")}
        >
          <ChevronRightIcon />
        </Button>

        <Button
          data-trackid="today-button"
          size="icon"
          variant="link"
          className="ml-2 text-xs sm:text-sm"
          disabled={date && isThisMonth(date)}
          onClick={(): void => handleDateChange("today")}
        >
          Today
        </Button>
      </div>

      <div className="flex h-full items-center">
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <SidebarTrigger
                size="icon"
                variant="ghost"
                className="h-9 w-9"
              />
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Calendar</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  );
};
