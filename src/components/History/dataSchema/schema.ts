import { z } from "zod"

export const patientSchema = z.object({
  patient_id: z.string(),
  name: z.string(),
  mobile: z.string(),
  gender: z.string(),
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