"use server";
import { columns } from "@/components/History/admissions/columns";
import { DataTable } from "@/components/History/common/data-table";
import { auth } from "@clerk/nextjs/server";
import { OrgBed } from "@/types/FormTypes";
import { error } from "console";
import { DataTableToolbar } from "@/components/History/admissions/data-table-toolbar";
import { Admission } from "@/components/History/dataSchema/schema";
import { checkPageAccess } from "@/app/dashboard/history/(history)/_actions";
import { adminDb } from "@/server/firebaseAdmin";

export default async function Page() {
  let admissions: Admission[] = [];

  try {
    const authInstance = await auth();
    if (!authInstance.orgId || !authInstance.orgRole) {
      throw error("User is not authorized for this organization.");
    }

    if (!checkPageAccess(authInstance.orgRole, "Admissions")) {
      return (
        <div className="w-full h-full text-muted-foreground text-sm md:text-base p-4 overflow-hidden flex items-center justify-center gap-4 flex-col">
          <img
            className="w-full max-w-40 lg:mx-auto"
            src="/NoAccess.svg"
            alt="No Access"
          />
          You do not have access to view Admissions.
        </div>
      );
    }

    const admissionsQuery = adminDb
      .collection("doctor")
      .doc(authInstance.orgId)
      .collection("beds")
      .orderBy("admission_at", "desc");

    const querySnapshot = await admissionsQuery.get();

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
    console.log(error);
    return (
      <div className="w-full h-full text-red-600 text-sm md:text-base p-4 overflow-hidden flex items-center justify-center gap-4 flex-col">
        <img
          className="w-full max-w-40 lg:mx-auto"
          src="/ErrorTriangle.svg"
          alt=""
        />
        Failed to load admissions. Please try again later.
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
