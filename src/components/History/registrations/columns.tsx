"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Registration } from "@/components/History/dataSchema/schema";
import { DataTableColumnHeader } from "@/components/History/common/data-table-column-header";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/common/CopyToClipboard";
import { usePatientHistoryModalStore } from "@/lib/stores/patientHistoryModalStore";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnFilter } from "../common/data-table-column-filter";

export const columns: ColumnDef<Registration>[] = [
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Patient Name" />
    ),
    cell: ({ row }) => (
      <div className="space-x-2 text-nowrap">{row.original.name}</div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "registred_on",
    header: ({ column }) => (
      <>
        <DataTableColumnHeader column={column} title="Registred On" />
        <DataTableColumnFilter column={column} />
      </>
    ),
    cell: ({ row }) => (
      <div className="space-x-2 text-nowrap">
        {format(row.original.registred_on, "MMM dd ,yy hh:mm a")}
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
    accessorKey: "is_prescribed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prescription Status" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <Badge
          variant={row.original.is_prescribed === "YES" ? "success" : "failure"}
        >
          {row.original.is_prescribed === "YES"
            ? "Prescribed"
            : "Not Prescribed"}
        </Badge>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    enableGlobalFilter: false,
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
