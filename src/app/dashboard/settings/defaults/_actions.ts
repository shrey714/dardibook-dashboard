'use server'

import { ReceiptDetails } from '@/types/FormTypes'
import { auth, clerkClient } from '@clerk/nextjs/server'

export const updatePrescriptionReceiptDefaults = async (formdata: ReceiptDetails[]) => {
  const client = await clerkClient()
  const { orgId } = await auth()

  if (!orgId) {
    return { message: 'No Org ID available' }
  }

  try {
    await client.organizations.updateOrganizationMetadata(orgId, {
      publicMetadata: { receipt_types: formdata },
    })
    return { message: 'Org metadata Updated' }
  } catch (e) {
    return { message: `Error Updating User Metadata ${e}` }
  }
}