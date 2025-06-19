import { patientBed, PharmacyTypes, PrescriptionFormTypes, RegisterPatientFormTypes } from "@/types/FormTypes";

  // 1. Define types for each action's data
  
  // 2. Map each action to its data type
  type ActionDataMap = {
    registered: Partial<RegisterPatientFormTypes>;
    prescribed: Partial<PrescriptionFormTypes>;
    admitted: Partial<patientBed>;
    discharged: Partial<patientBed>;
    receipt_generated: Partial<PharmacyTypes>;
    updated: Partial<RegisterPatientFormTypes | PrescriptionFormTypes | patientBed | PharmacyTypes>; // example
    [key: string]: unknown; // fallback for unknown/custom actions
  };
  
  // 3. Action type (discriminated union)
  type LogAction = keyof ActionDataMap;
  
  // 4. Main log interface using conditional types
  export interface PatientActivityLog<A extends LogAction = string> {
    id?: string;
    patientId: string;
    userId: string;
    action: A;
    timestamp: number;
    oldData: A extends keyof ActionDataMap ? ActionDataMap[A] | null : Record<string, unknown> | null;
    newData: A extends keyof ActionDataMap ? ActionDataMap[A] | null : Record<string, unknown> | null;
    description?: string;
    module?: string;
  }
  

  function diff<T extends Record<string, any>>(oldObj: T, newObj: T): {
    oldData: Partial<T>;
    newData: Partial<T>;
  } {
    const oldData: Partial<T> = {};
    const newData: Partial<T> = {};
    for (const key in newObj) {
      if (oldObj[key] !== newObj[key]) {
        oldData[key] = oldObj[key];
        newData[key] = newObj[key];
      }
    }
    return { oldData, newData };
  }


  const oldPatientData = {
    name: "John Doe",
    phone: "9876543210",
    age: 42,
  }

  const updatedPatientData = {
    name: "John Smith",
    phone: "9999999999",
    age: 42,
  }

  const { oldData, newData } = diff(oldPatientData, updatedPatientData);

// const logEntry: PatientActivityLog<'updated'> = {
//     // id: "abc123",
//     action: "updated", //added | updated | removed
//     // timestamp: 1234567,
//     oldData,
//     newData,
//     //include only those values which are changed
//     // description: "Updated patient name and phone number",
//     module: "registration"
//   };
  