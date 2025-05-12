"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Admission } from "@/components/History/dataSchema/schema";
import { DataTableColumnHeader } from "@/components/History/common/data-table-column-header";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/CopyToClipboard";
import { usePatientHistoryModalStore } from "@/lib/stores/patientHistoryModalStore";
import { format } from "date-fns";
import { DataTableColumnFilter } from "../common/data-table-column-filter";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Admission>[] = [
  {
    accessorKey: "bedBookingId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Booking Id" />
    ),
    cell: ({ row }) => (
      <div
        className="min-w-[80px] align-middle flex gap-2 flex-row items-center"
        style={{ verticalAlign: "middle" }}
      >
        {row.original.bedBookingId}
        <CopyButton
          className="align-middle z-0"
          value={row.original.bedBookingId}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "bedId",
    header: ({ column }) => (
      <>
        <DataTableColumnHeader column={column} title="Bed Id" />
        <DataTableColumnFilter column={column} />
      </>
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.original.bedId}
        </span>
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
    enableGlobalFilter: false,
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "patient_id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient Id" />
    ),
    cell: ({ row }) => <PatientButton patientId={row.original.patient_id} />,
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "admission_at",
    header: ({ column }) => (
      <>
        <DataTableColumnHeader column={column} title="Admission At" />
        <DataTableColumnFilter column={column} />
      </>
    ),
    cell: ({ row }) => (
      <div className="space-x-2 text-xs text-nowrap">
        {format(row.original.admission_at, "MMM dd ,yy hh:mm a")}
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
    accessorKey: "discharge_at",
    header: ({ column }) => (
      <>
        <DataTableColumnHeader column={column} title="Discharge At" />
        <DataTableColumnFilter column={column} />
      </>
    ),
    cell: ({ row }) => (
      <div className="space-x-2 text-xs text-nowrap">
        {format(row.original.discharge_at, "MMM dd ,yy hh:mm a")}
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
    accessorKey: "dischargeMarked",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Discharge Status" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Badge
          variant={
            row.original.dischargeMarked === "YES" ? "success" : "failure"
          }
        >
          {row.original.dischargeMarked}
        </Badge>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
  },
  {
    accessorKey: "admission_by",
    header: ({ column }) => (
      <>
        <DataTableColumnHeader column={column} title="Admission By" />
        <DataTableColumnFilter column={column} />
      </>
    ),
    cell: ({ row }) => (
      <div className="space-x-2">{row.original.admission_by}</div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "admission_for",
    header: ({ column }) => (
      <>
        <DataTableColumnHeader column={column} title="Admission For" />
        <DataTableColumnFilter column={column} />
      </>
    ),
    cell: ({ row }) => (
      <div className="space-x-2">{row.original.admission_for}</div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
    meta: {
      filterVariant: "select",
    },
  },
  {
    accessorKey: "discharged_by",
    header: ({ column }) => (
      <>
        <DataTableColumnHeader column={column} title="Discharged By" />
        <DataTableColumnFilter column={column} />
      </>
    ),
    cell: ({ row }) => (
      <div className="space-x-2">{row.original.discharged_by ?? "-"}</div>
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
    <div className="min-w-min underline p-0 align-middle flex gap-1 flex-row items-center">
      <Button variant="link" onClick={() => openModal({ patientId })}>
        {patientId}
      </Button>
    </div>
  );
};
