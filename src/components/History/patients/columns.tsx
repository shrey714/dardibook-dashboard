"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Patient } from "@/components/History/dataSchema/schema";
import { DataTableColumnHeader } from "@/components/History/common/data-table-column-header";
import Link from "next/link";
import { CalendarIcon, HistoryIcon, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/CopyToClipboard";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "@clerk/nextjs";
import { usePatientHistoryModalStore } from "@/lib/stores/patientHistoryModalStore";

export const columns: ColumnDef<Patient>[] = [
  {
    accessorKey: "patient_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient Id" />
    ),
    cell: ({ row }) => (
      <div
        className="min-w-[80px] align-middle flex gap-2 flex-row items-center"
        style={{ verticalAlign: "middle" }}
      >
        {row.getValue("patient_id")}
        <CopyButton
          className="align-middle z-0"
          value={row.getValue("patient_id")}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("name")}
        </span>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "mobile",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Contact" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("mobile")}</div>,
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gender" />
    ),
    cell: ({ row }) => (
      <div className="space-x-2">{row.getValue("gender")}</div>
    ),
    enableSorting: true,
    enableHiding: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "age",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Age" />
    ),
    cell: ({ row }) => <div className="space-x-2">{row.getValue("age")}</div>,
    enableSorting: true,
    enableHiding: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => {
      const value = row.getValue("address") as string;
      const maxLength = 40;

      return (
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <div className={`truncate cursor-pointer`}>
              {value.length > maxLength
                ? `${value.slice(0, maxLength)}...`
                : value}
            </div>
          </TooltipTrigger>
          {value.length > maxLength && (
            <TooltipContent className="max-w-xs">{value}</TooltipContent>
          )}
        </Tooltip>
      );
    },
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: true,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { isLoaded, orgRole } = useAuth();
      const isAccess =
        isLoaded &&
        (orgRole === "org:clinic_head" ||
          orgRole === "org:doctor" ||
          orgRole === "org:assistant_doctor");
      const { openModal } = usePatientHistoryModalStore();
      return (
        <div className="min-w-min p-0 align-middle flex gap-2 flex-row items-center">
          <TooltipProvider>
            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  className={`flex h-8 w-8 p-0 border-green-500 bg-green-500/10 text-green-600 hover:bg-green-500/20 ${
                    !isAccess ? "opacity-50" : ""
                  }`}
                  asChild
                >
                  {isAccess ? (
                    <Link
                      href={{
                        pathname: "/dashboard/appointment/appointmentForm",
                        query: { patientId: row.getValue("patient_id") },
                      }}
                      type="button"
                    >
                      <CalendarIcon />
                    </Link>
                  ) : (
                    <div className="flex items-center justify-center cursor-not-allowed">
                      <CalendarIcon />
                    </div>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isAccess ? <p>Register</p> : <p>You don't have access.</p>}
              </TooltipContent>
            </Tooltip>

            <Tooltip delayDuration={300}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex h-8 w-8 p-0 data-[state=open]:bg-muted border-border border"
                  onClick={() => {
                    row.getValue("patient_id") &&
                      openModal({
                        patientId: row.getValue("patient_id"),
                      });
                  }}
                >
                  <HistoryIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Patient History</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
  },
];
