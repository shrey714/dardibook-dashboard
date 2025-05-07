"use server";
import { columns } from "@/components/History/components/columns";
import { DataTable } from "@/components/History/components/data-table";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query } from "firebase/firestore";
import { auth } from "@clerk/nextjs/server";
import { RegisterPatientFormTypes } from "@/types/FormTypes";
import { error } from "console";

export default async function PatientsPage() {
  let patients: RegisterPatientFormTypes[] = [];

  try {
    const orgId = (await auth()).orgId;
    if (!orgId) {
      throw error("OrgId does not exist");
    }
    const patientsCollection = collection(db, "doctor", orgId, "patients");
    const patientsQuery = query(patientsCollection);

    const querySnapshot = await getDocs(patientsQuery);

    patients = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
    })) as RegisterPatientFormTypes[];
  } catch (error) {
    console.error("Error fetching patients:", error);
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
      <DataTable data={patients} columns={columns} />
    </div>
  );
}
