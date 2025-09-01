"use client";

import { useState } from "react";
import { columns } from "@/components/History/admissions/columns";
import { DataTable } from "./common/data-table";
import { useAuth } from "@clerk/nextjs";
import { DataTableToolbar } from "./common/data-table-toolbar";
import { useDataTable } from "@/components/History/hooks/use-data-table";
import { DataTableSortList } from "./common/data-table-sort-list";
import { DataTableSkeleton } from "./common/data-table-skeleton";

export default function Page() {
  const { orgId, orgRole } = useAuth();

  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data: [],
    orgId,
    orgRole,
    columns,
    pageCount: 10,
    initialState: {
      sorting: [{ id: "admission_at", desc: true }],
    },
    loading,
    setLoading,
    error,
    setError,
    shallow: false,
    clearOnDefault: true,
  });

  if (error) {
    return (
      <div className="w-full h-full text-muted-foreground text-sm md:text-base p-4 overflow-hidden flex items-center justify-center gap-4 flex-col">
        <img
          className="w-full max-w-40 lg:mx-auto"
          src="/NoAccess.svg"
          alt="No Access"
        />
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-1 px-2 py-2 flex-col h-full overflow-hidden">
      {loading ? (
        <DataTableSkeleton
          columnCount={7}
          filterCount={2}
          cellWidths={[
            "10rem",
            "30rem",
            "10rem",
            "10rem",
            "6rem",
            "6rem",
            "6rem",
          ]}
          shrinkZero
        />
      ) : (
        <DataTable
          table={table}
          // actionBar={<TasksTableActionBar table={table} />}
        >
          <DataTableToolbar table={table}>
            <DataTableSortList table={table} align="end" />
          </DataTableToolbar>
        </DataTable>
      )}
    </div>
  );
}
