"use server";

import { OrganizationList } from "@clerk/nextjs";
import Image from "next/image";
import RegistrationForm from "@/components/forms/RegistrationForm";

export default async function CreateOrganization() {
  return (
    <section className="w-screen min-h-svh flex flex-col gap-2 sm:gap-3 p-2 sm:p-4">
      <OrganizationList
        hidePersonal={true}
        appearance={{
          elements: {
            headerTitle: "text-foreground",
            headerSubtitle: "text-gray-600 dark:text-gray-300",
            rootBox: "w-full",
            cardBox: "max-w-full shadow-none w-full border-2 border-border rounded-md",
            card: "w-full shadow-none bg-muted/50 rounded-none",
            organizationListPreviewItems :"border-border",
            organizationPreviewMainIdentifier:"text-foreground",
            footer: {
              display: "none",
            },
          },
        }}
      />
      <div className=" flex flex-col items-center w-full flex-1 rounded-md overflow-hidden bg-gradient-to-b from-muted/50 to-muted p-2 sm:p-4 border-2 border-border">
        <div className="z-50 mt-10 py-8 sm:py-12 px-8 md:px-12 lg:px-36 w-full flex flex-1 flex-col items-center justify-between">
          <RegistrationForm />

          <Image
            alt="Logo"
            src="/Logo.svg"
            width={56}
            height={56}
            className="h-12 sm:h-14 aspect-square mt-5"
            priority
          />
        </div>
      </div>
    </section>
  );
}
