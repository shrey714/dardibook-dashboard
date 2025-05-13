"use server";
import { columns } from "@/components/History/registrations/columns";
import { DataTable } from "@/components/History/common/data-table";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import { RegisterPatientFormTypes } from "@/types/FormTypes";
import { error } from "console";
import { DataTableToolbar } from "@/components/History/registrations/data-table-toolbar";
import { Registration } from "@/components/History/dataSchema/schema";
import { isSameDay } from "date-fns";
import { checkPageAccess } from "@/app/dashboard/history/(history)/_actions";

export default async function Page() {
  let registrations: Registration[] = [];

  try {
    const authInstance = await auth();
    if (!authInstance.orgId || !authInstance.orgRole) {
      throw error("User is not authorized for this organization.");
    }

    if (!checkPageAccess(authInstance.orgRole, "Registrations")) {
      return (
        <div className="w-full h-full text-muted-foreground text-sm md:text-base p-4 overflow-hidden flex items-center justify-center gap-4 flex-col">
          <img
            className="w-full max-w-40 lg:mx-auto"
            src="/NoAccess.svg"
            alt="No Access"
          />
          You do not have access to view Registrations.
        </div>
      );
    }
    const registrationsCollection = collection(
      db,
      "doctor",
      authInstance.orgId,
      "patients"
    );
    const registrationsQuery = query(registrationsCollection);

    const querySnapshot = await getDocs(registrationsQuery);
    registrations = querySnapshot.docs.flatMap((doc) => {
      const patient = doc.data() as RegisterPatientFormTypes;

      return patient.registered_date_time.map((register_time) => ({
        patient_id: patient.patient_id,
        name: patient.name,
        registred_on: register_time,
        is_prescribed: patient.prescribed_date_time.some((prescribe_time) =>
          isSameDay(prescribe_time, register_time)
        )
          ? "YES"
          : "NO",
      }));
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
        Failed to load registrations. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex flex-1 px-2 py-2 flex-col h-full overflow-hidden">
      <DataTable
        data={registrations}
        columns={columns}
        ToolbarComponent={DataTableToolbar}
      />
    </div>
  );
}
