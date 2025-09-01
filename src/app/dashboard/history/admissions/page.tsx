"use client";

import { useEffect, useState } from "react";
import { columns } from "@/components/History/admissions/columns";
import { DataTable } from "./common/data-table";
import { useAuth } from "@clerk/nextjs";
import { OrgBed } from "@/types/FormTypes";
import { DataTableToolbar } from "./common/data-table-toolbar";
import { Admission } from "@/components/History/dataSchema/schema";
import { checkPageAccess } from "@/app/dashboard/history/(history)/_actions";
import { db } from "@/firebase/firebaseConfig";
// import {
//   parseAsInteger,
//   useQueryStates,
// } from "nuqs";
import { collection, getCountFromServer, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useDataTable } from "@/components/History/hooks/use-data-table";
import { DataTableSortList } from "./common/data-table-sort-list";
import { DataTableSkeleton } from "./common/data-table-skeleton";

// const searchParamsConfig = {
//   page: parseAsInteger.withDefault(1),
//   pageSize: parseAsInteger.withDefault(20),
// };

export default function Page() {
  const { orgId, orgRole } = useAuth();
  // const [{ page, pageSize }] = useQueryStates(searchParamsConfig);

  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(()=>{
  //   const loadData = async ()=>{
  //     if(!orgId || !orgRole || !checkPageAccess(orgRole, "Admissions")){
  //       setError("User is not authorized for this organization.");
  //       setLoading(false);
  //       return;
  //     }

  //     try {
  //       const bedsCollectionRef = collection(db,"doctor",orgId,"beds");

  //       const admissionsQuery = query(bedsCollectionRef,orderBy("admission_at","desc"),limit(1*10));

  //       const querySnapshot = await getDocs(admissionsQuery);
  //       const countSnapshot = await getCountFromServer(bedsCollectionRef);
  //       const total = countSnapshot.data().count;
        
  //       setTotalRecords(total);

  //       const data : Admission[] = querySnapshot.docs.map((doc) => {
  //         const d = doc.data() as OrgBed;
  //         return {
  //           bedBookingId: d.bedBookingId,
  //           bedId: d.bedId,
  //           patient_id: d.patient_id,
  //           admission_at: d.admission_at,
  //           discharge_at: d.discharge_at,
  //           dischargeMarked: d.dischargeMarked ? "YES" : "NO",
  //           admission_by: d.admission_by.name,
  //           admission_for: d.admission_for.name,
  //           discharged_by: d.discharged_by?.name,
  //         };
  //       });

  //       setAdmissions(data);
  //     } catch (error) {
  //       console.error(error);
  //       setError("Failed to load admissions. Please try again later");
  //     } finally {
  //       setLoading(false)
  //     }
  //   }
  //   loadData();
  // },[])

  const { table, shallow, debounceMs, throttleMs } = useDataTable({
    data:admissions,
    orgId,
    orgRole,
    columns,
    pageCount:10,
    // enableAdvancedFilter,
    initialState: {
      sorting: [{ id: "admission_at", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    // getRowId: (originalRow) => originalRow.id,
    loading,
    setLoading,
    error,
    setError,
    shallow: false,
    clearOnDefault: true,
  });

  if (error) {
    return (
      loading?(
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
      ):(
          <div className="w-full h-full text-muted-foreground text-sm md:text-base p-4 overflow-hidden flex items-center justify-center gap-4 flex-col">
        <img
          className="w-full max-w-40 lg:mx-auto"
          src="/NoAccess.svg"
          alt="No Access"
        />
        {error}
      </div>
        )
    )
  }

  

  return (
    <div className="flex flex-1 px-2 py-2 flex-col h-full overflow-hidden">
      <DataTable
        table={table}
        // actionBar={<TasksTableActionBar table={table} />}
      >
          <DataTableToolbar table={table}>
            <DataTableSortList table={table} align="end" />
          </DataTableToolbar>
      </DataTable>
    </div>
  );
}
