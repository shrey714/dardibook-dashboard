import React, { useState } from "react";
import {
  Carousel,
  CarouselMainContainer,
  CarouselNext,
  CarouselPrevious,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
  useCarousel,
} from "./Carousel";
import {
  compareAsc,
  differenceInMinutes,
  endOfDay,
  format,
  max,
  min,
  startOfDay,
} from "date-fns";
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
import { CategoryBar, chartColors } from "../ui/CategoryBar";

interface AvailabilityProps {
  beds: OrgBed[];
  bedPatients: Record<string, BedPatientTypes>;
}
type AvailableChartColorsKeys = keyof typeof chartColors;

const today = new Date();
const days: string[] = [];

for (let i = -15; i <= 15; i++) {
  const date = new Date(today);
  date.setDate(today.getDate() + i);
  days.push(format(date, "d MMM"));
}

const Availability: React.FC<AvailabilityProps> = ({ beds, bedPatients }) => {
  const computeMinutes = (
    beds: OrgBed[],
    activeTab: number,
  )=> {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + activeTab - 15);

    const dayStart = startOfDay(targetDate);
    const dayEnd = endOfDay(targetDate);

    const intervals: [Date, Date,OrgBed][] = [];
    const colors: AvailableChartColorsKeys[] = [];

    for (const bookingDetail of beds) {
      const slotStart = max([new Date(bookingDetail.admission_at), dayStart]);
      const slotEnd = min([new Date(bookingDetail.discharge_at), dayEnd]);

      if (compareAsc(slotStart, slotEnd) < 0) {
        intervals.push([slotStart, slotEnd,bookingDetail]);
      }
    }

    intervals.sort(([a], [b]) => compareAsc(a, b));

    const result: number[] = [];
    const bookingDetails: (OrgBed|undefined)[] = [];
    let current = dayStart;

    for (const [start, end,bookingDetail] of intervals) {
      const free = differenceInMinutes(start, current);

      if (result.length === 0) {
        result.push(free); // first free slot (can be 0)
        colors.push("emerald");
        bookingDetails.push(undefined);
      } else if (free > 0) {
        result.push(free); // next free slot
        bookingDetails.push(undefined);
      }

      result.push(differenceInMinutes(end, start)); // occupied
      differenceInMinutes(new Date(),start) ? colors.push("pink"):colors.push("gray");
      bookingDetails.push(bookingDetail);
      console.log(result);
      current = end;
    }

    const remaining = differenceInMinutes(dayEnd, current);
    if (remaining > 0) {
      result.push(remaining);
      colors.push("emerald");
    }

    return {bookingDetails,colors,result};
  };
  const [activeTab, setActiveTab] = useState<number>(15);
  const {bookingDetails,colors,result} = computeMinutes(beds,activeTab);
  return (
    <Carousel className="py-3">
      <CarouselMainContainer className="h-1">
        {days.map((date, index) => {
          return <SliderMainItem key={index}></SliderMainItem>;
        })}
      </CarouselMainContainer>
      <CategoryBar
        bookingDetails={bookingDetails}
        bedPatients={bedPatients}
        values={result}
        marker={
          activeTab == 15
            ? {
                value: differenceInMinutes(
                  new Date().getTime(),
                  startOfDay(today)
                ),
                tooltip: format(new Date().getTime(), "HH:mm").toString(),
                showAnimation: true,
              }
            : undefined
        }
        colors={colors}
        className="mx-auto w-full"
      />
      <CarouselThumbsContainer>
        {days.map((date, index) => (
          <SliderThumbItem
            key={index}
            index={index}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            className="bg-transparent"
          >
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
