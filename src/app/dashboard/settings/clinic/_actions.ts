'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

interface DoctorInfo {
  doctorName: string;
  degree: string;
  registrationNumber: string;
  clinicNumber: string;
  phoneNumber: string;
  clinicAddress: string;
}

export const updateOrgMetadata = async (formdata: DoctorInfo) => {
  const client = await clerkClient()
  const { orgId } = await auth()

  if (!orgId) {
    return { message: 'No Org ID available' }
  }

  try {
    await client.organizations.updateOrganizationMetadata(orgId, {
      publicMetadata: { ...formdata },
    })
    return { message: 'Org metadata Updated' }
  } catch (e) {
    return { message: `Error Updating User Metadata ${e}` }
  }
}