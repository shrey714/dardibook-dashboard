"use server";
import { columns } from "@/components/History/admissions/columns";
import { DataTable } from "@/components/History/common/data-table";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import { Admissions_History_Types, OrgBed } from "@/types/FormTypes";
import { error } from "console";
import { DataTableToolbar } from "@/components/History/admissions/data-table-toolbar";

export default async function Page() {
  let admissions: Admissions_History_Types[] = [];

  try {
    const orgId = (await auth()).orgId;
    if (!orgId) {
      throw error("OrgId does not exist");
    }
    const admissionsCollection = collection(db, "doctor", orgId, "beds");
    const admissionsQuery = query(
      admissionsCollection,
      orderBy("admission_at", "desc")
    );

    const querySnapshot = await getDocs(admissionsQuery);

    admissions = querySnapshot.docs.map((doc) => {
      const data = doc.data() as OrgBed;
      return {
        bedBookingId: data.bedBookingId,
        bedId: data.bedId,
        patient_id: data.patient_id,
        admission_at: data.admission_at,
        discharge_at: data.discharge_at,
        dischargeMarked: data.dischargeMarked ? "YES" : "NO",
        admission_by: data.admission_by.name,
        admission_for: data.admission_for.name,
        discharged_by: data.discharged_by?.name,
      };
    });
  } catch (error) {
    return (
      <div className="p-4 text-red-600">
        Failed to load admissions. Please try again later.
      </div>
    );
  }

  if (!admissions.length) {
    return (
      <div className="w-full h-full overflow-hidden flex items-center justify-center">
        No admissions found.
      </div>
    );
  }

  return (
    <div className="flex flex-1 px-2 py-2 flex-col h-full overflow-hidden">
      <DataTable
        data={admissions}
        columns={columns}
        ToolbarComponent={DataTableToolbar}
      />
    </div>
  );
}
