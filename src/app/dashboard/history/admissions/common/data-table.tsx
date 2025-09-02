import { flexRender, type Table as TanstackTable } from "@tanstack/react-table";
import type * as React from "react";

import { DataTablePagination } from "./data-table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCommonPinningStyles } from "@/components/History/lib/data-table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData> extends React.ComponentProps<"div"> {
  table: TanstackTable<TData>;
  nextPage: () => void;
  prevPage: () => void;
  canGoBack: boolean;
  canGoNext: boolean;
  totalRecords: number;
  actionBar?: React.ReactNode;
}

export function DataTable<TData>({
  table,
  nextPage,
  prevPage,
  totalRecords,
  canGoBack,
  canGoNext,
  actionBar,
  children,
  className,
  ...props
}: DataTableProps<TData>) {
  return (
    <div
      className={cn("flex w-full flex-col gap-2.5 overflow-auto flex-1", className)}
      {...props}
    >
      {children}
      <div className="overflow-y-auto rounded-md border flex flex-1">
        <Table>
          <TableHeader className="sticky top-0 z-[1] bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50 [&_th:last-child]:border-r-0 [&_th:first-child]:border-l-0">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getCommonPinningStyles({ column: header.column }),
                    }}
                    className="border border-t-0"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="[&_td:last-child]:border-r-0 [&_td:first-child]:border-l-0"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column }),
                      }}
                      className="border"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination
          table={table}
          nextPage={nextPage}
          prevPage={prevPage}
          totalRecords={totalRecords}
          canGoBack={canGoBack}
          canGoNext={canGoNext}
        />
        {actionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          actionBar}
      </div>
    </div>
  );
}
