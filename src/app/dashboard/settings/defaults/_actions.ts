'use server'

import { ReceiptDetails } from '@/types/FormTypes'
import { auth, clerkClient } from '@clerk/nextjs/server'

interface ServiceItems  {
    service_id: string;
    service_name: string;
    price: number;
}

interface BillDefaultsType {
  discount: number;
  tax: number;
  payment_status: "Paid" | "Unpaid" | "Not Required" | "Refunded";
  payment_method: "Cash" | "Card" | "UPI" | "Online";
}

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

export const updateServicesDefaults = async (formdata: ServiceItems[]) => {
  const client = await clerkClient()
  const { orgId } = await auth()

  if (!orgId) {
    return { message: 'Organization ID is missing.' }
  }

  try {
    await client.organizations.updateOrganizationMetadata(orgId, {
      publicMetadata: { services: formdata },
    })
    return { message: 'Organization metadata updated successfully.' }
  } catch (e) {
    return { message: `Failed to update organization metadata: ${e}` }
  }
}

export const updateBillDefaults = async (formdata: BillDefaultsType) => {
  const client = await clerkClient()
  const { orgId } = await auth()

  if (!orgId) {
    return { message: 'Organization ID is missing.' }
  }

  try {
    await client.organizations.updateOrganizationMetadata(orgId, {
      publicMetadata: { bill_defaults: formdata },
    })
    return { message: 'Organization metadata updated successfully.' }
  } catch (e) {
    return { message: `Failed to update organization metadata: ${e}` }
  }
}