"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Prescription } from "@/components/History/dataSchema/schema";
import { DataTableColumnHeader } from "@/components/History/common/data-table-column-header";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/CopyToClipboard";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableColumnFilter } from "../common/data-table-column-filter";
import { usePatientHistoryModalStore } from "@/lib/stores/patientHistoryModalStore";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Prescription>[] = [
  {
    accessorKey: "prescription_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prescription Id" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col justify-start items-start">
        <p className="text-sm font-normal flex flex-row gap-2">
          {row.original.prescription_id}
          <CopyButton
            className="align-middle z-0"
            value={row.original.prescription_id}
          />
        </p>
        {row.original.prescription_for_bed && (
          <Badge variant={"outline"} className={`font-medium`}>
            Bed
          </Badge>
        )}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: true,
  },
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
        <PatientButton patientId={row.original.patient_id} />
        <CopyButton
          className="align-middle z-0"
          value={row.original.patient_id}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "diseaseDetail",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Disease" />
    ),
    cell: ({ row }) => {
      const value = row.original.diseaseDetail;
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
    accessorKey: "created_at",
    header: ({ column }) => (
      <>
        <DataTableColumnHeader column={column} title="Created At" />
        <DataTableColumnFilter column={column} />
      </>
    ),
    cell: ({ row }) => (
      <div className="space-x-2 text-nowrap">
        {format(row.original.created_at, "MMM dd ,yy hh:mm a")}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
    enableGlobalFilter: false,
    meta: {
      filterVariant: "date-range",
    },
  },
  {
    accessorKey: "nextVisit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="next Visit" />
    ),
    cell: ({ row }) => (
      <div className="space-x-2 text-nowrap">{row.original.nextVisit}</div>
    ),
    enableSorting: true,
    enableHiding: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "registerd_by",
    header: ({ column }) => (
      <>
        <DataTableColumnHeader column={column} title="Registerd By" />
        <DataTableColumnFilter column={column} />
      </>
    ),
    cell: ({ row }) => (
      <div className="space-x-2">{row.original.registerd_by}</div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "prescribed_by",
    header: ({ column }) => (
      <>
        <DataTableColumnHeader column={column} title="Prescribed By" />
        <DataTableColumnFilter column={column} />
      </>
    ),
    cell: ({ row }) => (
      <div className="space-x-2">{row.original.prescribed_by}</div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "prescriber_assigned",
    header: ({ column }) => (
      <>
        <DataTableColumnHeader column={column} title="Prescribed Assigned" />
        <DataTableColumnFilter column={column} />
      </>
    ),
    cell: ({ row }) => (
      <div className="space-x-2">{row.original.prescriber_assigned}</div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
    meta: {
      filterVariant: "select",
    },
  },
];

const PatientButton = ({ patientId }: { patientId: string }) => {
  const { openModal } = usePatientHistoryModalStore();

  return (
    <Button
      variant="link"
      className="text-sm p-0 underline text-foreground"
      onClick={() => openModal({ patientId })}
    >
      {patientId}
    </Button>
  );
};
