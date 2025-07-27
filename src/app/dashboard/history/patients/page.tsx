"use server";
import { columns } from "@/components/History/patients/columns";
import { DataTable } from "@/components/History/common/data-table";
import { auth } from "@clerk/nextjs/server";
import { RegisterPatientFormTypes } from "@/types/FormTypes";
import { error } from "console";
import { DataTableToolbar } from "@/components/History/patients/data-table-toolbar";
import { Patient } from "@/components/History/dataSchema/schema";
import { checkPageAccess } from "@/app/dashboard/history/(history)/_actions";
import { adminDb } from "@/server/firebaseAdmin";
import {
  createLoader,
  parseAsInteger,
} from 'nuqs/server'
import type { SearchParams } from 'nuqs/server'

const searchParams = {
  page: parseAsInteger.withDefault(1),
  pageSize: parseAsInteger.withDefault(20)
};
const loadSearchParams = createLoader(searchParams)

type PageProps = {
  searchParams: Promise<SearchParams>
}

export default async function Page({ searchParams }: PageProps) {
  let patients: Patient[] = [];
  let totalRecords = 0;
  let page;
  let pageSize;

  try {
    const query = await loadSearchParams(searchParams);
    page = query.page;
    pageSize = query.pageSize;
    const authInstance = await auth();
    if (!authInstance.orgId || !authInstance.orgRole) {
      throw error("User is not authorized for this organization.");
    }

    if (!checkPageAccess(authInstance.orgRole, "Patients")) {
      return (
        <div className="w-full h-full text-muted-foreground text-sm md:text-base p-4 overflow-hidden flex items-center justify-center gap-4 flex-col">
          <img
            className="w-full max-w-40 lg:mx-auto"
            src="/NoAccess.svg"
            alt="No Access"
          />
          You do not have access to view Patients.
        </div>
      );
    }

    const patientsCollections = adminDb
      .collection("doctor")
      .doc(authInstance.orgId)
      .collection("patients");
    
    const patientsQuery = patientsCollections
      .orderBy("__name__")
      .limit(page * pageSize);

    const querySnapshot = await patientsQuery.get();
    const countSnapshot = await patientsCollections.count().get();

    totalRecords=countSnapshot.data().count;
    const lastRecords = page*pageSize > totalRecords ? (totalRecords%pageSize) : pageSize;

    patients = querySnapshot.docs.slice(-lastRecords).map((doc) => {
      const data = doc.data() as RegisterPatientFormTypes;
      return {
        patient_id: data.patient_id,
        name: data.name,
        mobile: data.mobile,
        gender: data.gender,
        age: data.age,
        address: [data.street_address, data.city, data.state, data.zip]
          .filter(Boolean)
          .join(", "),
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
        Failed to load patients. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex flex-1 px-2 py-2 flex-col h-full overflow-hidden">
      <DataTable
        data={patients}
        columns={columns}
        totalRecords={totalRecords}
        ToolbarComponent={DataTableToolbar}
      />
    </div>
  );
}
