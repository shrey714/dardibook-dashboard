"use server";
import { columns } from "@/components/History/patients/columns";
import { DataTable } from "@/components/History/common/data-table";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import {
  RegisterPatientFormTypes,
  Patient_History_Types,
} from "@/types/FormTypes";
import { error } from "console";
import { DataTableToolbar } from "@/components/History/patients/data-table-toolbar";

export default async function Page() {
  let patients: Patient_History_Types[] = [];

  try {
    const orgId = (await auth()).orgId;
    if (!orgId) {
      throw error("OrgId does not exist");
    }
    const patientsCollection = collection(db, "doctor", orgId, "patients");
    const patientsQuery = query(patientsCollection);

    const querySnapshot = await getDocs(patientsQuery);

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
    return (
      <div className="p-4 text-red-600">
        Failed to load patients. Please try again later.
      </div>
    );
  }

  if (!patients.length) {
    return (
      <div className="w-full h-full overflow-hidden flex items-center justify-center">
        No patients found.
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
