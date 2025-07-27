"use client";
import React from "react";
import {
  CalendarIcon,
  ClipboardIcon,
  UserPlusIcon,
  PillIcon,
  CalendarDaysIcon,
  HistoryIcon,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useMediaQuery } from "@/hooks/use-media-query";
import Link from "next/link";

export const pages = [
  {
    title: "Register",
    url: "/dashboard/appointment",
    color: "bg-gradient-to-t from-purple-500/20 to-purple-500/10",
    icon: UserPlusIcon,
    roles: ["org:clinic_head", "org:doctor", "org:assistant_doctor"],
  },
  {
    title: "Prescribe",
    url: "/dashboard/prescribe",
    color: "bg-gradient-to-t from-primary/20 to-primary/10",
    icon: ClipboardIcon,
    roles: ["org:clinic_head", "org:doctor"],
  },
  {
    title: "Appointments",
    url: "/dashboard/calendar",
    color: "bg-gradient-to-t from-blue-500/20 to-blue-500/10",
    icon: CalendarIcon,
    roles: ["org:clinic_head", "org:doctor", "org:assistant_doctor"],
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    color: "bg-gradient-to-t from-lime-500/20 to-lime-500/10",
    icon: CalendarDaysIcon,
    roles: ["org:clinic_head", "org:doctor", "org:assistant_doctor"],
  },
  {
    title: "History",
    url: "/dashboard/history",
    color: "bg-gradient-to-t from-orange-500/20 to-orange-500/10",
    icon: HistoryIcon,
    roles: [
      "org:clinic_head",
      "org:doctor",
      "org:assistant_doctor",
      "org:medical_staff",
    ],
  },
  {
    title: "Pharmacy",
    url: "/dashboard/pharmacy",
    color: "bg-gradient-to-t from-amber-500/20 to-amber-500/10",
    icon: PillIcon,
    roles: ["org:clinic_head", "org:medical_staff"],
  },
];

const QuickLinks = ({ role }: { role: string }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      {isDesktop ? (
        <div className="grid col-span-3 md:col-span-6 lg:col-span-3 grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3">
          {pages.map((item, index) => {
            const isAccess = item.roles.includes(role);

            if (isAccess) {
              return (
                <Link
                  href={item.url}
                  key={index}
                  className={`${item.color} text-card-foreground col-span-1 flex flex-col items-center justify-center p-4 sm:p-5 hover:bg-accent/20 border dark:border-0 transition-colors cursor-pointer rounded-lg shadow`}
                >
                  <div className="rounded-full p-3 bg-primary/10 mb-2">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-center line-clamp-1 text-sm sm:text-base">
                    {item.title}
                  </h3>
                </Link>
              );
            } else {
              return (
                <div
                  key={index}
                  className={`${item.color} opacity-50 text-card-foreground col-span-1 flex flex-col items-center justify-center p-4 sm:p-5 border dark:border-0 cursor-not-allowed rounded-lg shadow`}
                >
                  <div className="rounded-full p-3 bg-primary/10 mb-2">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-center line-clamp-1 text-sm sm:text-base">
                    {item.title}
                  </h3>
                </div>
              );
            }
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
              {pages.map((item, index) => {
                const isAccess = item.roles.includes(role);

                return (
                  <CarouselItem
                    key={index}
                    className={`basis-[40%] sm:basis-[32%] px-1 sm:px-1.5`}
                  >
                    {isAccess ? (
                      <Link
                        href={item.url}
                        key={index}
                        className={`${item.color} col-span-1 flex flex-col items-center justify-center p-4 sm:p-5 hover:bg-accent/20 border dark:border-0 transition-colors cursor-pointer rounded-lg text-card-foreground shadow`}
                      >
                        <div className="rounded-full p-3 bg-primary/10 mb-2">
                          <item.icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-medium text-center line-clamp-1 text-sm sm:text-base">
                          {item.title}
                        </h3>
                      </Link>
                    ) : (
                      <div
                        key={index}
                        className={`${item.color} opacity-50 col-span-1 flex flex-col items-center justify-center p-4 sm:p-5 border dark:border-0 cursor-not-allowed rounded-lg text-card-foreground shadow`}
                      >
                        <div className="rounded-full p-3 bg-primary/10 mb-2">
                          <item.icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-medium text-center line-clamp-1 text-sm sm:text-base">
                          {item.title}
                        </h3>
                      </div>
                    )}
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
