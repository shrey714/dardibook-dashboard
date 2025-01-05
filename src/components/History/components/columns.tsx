"use client";

import { ColumnDef } from "@tanstack/react-table";

// import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// import { labels, priorities, statuses } from "../data/data";
import { Patient } from "../data/schema";
import { DataTableColumnHeader } from "./data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
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
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => (
      <div
        className="min-w-[80px] align-middle flex gap-2 flex-row items-center"
        style={{ verticalAlign: "middle" }}
      >
        {row.getValue("id")}
        <CopyButton className="align-middle z-0" value={row.getValue("id")} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("first_name")} {row.original.last_name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "mobile_number",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Number" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("mobile_number")}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "appointed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Appointed" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Badge variant={row.getValue("appointed") ? "success" : "failure"}>
          {row.getValue("appointed") ? "yes" : "no"}
        </Badge>
      </div>
    ),
    enableSorting: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => (
      <div className="space-x-2">{row.getValue("gender")}</div>
    ),
    enableSorting: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "last_visited",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Visited Date" />
    ),
    cell: ({ row }) => (
      <div className="min-w-[80px] ">
        {format(row.getValue("last_visited"), "dd-MM-yyyy HH:mm")}
      </div>
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
                    query: { patientId: row.getValue("id") },
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
                    query: { patientId: row.getValue("id") },
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
