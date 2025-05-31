"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableFacetedFilter } from "../common/data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

const prescriptionStatus = [
  {
    value: "YES",
    label: "Prescribed",
  },
  {
    value: "NO",
    label: "Not Prescribed",
  },
];

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    table.getState().globalFilter.length > 0;
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={`Filter Registrations...`}
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) =>
            table.setGlobalFilter(String(event.target.value))
          }
          className="h-8 max-w-[400px] w-full truncate"
        />
        {table.getColumn("is_prescribed") && (
          <DataTableFacetedFilter
            column={table.getColumn("is_prescribed")}
            title="Prescribed Status"
            options={prescriptionStatus}
          />
        )}
        {isFiltered && (
          <Button
            variant="outline"
            onClick={() => {
              table.resetColumnFilters();
              table.setGlobalFilter("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            <X />
          </Button>
        )}
      </div>
    </div>
  );
}
