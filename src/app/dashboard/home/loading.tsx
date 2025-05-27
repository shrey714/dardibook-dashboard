import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-1 py-2 gap-2 sm:p-2 sm:py-3 sm:gap-3 md:p-3 flex flex-col">
      <div className="w-full flex flex-row gap-2 sm:gap-3 items-center justify-end">
        <div className="flex flex-row h-full w-[90%] mx-auto sm:mx-0 sm:w-[268px] shadow-sm rounded-md overflow-hidden">
          <Skeleton className="bg-muted w-full h-9" />
        </div>
      </div>
      <div className="grid auto-rows-auto grid-cols-3 gap-2 sm:gap-3 md:grid-cols-6 lg:grid-cols-9">
        <Skeleton className="bg-transparent bg-gradient-to-b from-muted to-muted/50 col-span-3 lg:col-span-2 h-[158px] lg:h-[172px]" />
        <Skeleton className="bg-transparent bg-gradient-to-b from-muted to-muted/50 col-span-3 hidden md:block lg:col-span-2 h-[158px] lg:h-[172px]" />
        <Skeleton className="bg-transparent bg-gradient-to-b from-muted to-muted/50 col-span-3 hidden md:block lg:col-span-2 h-[158px] lg:h-[172px]" />
        <Skeleton className="bg-transparent bg-gradient-to-b from-muted to-muted/50 col-span-3 hidden md:block h-[158px] lg:h-[172px]" />

        <div className="grid col-span-3 md:col-span-6 lg:col-span-3 grid-cols-3 lg:grid-cols-2 gap-2 sm:gap-3">
          <Skeleton className="bg-muted/50 col-span-1 h-[112px] lg:h-[158px]" />
          <Skeleton className="bg-muted/50 col-span-1 h-[112px] lg:h-[158px]" />
          <Skeleton className="bg-muted/50 col-span-1 h-[112px] lg:h-[158px]" />
          <Skeleton className="bg-muted/50 col-span-1 hidden md:block h-[112px] lg:h-[158px]" />
          <Skeleton className="bg-muted/50 col-span-1 hidden md:block h-[112px] lg:h-[158px]" />
          <Skeleton className="bg-muted/50 col-span-1 hidden md:block h-[112px] lg:h-[158px]" />
        </div>

        <Skeleton className="bg-muted/50 col-span-3 md:col-span-6 min-h-[354px]" />

        <Skeleton className="bg-transparent bg-gradient-to-t from-muted via-muted/50 to-muted/50 col-span-3 md:col-span-6 lg:col-span-3 h-[calc(100svh-203px)] lg:h-[613px]" />
        <Skeleton className="bg-transparent bg-gradient-to-t from-muted via-muted/50 to-muted/50 col-span-3 hidden lg:block h-[calc(100svh-203px)] lg:h-[613px]" />
        <Skeleton className="bg-transparent bg-gradient-to-t from-muted via-muted/50 to-muted/50 col-span-3 hidden lg:block h-[calc(100svh-203px)] lg:h-[613px]" />
      </div>
    </div>
  );
}
