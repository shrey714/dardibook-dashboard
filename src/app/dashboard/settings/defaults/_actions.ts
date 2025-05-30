'use server'

import { ReceiptDetails } from '@/types/FormTypes'
import { auth, clerkClient } from '@clerk/nextjs/server'

export const updatePrescriptionReceiptDefaults = async (formdata: ReceiptDetails[]) => {
  const client = await clerkClient()
  const { orgId } = await auth()

  if (!orgId) {
    return { message: 'Organization ID is missing.' }
  }

  try {
    await client.organizations.updateOrganizationMetadata(orgId, {
      publicMetadata: { prescription_receipt_types: formdata },
    })
    return { message: 'Organization metadata updated successfully.' }
  } catch (e) {
    return { message: `Failed to update organization metadata: ${e}` }
  }
}

export const updateRegistrationReceiptDefaults = async (formdata: ReceiptDetails[]) => {
  const client = await clerkClient()
  const { orgId } = await auth()

  if (!orgId) {
    return { message: 'Organization ID is missing.' }
  }

  try {
    await client.organizations.updateOrganizationMetadata(orgId, {
      publicMetadata: { registration_receipt_types: formdata },
    })
    return { message: 'Organization metadata updated successfully.' }
  } catch (e) {
    return { message: `Failed to update organization metadata: ${e}` }
  }
}