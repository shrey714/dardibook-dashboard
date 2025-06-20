"use server";
import { columns } from "@/components/History/prescriptions/columns";
import { DataTable } from "@/components/History/common/data-table";
import { auth } from "@clerk/nextjs/server";
import { PrescriptionFormTypes } from "@/types/FormTypes";
import { error } from "console";
import { DataTableToolbar } from "@/components/History/prescriptions/data-table-toolbar";
import { Prescription } from "@/components/History/dataSchema/schema";
import { checkPageAccess } from "@/app/dashboard/history/(history)/_actions";
import { adminDb } from "@/server/firebaseAdmin";

export default async function Page() {
  let prescriptions: Prescription[] = [];

  try {
    const authInstance = await auth();
    if (!authInstance.orgId || !authInstance.orgRole) {
      throw error("User is not authorized for this organization.");
    }

    if (!checkPageAccess(authInstance.orgRole, "Prescriptions")) {
      return (
        <div className="w-full h-full text-muted-foreground text-sm md:text-base p-4 overflow-hidden flex items-center justify-center gap-4 flex-col">
          <img
            className="w-full max-w-40 lg:mx-auto"
            src="/NoAccess.svg"
            alt="No Access"
          />
          You do not have access to view Prescriptions.
        </div>
      );
    }

    const prescriptionsQuery = adminDb
      .collectionGroup("prescriptions")
      .where("orgId", "==", authInstance.orgId)
      .orderBy("created_at", "desc");

    const querySnapshot = await prescriptionsQuery.get();

    prescriptions = querySnapshot.docs.map((doc) => {
      const data = doc.data() as PrescriptionFormTypes;
      return {
        patient_id: doc.ref.parent.parent?.id as string,
        prescription_id: data.prescription_id,
        prescription_for_bed: data.prescription_for_bed,
        diseaseDetail: data.diseaseDetail,
        nextVisit: data.nextVisit,
        created_at: data.created_at,
        registerd_by: data.registerd_by.name,
        prescribed_by: data.prescribed_by.name,
        prescriber_assigned: data.prescriber_assigned.name,
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
        Failed to load prescriptions. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex flex-1 px-2 py-2 flex-col h-full overflow-hidden">
      <DataTable
        data={prescriptions}
        columns={columns}
        ToolbarComponent={DataTableToolbar}
      />
    </div>
  );
}
