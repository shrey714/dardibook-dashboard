import React from "react";
import {
  Carousel,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
} from "./Carousel";
import { endOfDay, format, max, min, startOfDay } from "date-fns";
import { HoverCard, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { HoverCardContent } from "../ui/hover-card";
import { BedPatientTypes, OrgBed } from "@/types/FormTypes";
import {
  BriefcaseMedicalIcon,
  CalendarMinusIcon,
  CalendarPlusIcon,
  LogOut,
  PencilLineIcon,
  PhoneIcon,
} from "lucide-react";

interface AvailabilityProps {
  beds: OrgBed[];
  bedPatients: Record<string, BedPatientTypes>;
}

const today = new Date();
const days: string[] = [];

for (let i = -15; i <= 15; i++) {
  const date = new Date(today);
  date.setDate(today.getDate() + i);
  days.push(format(date, "d MMM"));
}

const totalHoursInDay = 24;

const Availability: React.FC<AvailabilityProps> = ({ beds, bedPatients }) => {
  console.log(beds);
  console.log(bedPatients);

  return (
    <Carousel className="py-3">
      <CarouselNext className="top-1/3 -translate-y-1/3" />
      <CarouselPrevious className="top-1/3 -translate-y-1/3" />
      <CarouselMainContainer className="h-32">
        {days.map((date, index) => {
          const currentDay = new Date(today);
          currentDay.setDate(today.getDate() + index - 15); 
        
          const startOfCurrentDay = startOfDay(currentDay);
          const endOfCurrentDay = endOfDay(currentDay);
          return <SliderMainItem key={index} className="bg-transparent">
            <div className="outline outline-1 outline-border size-full flex items-center justify-center rounded-xl bg-background">
              <div className="w-[192rem] h-full overflow-x-scroll flex relative">
                {[...Array(24).keys()].map((hour) => (
                    <div
                    key={hour}
                    className="h-full w-32 shrink-0 flex items-center"
                  >
                    <div className="border-2 border-green-500 h-1 w-full relative">
                    <div className="absolute left-0 top-4">
                      <div className="h-2 border-l-2"></div>
                      <p className="text-xs">{(hour)%12}:00 {hour<12?"AM":"PM"}</p>
                    </div>
                    </div>
                    
                  </div>
                  
                ))}
                {beds.map((bed, index) => {
                  const now = new Date();
                  const originalStart = new Date(bed.admission_at);
                  const originalEnd = new Date(bed.discharge_at);

                  const isDischargeInPastButNotMarked =
                    originalEnd < now && !bed.dischargeMarked;

                  const effectiveEnd = isDischargeInPastButNotMarked
                    ? now
                    : originalEnd;
                    const start = max([originalStart, startOfCurrentDay]);
                    const end = min([effectiveEnd, endOfCurrentDay]);

                  if (
                    effectiveEnd <= startOfCurrentDay || // discharged before the day starts
                    originalStart >= endOfCurrentDay      // admitted after the day ends
                  ) {
                    return null;
                  }

                  const startHour = start.getHours();
                  const startMinute = start.getMinutes();
                  const duration =
                    (end.getTime() - start.getTime()) / (1000 * 60 * 60); // duration in hours

                  const startOffset = startHour + startMinute / 60; // fractional start hour (e.g., 9:30 will be 9.5)
                  const bookingWidth = duration; // width proportional to the duration
                  const matchingPatient = bedPatients[bed.patient_id];

                  return (
                    <HoverCard key={index}>
                      <HoverCardTrigger asChild>
                        <div
                          key={index}
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: `${(startOffset / totalHoursInDay) * 192}rem`, 
                            width: `${
                              (bookingWidth / totalHoursInDay) * 192
                            }rem`, 
                          }}
                          className="bg-red-500 h-2 border-2 rounded-sm cursor-pointer"
                        ></div>
                      </HoverCardTrigger>
                      <HoverCardContent
                        className="w-auto bg-muted p-2 z-[1000]"
                        sideOffset={20}
                        asChild={false}
                      >
                        <div className="flex flex-row gap-x-4">
                          <div className="flex flex-col items-start space-y-1">
                            <h4 className="text-sm font-semibold">
                              Id : {bed.patient_id}
                            </h4>
                            <h4 className="text-sm font-semibold">
                              Name : {matchingPatient.name}
                            </h4>
                            <h4 className="text-sm font-semibold">
                              Gender : {matchingPatient.gender}
                            </h4>
                            <h4 className="text-sm font-semibold">
                              Age : {matchingPatient.age}
                            </h4>
                            <p className="flex text-sm items-center gap-2">
                              <PhoneIcon size={16} className="text-primary" />{" "}
                              {matchingPatient.mobile}
                            </p>
                          </div>
                          <div className="flex flex-col items-start space-y-1">
                            <p className="flex bg-blue-600/10 text-blue-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-t-sm">
                              <PencilLineIcon size={16} />{" "}
                              {bed.admission_by.name}
                            </p>
                            <p className="!mt-0 flex bg-green-500/10 text-green-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-b-sm">
                              <BriefcaseMedicalIcon size={16} />{" "}
                              {bed.admission_for.name}
                            </p>
                            <p className="flex bg-green-500/10 text-green-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-t-sm">
                              <CalendarPlusIcon size={16} />{" "}
                              {bed.admission_at &&
                                format(bed.admission_at, "dd-MM-yyyy hh:mm aa")}
                            </p>
                            <p className="!mt-0 bg-red-500/10 text-red-600 flex text-sm items-center gap-2 px-2 py-1 w-full rounded-b-sm">
                              <CalendarMinusIcon size={16} />{" "}
                              {bed.discharge_at &&
                                format(bed.discharge_at, "dd-MM-yyyy hh:mm aa")}
                            </p>
                          </div>
                        </div>
                        {bed.dischargeMarked ? (
                          <div className="bg-red-500/10 mt-2 w-full rounded-md text-red-600 flex flex-row gap-4 px-3 py-1 items-center">
                            <LogOut className="w-5 h-5" /> Discharged by{" "}
                            {bed.discharged_by.name}
                          </div>
                        ) : (
                          <></>
                        )}
                      </HoverCardContent>
                    </HoverCard>
                  );
                })}
              </div>
            </div>
          </SliderMainItem>
})}
      </CarouselMainContainer>
      <CarouselThumbsContainer>
        {days.map((date, index) => (
          <SliderThumbItem key={index} index={index} className="bg-transparent">
            <div className="outline outline-1 outline-border size-full flex items-center justify-center rounded-xl bg-background text-xs sm:text-base">
              {date}
            </div>{" "}
          </SliderThumbItem>
        ))}
      </CarouselThumbsContainer>
    </Carousel>
  );
};

export default Availability;
