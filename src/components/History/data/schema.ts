import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const patientSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  mobile_number: z.string(),
  age: z.string(),
  gender: z.string(),
  appointed: z.boolean(),
  last_visited: z.number(),
  visitedDates: z.array(z.number()),
})

export type Patient = z.infer<typeof patientSchema>
