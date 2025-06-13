"use server";

import { BedInfo } from "@/types/FormTypes";
import { auth, clerkClient } from "@clerk/nextjs/server";

export const updateOrgBedMetaData = async (formdata: BedInfo[]) => {
  const client = await clerkClient();
  const { orgId } = await auth();

  if (!orgId) {
    return { message: "No Org ID available" };
  }

  try {
    await client.organizations.updateOrganizationMetadata(orgId, {
      publicMetadata: { bedMetaData: formdata },
    });
    return { message: "Org metadata Updated" };
  } catch (e) {
    return { message: `Error Updating User Metadata ${e}` };
  }
};
