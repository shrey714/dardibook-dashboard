import React from "react";
import QueueList from "@/components/Prescribe/QueueList";
import StatsHeader from "@/components/Prescribe/StatsHeader";
import CurrentBedPatients from "@/components/Prescribe/CurrentBedPatients";
export default function Prescribe() {
  return (
    <div className="px-2 pt-2 sm:gap-x-1 w-full h-full flex flex-row justify-center">
      <div className="pt-0 sm:pt-3 pl-0 sm:pl-3 flex flex-1 flex-col relative h-full w-full overflow-hidden self-center space-y-3 md:space-y-4 items-center overflow-y-hidden">
        <StatsHeader />

        <div className="max-w-4xl w-full p-0 flex flex-row items-center mt-1">
          <span className="flex flex-1 h-[2px] bg-gradient-to-r from-transparent to-muted-foreground"></span>
          <div className=" flex items-center justify-center">
            <p className="w-auto px-3 py-1 font-medium text-base rounded-full border-muted-foreground border-[2px] text-muted-foreground">
              Doctor&apos;s Space
            </p>
          </div>
          <span className="flex flex-1 h-[2px] bg-gradient-to-l from-transparent to-muted-foreground"></span>
        </div>
        <QueueList />
      </div>
      <CurrentBedPatients />
    </div>
  );
}
