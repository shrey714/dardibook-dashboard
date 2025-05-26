"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { addDays, format, startOfWeek, endOfWeek, getTime } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useRouter, useSearchParams } from "next/navigation";

const WeekSelector = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialDate = React.useMemo(() => {
    return new Date(Number(searchParams.get("weekDate")) || Date.now());
  }, [searchParams]);

  const [date, setDate] = React.useState(initialDate);
  const weekStart = startOfWeek(date);
  const weekEnd = endOfWeek(weekStart);

  useEffect(() => {
    setDate(initialDate);
  }, [initialDate]);

  const updateURL = (newDate: Date) => {
    setDate(newDate);
    const newWeekStart = startOfWeek(newDate);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("weekDate", getTime(newWeekStart).toString());
    router.push(`?${newSearchParams.toString()}`); // triggers SSR + loading.tsx
  };

  const previousWeek = () => {
    const newDate = addDays(date, -7);
    setDate(newDate);
    updateURL(newDate);
  };

  const nextWeek = () => {
    const newDate = addDays(date, 7);
    setDate(newDate);
    updateURL(newDate);
  };

  const modifiers = {
    inSelectedWeek: {
      from: startOfWeek(date),
      to: endOfWeek(date),
    },
  };

  const modifiersStyles = {
    inSelectedWeek: {
      backgroundColor: "hsl(var(--muted-foreground))",
      color: "hsl(var(--primary-foreground))",
    },
  };
  return (
    <Popover>
      <div className="flex flex-row h-full w-full sm:w-auto shadow-sm rounded-md overflow-hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={previousWeek}
          className="size-9 rounded-r-none bg-border shadow-none"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous week</span>
        </Button>
        <PopoverTrigger className="border-y px-2 w-full sm:w-auto bg-border hover:bg-accent transition-colors ">
          <div className="text-sm font-medium text-muted-foreground min-w-44 w-full sm:w-min leading-normal">
            {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
          </div>
        </PopoverTrigger>
        <Button
          variant="outline"
          size="icon"
          onClick={nextWeek}
          className="size-9 rounded-l-none bg-border shadow-none"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next week</span>
        </Button>
      </div>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          defaultMonth={date}
          mode="single"
          onSelect={(newDate) => newDate && updateURL(newDate)}
          className="rounded-md border"
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
        />
      </PopoverContent>
    </Popover>
  );
};

export default WeekSelector;
