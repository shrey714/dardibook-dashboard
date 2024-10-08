import React from "react";
import QueueList from "@/components/Prescribe/QueueList";
export default function Prescribe() {
  return (
    <div className=" w-full lg:w-3/4 lg:ml-[12.5%] self-center py-12 flex flex-1 justify-start flex-col items-center px-4 sm:px-6 lg:px-8">
      <QueueList />
    </div>
  );
}
