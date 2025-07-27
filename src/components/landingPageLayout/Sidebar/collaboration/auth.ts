import 'server-only';
import { Liveblocks as LiveblocksNode } from '@liveblocks/node';
import { auth } from '@clerk/nextjs/server'

export const authenticate = async (userinfo: Liveblocks['UserMeta']['info']) => {
  const { orgId, orgRole } = await auth()
  if (!process.env.LIVEBLOCKS_SECRET) {
    console.log("liveblock key not exist")
    throw new Error("LIVEBLOCKS_SECRET is not defined in the environment variables.");
  }
  const liveblocks = new LiveblocksNode({
    secret: process.env.LIVEBLOCKS_SECRET,
  });


  const session = liveblocks.prepareSession(userinfo.email, {
    userInfo: {
      email: userinfo.email,
      name: userinfo.name,
      photoURL: userinfo.photoURL,
      role: orgRole || ""
    }
  });

  session.allow(`${orgId}:*`, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { status, body } = await session.authorize();
  return new Response(body, { status });
};
