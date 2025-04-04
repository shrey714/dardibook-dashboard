import React from "react";
import QueueList from "@/components/Prescribe/QueueList";
import StatsHeader from "@/components/Prescribe/StatsHeader";
export default function Prescribe() {
  return (
    <div className="flex flex-1 flex-col relative h-full w-full overflow-hidden px-2 sm:px-5 self-center pt-3 md:pt-5 space-y-3 md:space-y-4 items-center overflow-y-hidden">
      <StatsHeader />

      <div className="max-w-4xl w-full p-0 flex flex-row items-center mt-1">
        <span className="flex flex-1 h-[2px] bg-gradient-to-r from-transparent to-primary"></span>
        <div className=" flex items-center justify-center">
          <p className="w-auto px-3 py-1 font-medium text-base rounded-full border-primary border-[2px]">
            Doctor&apos;s Space
          </p>
        </div>
        <span className="flex flex-1 h-[2px] bg-gradient-to-l from-transparent to-primary"></span>
      </div>
      <QueueList />
    </div>
  );
}
