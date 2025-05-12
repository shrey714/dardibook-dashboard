import { z } from "zod"

export const patientSchema = z.object({
  patient_id: z.string(),
  name: z.string(),
  mobile: z.string(),
  gender: z.enum(["Male", "Female", "Other"]),
  age: z.string(),
  address: z.string(),
})

export type Patient = z.infer<typeof patientSchema>


export const admissionSchema = z.object({
  bedBookingId: z.string(),
  bedId: z.string(),
  patient_id: z.string(),
  admission_at: z.number(),
  discharge_at: z.number(),
  dischargeMarked: z.enum(["YES", "NO"]),
  admission_by: z.string(),
  admission_for: z.string(),
  discharged_by: z.string().optional(),
});

export type Admission = z.infer<typeof admissionSchema>;

export const billSchema = z.object({
  bill_id: z.string(),
  prescription_id: z.string().optional(),
  name: z.string(),
  patient_id: z.string().optional(),
  generated_at: z.number(),
  prescribed_by: z.string().optional(),
  generated_by: z.string(),
  payment_status: z.enum(["Paid", "Unpaid", "Not Required", "Refunded"]),
  payment_method: z.enum(["Cash", "Card", "UPI", "Online"]).optional(),
  total_amount: z.number(),
  discount: z.number(),
  tax_percentage: z.number(),
});

export type Bill = z.infer<typeof billSchema>;

export const prescriptionSchema = z.object({
  prescription_id: z.string(),
  prescription_for_bed: z.boolean(),
  patient_id: z.string(),
  diseaseDetail: z.string(),
  nextVisit: z.string(),
  created_at: z.number(),
  registerd_by: z.string(),
  prescribed_by: z.string(),
  prescriber_assigned: z.string(),
});

export type Prescription = z.infer<typeof prescriptionSchema>;

export const registrationSchema = z.object({
  patient_id: z.string(),
  name: z.string(),
  registred_on: z.number(),
  is_prescribed: z.enum(["YES", "NO"]),
})

export type Registration = z.infer<typeof registrationSchema>