"use client";
import React from "react";
import {
  CalendarIcon,
  ClipboardIcon,
  UserPlusIcon,
  ActivityIcon,
  PillIcon,
  BarChartIcon,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useMediaQuery } from "@/hooks/use-media-query";

const QuickLinks = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      {isDesktop ? (
        <div className="grid col-span-3 md:col-span-6 lg:col-span-3 grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3">
          {[
            "Register Patient",
            "Appointments",
            "Prescriptions",
            "Lab Results",
            "Pharmacy",
            "Reports",
          ].map((item, index) => {
            return <PageSlider key={index} index={index} item={item} />;
          })}
        </div>
      ) : (
        <div className="col-span-3 flex items-center justify-center">
          <Carousel
            className="w-full"
            opts={{
              loop: true,
              slidesToScroll: 2,
            }}
          >
            <CarouselContent className="m-0">
              {[
                "Register Patient",
                "Appointments",
                "Prescriptions",
                "Lab Results",
                "Pharmacy",
                "Reports",
              ].map((item, index) => {
                return (
                  <CarouselItem
                    key={index}
                    className={`basis-[40%] sm:basis-[32%] px-1 sm:px-1.5`}
                  >
                    <PageSlider index={index} item={item} />
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </>
  );
};

export default QuickLinks;

const IconMapping = [
  UserPlusIcon,
  CalendarIcon,
  ClipboardIcon,
  ActivityIcon,
  PillIcon,
  BarChartIcon,
];
const ColorMapping = [
  "bg-gradient-to-t from-purple-500/20 to-purple-500/10",
  "bg-gradient-to-t from-primary/20 to-primary/10",
  "bg-gradient-to-t from-blue-500/20 to-blue-500/10",
  "bg-gradient-to-t from-lime-500/20 to-lime-500/10",
  "bg-gradient-to-t from-orange-500/20 to-orange-500/10",
  "bg-gradient-to-t from-amber-500/20 to-amber-500/10",
];

const PageSlider = ({ index, item }: { index: number; item: string }) => {
  const Icon = IconMapping[index];
  return (
    <div
      className={`${ColorMapping[index]} col-span-1 flex flex-col items-center justify-center p-4 sm:p-5 hover:bg-accent/20 border dark:border-0 transition-colors cursor-pointer rounded-lg text-card-foreground shadow`}
    >
      <div className="rounded-full p-3 bg-primary/10 mb-2">
        <Icon className="h-6 w-6 text-ring" />
      </div>
      <h3 className="font-medium text-ring text-center line-clamp-1 text-sm sm:text-base">
        {item}
      </h3>
    </div>
  );
};
