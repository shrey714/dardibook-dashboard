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

export default async function Page() {
  let patients: Patient[] = [];

  try {
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

    const patientsQuery = adminDb
      .collection("doctor")
      .doc(authInstance.orgId)
      .collection("patients");

    const querySnapshot = await patientsQuery.get();

    patients = querySnapshot.docs.map((doc) => {
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
        ToolbarComponent={DataTableToolbar}
      />
    </div>
  );
}
