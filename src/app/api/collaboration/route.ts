import { NextRequest } from "next/server";
import { authenticate } from "@/components/landingPageLayout/Sidebar/collaboration/auth";



export const POST = async (request: NextRequest) => {
  const { userinfo } = await request.json();


  if (!userinfo) {
    return new Response('Unauthorized', { status: 401 });
  }

  return authenticate(userinfo);
};
