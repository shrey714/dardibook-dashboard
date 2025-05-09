import React from "react";
import { Skeleton } from "../ui/skeleton";

const TableSkeleton = () => {
  return (
    <div className="w-full h-full p-2 gap-2 flex flex-col">
      <div className="grid grid-cols-3 grid-rows-1 gap-2 h-9">
        <Skeleton className="col-span-2"></Skeleton>
        <Skeleton className="col-start-3"></Skeleton>
      </div>

      <div className="w-full border rounded-lg flex flex-1">
        <div className="relative w-full overflow-auto">
          <table className={"w-full caption-bottom text-sm"}>
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors bg-muted/50">
                {[...Array(5)].map((_, i) => (
                  <th
                    key={i}
                    className="h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]"
                  >
                    <Skeleton className="h-3 w-[100px]" />
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="[&_tr:last-child]:border-0">
              {[...Array(10)].map((_, i) => (
                <tr key={i} className="border-b">
                  {[...Array(5)].map((_, i) => (
                    <td key={i} className="p-2 align-middle h-min">
                      <Skeleton className="h-5 w-[100px]" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-12 grid-rows-1 gap-2 h-8">
        <Skeleton className="col-span-3"></Skeleton>
        <Skeleton className="col-start-12 row-start-1"></Skeleton>
        <Skeleton className="col-start-11 row-start-1"></Skeleton>
        <Skeleton className="col-start-10 row-start-1"></Skeleton>
        <Skeleton className="col-span-2 col-start-8 row-start-1"></Skeleton>
      </div>
    </div>
  );
};

export default TableSkeleton;
