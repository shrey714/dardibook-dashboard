import { patientBed, PharmacyTypes, PrescriptionFormTypes, RegisterPatientFormTypes } from "@/types/FormTypes";

  const MODULES = [
    "auth", "subscription", "registration", "prescription",
    "admission", "billing", "settings", "custom"
  ] as const;
  
  type ModuleType = typeof MODULES[number];

  type ActionDataMap = {
    signin: null;
    signout: null;
    subscription_started: { plan: string; amount: number; startDate: string; endDate: string };
    subscription_renewed: { plan: string; amount: number; renewedTill: string };
    registered: Partial<RegisterPatientFormTypes>;
    prescribed: Partial<PrescriptionFormTypes>;
    admitted: Partial<patientBed>;
    admission_updated: Partial<patientBed>;
    discharged: Partial<patientBed>;
    bill_generated: Partial<PharmacyTypes>;
    settings_updated: Record<string, any>; // generic since settings can vary
    updated: Partial<RegisterPatientFormTypes | PrescriptionFormTypes | patientBed | PharmacyTypes>; // catch-all fallback
    [key: string]: unknown; // for any custom actions
  };
  
  type LogAction = keyof ActionDataMap;
  
  export interface PatientActivityLog<A extends LogAction = string> {
    id?: string;
    action: A;
    timestamp: number;
    oldData: A extends keyof ActionDataMap ? ActionDataMap[A] | null : Record<string, unknown> | null;
    newData: A extends keyof ActionDataMap ? ActionDataMap[A] | null : Record<string, unknown> | null;
    module?: ModuleType;
  }
  

  export function diff<T extends Record<string, any>>(oldObj: T, newObj: T): {
    oldData: Partial<T>;
    newData: Partial<T>;
  } {
    const oldData: Partial<T> = {};
    const newData: Partial<T> = {};

    console.log("oldData:",oldObj);
    console.log("newData:",newObj);

  
    for (const key in newObj) {
      const oldVal = oldObj[key];
      const newVal = newObj[key];
  
      if (isObject(oldVal) && isObject(newVal)) {
        const { oldData: nestedOld, newData: nestedNew } = diff(oldVal, newVal);
        if (Object.keys(nestedOld).length > 0 || Object.keys(nestedNew).length > 0) {
          oldData[key] = nestedOld as any;
          newData[key] = nestedNew as any;
        }
      } else if (oldVal !== newVal) {
        oldData[key] = oldVal;
        newData[key] = newVal;
      }
    }
  
    return { oldData, newData };
  }
  
  function isObject(val: any): val is Record<string, any> {
    return typeof val === "object" && val !== null && !Array.isArray(val);
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
//     id: "abc123",
//     action: "updated", //added | updated | removed
//     timestamp: 1234567,
//     oldData,
//     newData,
//     module: "registration"
//   };
  