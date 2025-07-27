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
import { AnimatePresence, motion } from "framer-motion";

const WeekSelector = () => {
  const slideVariants = {
    enter: (direction: "next" | "prev") => ({
      x: direction === "next" ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: (direction: "next" | "prev") => ({
      x: direction === "next" ? -100 : 100,
      opacity: 0,
      transition: { duration: 0.2 },
    }),
  };
  const [direction, setDirection] = React.useState<"next" | "prev">("next");

  // actual from here
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialDate = React.useMemo(() => {
    return new Date(Number(searchParams.get("weekDate")) || Date.now());
  }, [searchParams]);

  const [date, setDate] = React.useState(initialDate);
  const [disableBtns, setDisableBtns] = React.useState(false);
  const weekStart = startOfWeek(date, {
    weekStartsOn: 1,
  });
  const weekEnd = endOfWeek(weekStart, {
    weekStartsOn: 1,
  });

  useEffect(() => {
    setDate(initialDate);
    setDisableBtns(false);
  }, [initialDate]);

  const updateURL = (newDate: Date) => {
    setDirection(newDate >= date ? "next" : "prev");
    setDate(newDate);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("weekDate", getTime(newDate).toString());
    router.push(`?${newSearchParams.toString()}`); // triggers SSR + loading.tsx
    setDisableBtns(true);
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
      from: startOfWeek(date, {
        weekStartsOn: 1,
      }),
      to: endOfWeek(date, {
        weekStartsOn: 1,
      }),
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
      <div className="flex flex-row h-full w-[90%] mx-auto sm:mx-0 sm:w-auto shadow-sm rounded-md overflow-hidden">
        <Button
          disabled={disableBtns}
          variant="outline"
          size="default"
          onClick={previousWeek}
          className="h-9 rounded-r-none bg-border shadow-none text-muted-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous week</span>
        </Button>
        <PopoverTrigger
          disabled={disableBtns}
          className="border-y px-2 w-full sm:w-auto bg-border hover:bg-accent transition-colors disabled:pointer-events-none disabled:opacity-50"
        >
          <div className="text-sm font-medium text-muted-foreground min-w-44 w-full sm:w-min leading-normal h-full flex items-center justify-center relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={weekStart.getTime()}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute w-full text-center"
              >
                {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
              </motion.div>
            </AnimatePresence>
          </div>
        </PopoverTrigger>
        <Button
          disabled={disableBtns}
          variant="outline"
          size="default"
          onClick={nextWeek}
          className="h-9 rounded-l-none bg-border shadow-none text-muted-foreground"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next week</span>
        </Button>
      </div>
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          weekStartsOn={1}
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
