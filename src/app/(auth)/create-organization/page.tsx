"use server";
import { currentUser } from "@clerk/nextjs/server";
import HeaderMain from "@/components/HeaderMain";
import OrganizationHandeler from "@/components/AuthPage/OrganizationHandeler";
import Image from "next/image";

export default async function CreateOrganization() {
  const user = await currentUser();

  return (
    <section className="w-screen min-h-svh flex flex-col items-center gap-2 px-2 pb-2 sm:px-4 sm:pb-2">
      <HeaderMain user={user} />
      <OrganizationHandeler />
      <div className="w-full flex flex-1 flex-col items-center justify-end">
        <Image
          alt="Logo"
          src="/Logo.svg"
          width={56}
          height={56}
          className="h-12 sm:h-14 aspect-square mt-5 mb-5"
          priority
        />
      </div>
    </section>
  );
}
