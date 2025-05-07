import React from "react";
import { auth } from "@clerk/nextjs/server";

const page = async () => {
  const orgId = (await auth()).orgId;

  if (!orgId) {
    return <div>Orgid not exist</div>;
  }

  return <div>Prescriptions page :{orgId}</div>;
};

export default page;
