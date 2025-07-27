'use server'

import { PrescriptionAdditionalinfo, ReceiptDetails } from '@/types/FormTypes'
import { auth, clerkClient } from '@clerk/nextjs/server'

interface ServiceItems {
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

interface BedDefaultsType {
  bed_id: string;
  ward: string;
}

interface Medicine_Types {
  value: string;
  isDefault?: boolean;
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

export const updatePrescriptionAdditionalInfo = async (formdata: PrescriptionAdditionalinfo[]) => {
  const client = await clerkClient()
  const { orgId } = await auth()

  if (!orgId) {
    return { message: 'Organization ID is missing.' }
  }

  try {
    await client.organizations.updateOrganizationMetadata(orgId, {
      publicMetadata: { prescription_additional_details: formdata },
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

export const updateBedDefaults = async (formdata: BedDefaultsType[]) => {
  const client = await clerkClient()
  const { orgId } = await auth()

  if (!orgId) {
    return { message: 'Organization ID is missing.' }
  }

  try {
    await client.organizations.updateOrganizationMetadata(orgId, {
      publicMetadata: { beds: formdata },
    })
    return { message: 'Organization metadata updated successfully.' }
  } catch (e) {
    return { message: `Failed to update organization metadata: ${e}` }
  }
}

export const updateMedicineTypesDefaults = async (formdata: Medicine_Types[]) => {
  const client = await clerkClient()
  const { orgId } = await auth()

  if (!orgId) {
    return { message: 'Organization ID is missing.' }
  }

  try {
    await client.organizations.updateOrganizationMetadata(orgId, {
      publicMetadata: { medicine_types: formdata },
    })
    return { message: 'Organization metadata updated successfully.' }
  } catch (e) {
    return { message: `Failed to update organization metadata: ${e}` }
  }
}