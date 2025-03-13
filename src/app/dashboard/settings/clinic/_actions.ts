'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'

export const updateOrgMetadata = async (formdata: any) => {
  const client = await clerkClient()
  const { orgId } = await auth()

  if (!orgId) {
    return { message: 'No Org ID available' }
  }

  try {
    await client.organizations.updateOrganizationMetadata(orgId, {
      publicMetadata: formdata,
    })
    return { message: 'Org metadata Updated' }
  } catch (e) {
    return { message: `Error Updating User Metadata ${e}` }
  }
}