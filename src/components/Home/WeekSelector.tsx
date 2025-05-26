"use client";
import React, { startTransition } from "react";
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
  const [date, setDate] = React.useState<Date>(new Date());
  const [currentWeekStart, setCurrentWeekStart] = React.useState<Date>(
    startOfWeek(new Date())
  );
  const weekEnd = endOfWeek(currentWeekStart);
  React.useEffect(() => {
    const weekStart = startOfWeek(date);
    setCurrentWeekStart(weekStart);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("weekDate", getTime(weekStart).toString());
    startTransition(() => {
      router.replace(`?${newSearchParams.toString()}`, {
        scroll: false,
      });
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
};

export default WeekSelector;
