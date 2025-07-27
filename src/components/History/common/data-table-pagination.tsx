import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseAsInteger, useQueryState } from "nuqs";
import React from "react";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  totalRecords: number
}

export function DataTablePagination<TData>({
  table,
  totalRecords
}: DataTablePaginationProps<TData>) {
  const [isLoading, startTransition] = React.useTransition()
  const [page, setPage] = useQueryState(
    'page',
    parseAsInteger.withDefault(1).withOptions({
      startTransition,
      shallow: false // Send updates to the server
    })
  )
  const [pageSize,setPageSize] = useQueryState(
    'pageSize',
    parseAsInteger.withDefault(20).withOptions({
      startTransition,
      shallow: false // Send updates to the server
    })
  )
  const totalPage = Math.ceil(totalRecords/pageSize);
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground hidden sm:block">
        {table.getIsSomeRowsSelected()
          ? `${table.getFilteredSelectedRowModel().rows.length} of ${" "}
        ${table.getFilteredRowModel().rows.length} row(s) selected.`
          : `${table.getFilteredRowModel().rows.length} row(s)`}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium hidden sm:block">Rows per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(parseInt(value))
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {/* Page {table.getState().pagination.pageIndex + 1} of{" "} */}
          Page {page} of{" "} {totalPage}
          {/* {table.getPageCount()} */}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              setPage(1)
              // table.setPageIndex(0)
            }}
            // disabled={!table.getCanPreviousPage()}
            disabled={page<=1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              setPage(page - 1)
              // table.previousPage()
            }}
            // disabled={!table.getCanPreviousPage()}
            disabled={page<=1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => {
              setPage(page + 1)
              // table.nextPage()
            }}
            // disabled={!table.getCanNextPage()}
            disabled={page>=totalPage}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => {
              setPage(totalPage);
              // table.setPageIndex(table.getPageCount() - 1)
            }}
            // disabled={!table.getCanNextPage()}
            disabled={page>=totalPage}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
