"use server";
import Image from "next/image";
import { auth, currentUser } from "@clerk/nextjs/server";
import HeaderMain from "@/components/HeaderMain";
import SubscriptionBox from "./SubscriptionBox";
export default async function Subscribe() {
  const user = await currentUser();
  const authInstance = await auth();

  return (
    <div className="flex relative pb-6 flex-col items-center min-h-svh w-full">
      <Image
        src="/Logo.svg"
        fill={true}
        className="document-background-image"
        alt="logo"
      />
      <HeaderMain user={user} />
      <div className="flex flex-1 items-center w-full max-w-screen-xl p-2 pt-4 flex-col gap-4">
        {!authInstance.orgId || !authInstance.orgRole ? (
          <div className="w-full flex-1 text-muted-foreground text-sm md:text-base p-4 overflow-hidden flex items-center justify-center gap-4 flex-col">
            User is not authorized for this organization.
          </div>
        ) : authInstance.orgRole !== "org:clinic_head" ? (
          <div className="w-full flex-1 text-center text-muted-foreground text-sm md:text-base p-4 overflow-hidden flex items-center justify-center gap-4 flex-col">
            <img
              className="w-full max-w-40 lg:mx-auto"
              src="/NoAccess.svg"
              alt="No Access"
            />
            You do not have access to view Subscriptions.
            <br />
            Please contact your administrator for any queries.
          </div>
        ) : (
          <SubscriptionBox />
        )}
      </div>
    </div>
  );
}
