"use client";

import {
  Calendar1Icon,
  CalendarIcon,
  CheckCheck,
  CircleX,
  ClipboardPlusIcon,
  MoreHorizontal,
  XIcon,
} from "lucide-react";
import { db } from "@/firebase/firebaseConfig";
import { Button } from "@/components/ui/button";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
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
import { useAuth, useOrganization } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { format, getTime, startOfDay } from "date-fns";
import { orgUserType, ScheduledPatientTypes } from "@/types/FormTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

interface UserReOrderMenuProps {
  patient: ScheduledPatientTypes;
  matchingDate: Date;
  disabled?: boolean;
  customClassName?: string;
  insideText?: string;
}

export const UserReOrderMenu: React.FC<UserReOrderMenuProps> = ({
  patient,
  matchingDate,
  disabled,
  customClassName,
  insideText,
}) => {
  const patient_matching_reg_date =
    patient.registered_date.find(
      (date) => new Date(date).toDateString() === matchingDate.toDateString()
    ) ?? 0;

  const patient_matching_reg_date_time =
    patient.registered_date_time.find(
      (date_time) =>
        getTime(startOfDay(date_time)) === getTime(startOfDay(matchingDate))
    ) ?? 0;

  const { orgId } = useAuth();
  const [date, setDate] = useState<Date>(
    new Date(patient_matching_reg_date_time)
  );
  const [menuLoader, setMenuLoader] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  const { memberships } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
      role: ["org:doctor", "org:clinic_head"],
    },
  });

  useEffect(() => {
    setDate(new Date(patient_matching_reg_date_time));
  }, [patient_matching_reg_date_time]);

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
        doc(db, "doctor", orgId, "patients", patient.patient_id),
        {
          registered_date: patient.registered_date.map((registered_date) =>
            patient_matching_reg_date === registered_date
              ? getTime(startOfDay(date))
              : registered_date
          ),
          registered_date_time: patient.registered_date_time.map(
            (registered_date_time) =>
              patient_matching_reg_date_time === registered_date_time
                ? getTime(date)
                : registered_date_time
          ),
        }
      );
      setMenuLoader(false);
    }
  };

  const cancelAppointment = async () => {
    if (orgId) {
      setMenuLoader(true);
      await updateDoc(
        doc(db, "doctor", orgId, "patients", patient.patient_id),
        {
          registered_date: arrayRemove(patient_matching_reg_date),
          registered_date_time: arrayRemove(patient_matching_reg_date_time),
        }
      );
      setMenuLoader(false);
    }
  };

  const handleDoctorChange = async (doctor: orgUserType) => {
    if (orgId) {
      setMenuLoader(true);
      await updateDoc(
        doc(db, "doctor", orgId, "patients", patient.patient_id),
        {
          registerd_for: doctor,
        }
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
          className={cn(
            "flex h-8 w-8 p-0 data-[state=open]:bg-muted border rounded-full",
            customClassName
          )}
        >
          {menuLoader ? (
            <Loader size="small" />
          ) : (
            <>
              <MoreHorizontal /> {insideText}
            </>
          )}
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="left" align="center" className="min-w-[160px]">
        <DropdownMenuLabel className="border-b border-green-600 text-green-600">
          Reschedule - {patient.name}
        </DropdownMenuLabel>
        <div className="sm:flex my-1 border rounded-md">
          <Calendar
            className="justify-self-center"
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={{ before: new Date() }}
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
            "w-full justify-start text-left font-normal mb-1 cursor-default hover:bg-transparent",
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
          disabled={
            new Date(patient_matching_reg_date_time).toString() ===
            date.toString()
          }
          onClick={() => {
            setDate(new Date(new Date(patient_matching_reg_date_time)));
          }}
          className="font-medium border-0 bg-red-500/10 text-red-600 hover:!text-red-600 hover:!bg-red-500/20 flex items-center justify-center relative float-right"
        >
          <ResetIcon />
          Reset
        </Button>
        <DropdownMenuItem asChild>
          <Button
            disabled={
              new Date(patient_matching_reg_date_time).toString() ===
              date.toString()
            }
            onClick={() => {
              rescheduleFn();
            }}
            className="cursor-pointer font-medium border-0 bg-green-500/10 text-green-600 hover:!text-green-600 hover:!bg-green-500/20 flex items-center justify-center"
          >
            <Calendar1Icon />
            Submit
          </Button>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <div className="flex items-center w-full relative">
          <motion.button
            disabled={confirming || menuLoader}
            className={`${
              confirming ? "" : "hover:!bg-red-500/20"
            } font-medium flex items-center justify-center gap-2 py-2 bg-red-500/10 text-red-600 rounded-lg overflow-hidden transition-colors`}
            onClick={() => setConfirming(!confirming)}
            initial={{ width: "100%" }}
            animate={{ width: confirming ? "66%" : "100%" }}
            transition={{ duration: 0.3 }}
          >
            {confirming ? (
              "Are you Sure?"
            ) : (
              <>
                <XIcon />
                Cancel Appointment
              </>
            )}
          </motion.button>
          <motion.div
            initial={{
              opacity: 0,
              display: "none",
              translateX: "100%",
            }}
            animate={{
              opacity: confirming ? 1 : 0,
              display: confirming ? "flex" : "none",
              translateX: confirming ? 0 : "100%",
            }}
            exit={{ opacity: 0, display: "none", translateX: "100%" }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 w-[34%] flex h-full items-center justify-center flex-row gap-x-1 px-1"
          >
            <DropdownMenuItem
              className="flex-1 cursor-pointer bg-destructive focus:bg-destructive/90"
              asChild
            >
              <Button
                variant={"destructive"}
                className="rounded-lg flex flex-1 items-center justify-center h-full"
                onClick={() => cancelAppointment()}
                disabled={menuLoader}
              >
                <CheckCheck size={18} />
              </Button>
            </DropdownMenuItem>
            <Button
              variant={"secondary"}
              className="rounded-lg flex flex-1 items-center justify-center h-full px-2"
              onClick={() => setConfirming(false)}
              disabled={menuLoader}
            >
              <CircleX size={18} />
            </Button>
          </motion.div>
        </div>

        <DropdownMenuSeparator />

        <div className="w-full flex flex-row gap-x-1">
          <span className="bg-green-500/10 flex h-auto px-2 rounded-md aspect-square items-center justify-center">
            <ClipboardPlusIcon size={20} className="text-green-500" />
          </span>
          <Select
            disabled={menuLoader}
            // (patient.registerd_by.id !== user?.id &&
            //   patient.registerd_for.id !== user?.id) ||
            required
            defaultValue={patient.registerd_for.id}
            name="registerd_for"
            onValueChange={(val) => {
              const member = memberships?.data?.find(
                (mem) => mem.publicUserData.userId === val
              );

              if (member && member.publicUserData.userId) {
                const {
                  userId,
                  firstName = "",
                  lastName = "",
                  identifier,
                } = member.publicUserData;

                const fullName = [firstName, lastName]
                  .filter(Boolean)
                  .join(" ");
                const selectedMember = {
                  id: userId,
                  name: fullName,
                  email: identifier,
                };
                handleDoctorChange(selectedMember);
              }
            }}
          >
            <SelectTrigger
              id="registerd_for"
              className="w-full md:max-w-md lg:col-span-2 disabled:text-primary shadow-sm rounded-md border-border bg-transparent form-input py-1 pl-2 sm:text-sm sm:leading-6"
            >
              <SelectValue placeholder="Doctor" />
            </SelectTrigger>
            <SelectContent>
              {memberships &&
                memberships.data?.map((member, index) =>
                  member.publicUserData.userId ? (
                    <SelectItem
                      value={member.publicUserData.userId}
                      key={index}
                    >
                      {[
                        member.publicUserData.firstName,
                        member.publicUserData.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    </SelectItem>
                  ) : (
                    <></>
                  )
                )}
            </SelectContent>
          </Select>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
