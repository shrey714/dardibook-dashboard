"use client";

import {
  Calendar1Icon,
  CalendarIcon,
  MoreHorizontal,
  XIcon,
} from "lucide-react";
import { db } from "@/firebase/firebaseConfig";
import { Button } from "@/components/ui/button";
import { doc, updateDoc } from "firebase/firestore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { Calendar } from "../ui/calendar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ResetIcon } from "@radix-ui/react-icons";
import Loader from "../common/Loader";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function UserReOrderMenu({ item, disabled }: any) {
  const { orgId } = useAuth();
  const [date, setDate] = useState<Date>(new Date(item.last_visited));
  const [menuLoader, setMenuLoader] = useState(false);
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  useEffect(() => {
    setDate(new Date(item.last_visited));
  }, [item.last_visited]);

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    value: string
  ) => {
    if (date) {
      const newDate = new Date(date);
      if (type === "hour") {
        newDate.setHours(
          (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
        );
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      } else if (type === "ampm") {
        const currentHours = newDate.getHours();
        newDate.setHours(
          value === "PM" ? currentHours + 12 : currentHours - 12
        );
      }
      setDate(newDate);
    }
  };

  const rescheduleFn = async () => {
    if (orgId) {
      setMenuLoader(true);
      await updateDoc(
        doc(db, "doctor", orgId, "patients", item.patient_unique_Id),
        { last_visited: new Date(date).getTime() }
      );
      setMenuLoader(false);
    }
  };

  const cancelAppointment = async () => {
    if (orgId) {
      setMenuLoader(true);
      await updateDoc(
        doc(db, "doctor", orgId, "patients", item.patient_unique_Id),
        { last_visited: 0 }
      );
      setMenuLoader(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          disabled={disabled}
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted border rounded-full"
        >
          {menuLoader ? <Loader size="small" /> : <MoreHorizontal />}
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="center" className="min-w-[160px]">
        <DropdownMenuLabel className="border-b border-green-600 text-green-600">
          Reschedule
        </DropdownMenuLabel>
        <div className="sm:flex my-1 border rounded-md">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={
                      date && date.getHours() % 12 === hour % 12
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 61 }, (_, i) => i).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={
                      date && date.getMinutes() === minute ? "default" : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() =>
                      handleTimeChange("minute", minute.toString())
                    }
                  >
                    {minute}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="">
              <div className="flex sm:flex-col p-2">
                {["AM", "PM"].map((ampm) => (
                  <Button
                    key={ampm}
                    size="icon"
                    variant={
                      date &&
                      ((ampm === "AM" && date.getHours() < 12) ||
                        (ampm === "PM" && date.getHours() >= 12))
                        ? "default"
                        : "ghost"
                    }
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("ampm", ampm)}
                  >
                    {ampm}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal mb-1",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "dd/MM/yyyy hh:mm aa")
          ) : (
            <span>DD/MM/YYYY hh:mm aa</span>
          )}
        </Button>

        <Button
          disabled={new Date(item.last_visited).toString() === date.toString()}
          onClick={() => {
            setDate(new Date(item.last_visited));
          }}
          className="font-medium border-0 bg-red-500/10 text-red-600 hover:!text-red-600 hover:!bg-red-500/20 flex items-center justify-center relative float-right"
        >
          <ResetIcon />
          Reset
        </Button>
        <DropdownMenuItem asChild>
          <Button
            disabled={
              new Date(item.last_visited).toString() === date.toString()
            }
            onClick={() => {
              rescheduleFn();
            }}
            className="font-medium border-0 bg-green-500/10 text-green-600 hover:!text-green-600 hover:!bg-green-500/20 flex items-center justify-center"
          >
            <Calendar1Icon />
            Submit
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Button
            onClick={() => {
              cancelAppointment();
            }}
            className="font-medium w-full border-0 bg-red-500/10 text-red-600 hover:!text-red-600 hover:!bg-red-500/20 flex items-center justify-center"
          >
            <XIcon />
            Cancel Appointment
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
