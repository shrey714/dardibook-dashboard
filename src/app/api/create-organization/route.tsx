import { withAuth } from "@/server/withAuth";
import { NextResponse, NextRequest } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

const createOrganization = async (request: NextRequest) => {
  try {
    const { userId } = await auth();
    const formData = await request.formData();
    const clinicLogo = formData.get("clinicLogo") as Blob | null;
    if (!clinicLogo) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (!userId) return NextResponse.redirect(new URL("/signin"));
    const client = await clerkClient();

    const jsonObject: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (key !== "clinicLogo") {
        jsonObject[key] = value;
      }
    });

    const response = await client.organizations.createOrganization({
      name: formData.get("clinicName") as string,
      createdBy: userId,
      publicMetadata: jsonObject,
      maxAllowedMemberships: 5,
    });

    const organizationId = response.id;
    const uploaderUserId = userId;
    const params = {
      file: clinicLogo,
      uploaderUserId,
    };

    await client.organizations.updateOrganizationLogo(organizationId, params);

    return NextResponse.json({ data: "success" }, { status: 200 });
  } catch (error) {
    console.log("Error fetching patient data:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
};

export const POST = withAuth(createOrganization);
