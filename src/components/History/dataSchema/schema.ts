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
