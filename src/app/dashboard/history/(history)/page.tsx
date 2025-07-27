import React from "react";
import { auth } from "@clerk/nextjs/server";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { historyPages } from "./_actions";

const page = async () => {
  const orgRole = (await auth()).orgRole;

  if (!orgRole) {
    return (
      <div className="flex h-full items-center justify-center">
        User does not exist with an appropriate role..
      </div>
    );
  }

  return (
    <BentoGrid className="lg:grid-rows-4 p-4 min-h-full">
      {historyPages
        .filter((page) => page.roles.includes(orgRole))
        .map((page) => (
          <BentoCard key={page.name} {...page} />
        ))}
    </BentoGrid>
  );
};

export default page;
