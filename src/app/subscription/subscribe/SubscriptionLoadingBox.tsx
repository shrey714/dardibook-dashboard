import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonBox = () => {
  return (
    <div className="flex flex-col w-full items-center h-full">
      <div className="grid w-full max-w-6xl gap-4 sm:grid-cols-2 xl:grid-cols-3 mb-4">
        <Skeleton className="h-80"></Skeleton>
        <Skeleton className="h-80"></Skeleton>
        <Skeleton className="h-80"></Skeleton>
      </div>

      <Skeleton className="h-8 w-1/4 mb-4"></Skeleton>
      <Skeleton className="h-6 w-3/4"></Skeleton>
      <Skeleton className="my-8 h-9 w-1/3"></Skeleton>

      <div className="mb-8 space-y-4 w-1/2 self-start">
        <Skeleton className="h-6"></Skeleton>
        <Skeleton className="h-6"></Skeleton>
      </div>

      <Skeleton className="h-8 w-full"></Skeleton>
    </div>
  );
};

export default SkeletonBox;
