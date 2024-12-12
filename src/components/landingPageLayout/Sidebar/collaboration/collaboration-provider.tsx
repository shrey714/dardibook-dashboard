"use client";

import { useAppSelector } from "@/redux/store";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import type { ReactNode } from "react";

export const CollaborationProvider = ({
  orgId,
  children,
}: {
  orgId: string;
  children: ReactNode;
}) => {
  const userinfo = useAppSelector((state) => state.auth.user);

  return (
    <LiveblocksProvider
      authEndpoint={async (room) => {
        const headers = {
          "Content-Type": "application/json",
        };

        const body = JSON.stringify({
          room,
          userinfo,
        });

        const response = await fetch("/api/collaboration", {
          method: "POST",
          headers,
          body,
        });

        return await response.json();
      }}
    >
      <RoomProvider id={`${orgId}:presence`} initialPresence={{ cursor: null }}>
        <ClientSideSuspense
          fallback={
            <div className="px-3 text-muted-foreground text-xs">Loading...</div>
          }
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
};