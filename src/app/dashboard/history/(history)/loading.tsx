import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full grid auto-rows-[22rem] lg:grid-cols-3 gap-4 lg:grid-rows-4 p-4 min-h-full">
      <Skeleton className="lg:row-span-2 lg:col-span-1" />
      <Skeleton className="lg:row-span-4 lg:col-span-1" />
      <Skeleton className="lg:row-span-2 lg:col-span-1" />
      <Skeleton className="lg:row-span-2 lg:col-span-1" />
      <Skeleton className="lg:row-span-2 lg:col-span-1" />
    </div>
  );
}
