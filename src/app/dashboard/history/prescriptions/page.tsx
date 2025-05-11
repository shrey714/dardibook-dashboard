"use server";
import { columns } from "@/components/History/prescriptions/columns";
import { DataTable } from "@/components/History/common/data-table";
import { db } from "@/firebase/firebaseConfig";
import {
  collectionGroup,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import { PrescriptionFormTypes } from "@/types/FormTypes";
import { error } from "console";
import { DataTableToolbar } from "@/components/History/prescriptions/data-table-toolbar";
import { Prescription } from "@/components/History/dataSchema/schema";

export default async function Page() {
  let prescriptions: Prescription[] = [];

  try {
    const orgId = (await auth()).orgId;
    if (!orgId) {
      throw error("OrgId does not exist");
    }
    const prescriptionsCollection = collectionGroup(db, "prescriptions");
    const prescriptionsQuery = query(
      prescriptionsCollection,
      orderBy("created_at", "desc")
    );

    const querySnapshot = await getDocs(prescriptionsQuery);

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
      <div className="p-4 text-red-600">
        Failed to load prescriptions. Please try again later.
      </div>
    );
  }

  if (!prescriptions.length) {
    return (
      <div className="w-full h-full overflow-hidden flex items-center justify-center">
        No prescriptions found.
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
