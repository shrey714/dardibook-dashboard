"use server";
import { columns } from "@/components/History/bills/columns";
import { DataTable } from "@/components/History/common/data-table";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import { PharmacyTypes } from "@/types/FormTypes";
import { error } from "console";
import { DataTableToolbar } from "@/components/History/bills/data-table-toolbar";
import { Bill } from "@/components/History/dataSchema/schema";
import { checkPageAccess } from "@/app/dashboard/history/(history)/_actions";

export default async function Page() {
  let bills: Bill[] = [];

  try {
    const authInstance = await auth();
    if (!authInstance.orgId || !authInstance.orgRole) {
      throw error("User is not authorized for this organization.");
    }

    if (!checkPageAccess(authInstance.orgRole, "Bills")) {
      return (
        <div className="w-full h-full text-muted-foreground text-sm md:text-base p-4 overflow-hidden flex items-center justify-center gap-4 flex-col">
          <img
            className="w-full max-w-40 lg:mx-auto"
            src="/NoAccess.svg"
            alt="No Access"
          />
          You do not have access to view Bills.
        </div>
      );
    }

    const billsCollection = collection(
      db,
      "doctor",
      authInstance.orgId,
      "bills"
    );
    const billsQuery = query(billsCollection, orderBy("generated_at", "desc"));

    const querySnapshot = await getDocs(billsQuery);

    bills = querySnapshot.docs.map((doc) => {
      const data = doc.data() as PharmacyTypes;
      return {
        bill_id: data.bill_id,
        prescription_id: data.prescription_id,
        name: data.name,
        patient_id: data.patient_id,
        generated_at: data.generated_at,
        prescribed_by: data.prescribed_by?.name,
        generated_by: data.generated_by.name,
        payment_status: data.payment_status,
        payment_method: data.payment_method,
        total_amount: data.total_amount,
        discount: data.discount,
        tax_percentage: data.tax_percentage,
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
        Failed to load bills. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex flex-1 px-2 py-2 flex-col h-full overflow-hidden">
      <DataTable
        data={bills}
        columns={columns}
        ToolbarComponent={DataTableToolbar}
      />
    </div>
  );
}
