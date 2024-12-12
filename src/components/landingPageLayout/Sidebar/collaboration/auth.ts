import 'server-only';
import { Liveblocks as LiveblocksNode } from '@liveblocks/node';

type AuthenticateOptions = {
  userId: string;
  orgId: string;
  userInfo: Liveblocks['UserMeta']['info'];
};

const COLORS = [
  "#ef4444", // red[500]
  "#f97316", // orange[500]
  "#f59e0b", // amber[500]
  "#eab308", // yellow[500]
  "#84cc16", // lime[500]
  "#22c55e", // green[500]
  "#10b981", // emerald[500]
  "#14b8a6", // teal[500]
  "#06b6d4", // cyan[500]
  "#0ea5e9", // sky[500]
  "#3b82f6", // blue[500]
  "#6366f1", // indigo[500]
  "#8b5cf6", // violet[500]
  "#a855f7", // purple[500]
  "#d946ef", // fuchsia[500]
  "#ec4899", // pink[500]
  "#f43f5e", // rose[500]
];

export const authenticate = async (userinfo: any) => {
  if (!process.env.LIVEBLOCKS_SECRET) {
    console.log("liveblock key not exist")
    throw new Error("LIVEBLOCKS_SECRET is not defined in the environment variables.");
  }
  const liveblocks = new LiveblocksNode({
    secret: process.env.LIVEBLOCKS_SECRET,
  });


  const session = liveblocks.prepareSession(userinfo.email, {
    userInfo: {
      name:
        userinfo.displayName || undefined,
      avatar: userinfo.photoURL ?? undefined,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }
  });

  session.allow(`${userinfo.uid}:*`, session.FULL_ACCESS);

  // Authorize the user and return the result
  const { status, body } = await session.authorize();

  return new Response(body, { status });
};
