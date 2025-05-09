import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const patientSchema = z.object({
  patient_id: z.string(),
  name: z.string(),
  mobile: z.string(),
  age: z.string(),
  gender: z.string(),
})

export type Patient = z.infer<typeof patientSchema>
