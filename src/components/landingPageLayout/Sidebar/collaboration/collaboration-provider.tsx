"use client";

import { useAuth, useUser } from "@clerk/nextjs";
import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react/suspense";
import { type ReactNode } from "react";

export const CollaborationProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isLoaded, user } = useUser();
  const { orgId } = useAuth();

  return (
    <>
      {isLoaded && orgId && user ? (
        <LiveblocksProvider
          authEndpoint={async () => {
            const response = await fetch("/api/collaboration", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userinfo: {
                  email: user.emailAddresses[0].emailAddress,
                  name: user.firstName,
                  photoURL: user.imageUrl,
                },
              }),
            });
            const result = await response.json();
            return result;
          }}
        >
          <RoomProvider
            id={`${orgId}:presence`}
            initialPresence={{ cursor: null }}
          >
            <ClientSideSuspense
              fallback={
                <div className="px-3 text-muted-foreground text-xs">
                  Loading...
                </div>
              }
            >
              {children}
            </ClientSideSuspense>
          </RoomProvider>
        </LiveblocksProvider>
      ) : (
        <></>
      )}
    </>
  );
};
