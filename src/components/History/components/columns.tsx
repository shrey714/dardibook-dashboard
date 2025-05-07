"use client";

import { ColumnDef } from "@tanstack/react-table";

// import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// import { labels, priorities, statuses } from "../data/data";
import { Patient } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import Link from "next/link";
import { CalendarIcon, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/CopyToClipboard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const columns: ColumnDef<Patient>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "patient_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="patient_id" />
    ),
    cell: ({ row }) => (
      <div
        className="min-w-[80px] align-middle flex gap-2 flex-row items-center"
        style={{ verticalAlign: "middle" }}
      >
        {row.getValue("patient_id")}
        <CopyButton className="align-middle z-0" value={row.getValue("patient_id")} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("name")} {row.original.name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "mobile",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Number" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("mobile")}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="gender" />
    ),
    cell: ({ row }) => (
      <div className="space-x-2">{row.getValue("gender")}</div>
    ),
    enableSorting: false,
    enableGlobalFilter: false,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="min-w-min align-middle flex gap-2 flex-row items-center">
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                className="flex h-8 w-8 p-0 border-green-500 bg-green-500/10 text-green-600 hover:bg-green-500/20"
                asChild
              >
                <Link
                  href={{
                    pathname: "appointment/appointmentForm",
                    query: { patientId: row.getValue("patient_id") },
                  }}
                  type="button"
                >
                  <CalendarIcon />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Register</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-8 w-8 p-0 data-[state=open]:bg-muted border-border border"
                asChild
              >
                <Link
                  href={{
                    pathname: "history/patientHistory",
                    query: { patientId: row.getValue("patient_id") },
                  }}
                  type="button"
                >
                  <SquareArrowOutUpRight />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
];
