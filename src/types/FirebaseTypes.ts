import { z } from "zod";
import { Timestamp } from "firebase/firestore";

const FirestoreTimestamp = z.custom<Timestamp>(
    (val) => val instanceof Timestamp,
    { message: "Invalid Firestore Timestamp" }
);
// ----------------------------------------------------------------------------------------------------------

export const DoctorSchema = z.object({
    clinicAddress: z.string(),
    clinicLogo: z.string().url(),
    clinicName: z.string(),
    clinicNumber: z.string(),
    degree: z.string(),
    doctorName: z.string(),
    emailId: z.string().email(),
    phoneNumber: z.string(),
    registrationNumber: z.string(),
    signaturePhoto: z.string().url(),
    subscriptionId: z.string(),
});

export type DoctorProfile = z.infer<typeof DoctorSchema>;
// ----------------------------------------------------------------------------------------------------------

export const DiseaseSchema = z.object({
    diseaseDetail: z.string(),
    diseaseId: z.string(),
    medicines: z.array(z.string()),
    searchableString: z.string(),
});

export type Disease = z.infer<typeof DiseaseSchema>;
// ----------------------------------------------------------------------------------------------------------

const MedicineTypeEnum = z.enum([
    "TAB", "CAP", "SYRUP", "DROP", "CREAM", "LOTION", "SERUM",
    "SOAP", "SPRAY", "GEL", "OINTMENT", "INHALER", "INJECTION",
    "POWDER", "PATCH", "SUPPOSITORY"
]);

export const MedicineSchema = z.object({
    id: z.string(),
    instruction: z.string(),
    medicineName: z.string(),
    searchableString: z.string(),
    type: MedicineTypeEnum,
});

export type Medicine = z.infer<typeof MedicineSchema>;
// ----------------------------------------------------------------------------------------------------------


export const PatientSchema = z.object({
    age: z.string().regex(/^\d+$/, "Age must be a number as string"),
    city: z.string(),
    first_name: z.string(),
    gender: z.enum(["Male", "Female", "Other"]),
    last_name: z.string(),
    last_visited: FirestoreTimestamp,
    mobile_number: z.string().regex(/^\d{10}$/, "Invalid mobile number"),
    patient_unique_Id: z.string(),
    state: z.string(),
    street_address: z.string(),
    visitedDates: z.array(FirestoreTimestamp),
    zip: z.string().regex(/^\d{6}$/, "Invalid ZIP code"),
});

export type Patient = z.infer<typeof PatientSchema>;
// ----------------------------------------------------------------------------------------------------------

const DosageSchema = z.object({
    morning: z.string().nullable().optional().default(null),
    afternoon: z.string().nullable().optional().default(null),
    evening: z.string().nullable().optional().default(null),
    night: z.string().nullable().optional().default(null),
});

const PrescriptionMedicineSchema = z.object({
    id: z.string(),
    medicineName: z.string(),
    instruction: z.string(),
    searchableString: z.string(),
    type: MedicineTypeEnum,
    duration: z.string(),
    durationType: z.enum(["day", "week", "month"]),
    dosages: DosageSchema,
});

const ReferSchema = z.object({
    doctorName: z.string(),
    hospitalName: z.string(),
    referMessage: z.string(),
});

export const PrescriptionSchema = z.object({
    advice: z.string(),
    diseaseDetail: z.string(),
    diseaseId: z.string(),
    medicines: z.array(PrescriptionMedicineSchema),
    nextVisit: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
    refer: ReferSchema,
    time: FirestoreTimestamp,
});

export type Prescription = z.infer<typeof PrescriptionSchema>;
// ----------------------------------------------------------------------------------------------------------