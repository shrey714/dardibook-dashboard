"use server";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import HeaderMain from "@/components/HeaderMain";
import SubscriptionBox from "./SubscriptionBox";
type Params = Promise<{ planId: string }>
export default async function Subscribe({
  searchParams,
}: {
  searchParams: Params;
}) {
  const user = await currentUser();
  const { planId } = await searchParams;
  return (
    <div className="flex pt-24 overflow-y-auto pb-6 flex-col justify-evenly items-center min-h-screen w-full overflow-hidden">
      <Image
        src="/Logo.svg"
        fill={true}
        className="document-background-image"
        alt="logo"
      />
      <HeaderMain user={user} />
      <div className=" flex flex-col md:flex-row p-6 mx-auto w-11/12 sm:w-9/12 h-auto text-center rounded-lg border-2 border-border xl:p-8 bg-secondary/90 shadow-md">
        <SubscriptionBox planId={planId} />
      </div>
    </div>
  );
}
