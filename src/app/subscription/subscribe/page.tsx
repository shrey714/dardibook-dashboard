"use server";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import HeaderMain from "@/components/HeaderMain";
import SubscriptionBox from "./SubscriptionBox";
type Params = Promise<{ planId: string }>;
export default async function Subscribe({
  searchParams,
}: {
  searchParams: Params;
}) {
  const user = await currentUser();
  const { planId } = await searchParams;
  return (
    <div className="flex overflow-y-auto pb-6 flex-col items-center min-h-screen w-full overflow-hidden">
      <Image
        src="/Logo.svg"
        fill={true}
        className="document-background-image"
        alt="logo"
      />
      <HeaderMain user={user} />
      <div className="flex flex-1 items-center justify-center w-full max-w-screen-xl p-2">
        <div className=" flex flex-col md:flex-row p-6 mx-auto max-w-screen-xl h-auto text-center rounded-lg border-2 border-border xl:p-8 bg-secondary/90 shadow-md flex-1">
          <SubscriptionBox planId={planId} />
        </div>
      </div>
    </div>
  );
}
