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

export default async function Page() {
  let registrations: Registration[] = [];

  try {
    const orgId = (await auth()).orgId;
    if (!orgId) {
      throw error("OrgId does not exist");
    }
    const registrationsCollection = collection(db, "doctor", orgId, "patients");
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
      <div className="p-4 text-red-600">
        Failed to load registrations. Please try again later.
      </div>
    );
  }

  if (!registrations.length) {
    return (
      <div className="w-full h-full overflow-hidden flex items-center justify-center">
        No registrations found.
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
