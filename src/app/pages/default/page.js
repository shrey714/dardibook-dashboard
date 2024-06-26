"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../../../redux/store";
import { checkSubscription } from "@/app/api/check-subscription/route";
export default function Default() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        fontSize: "45px",
      }}
    >
      <h1>Hiii....{user.displayName}</h1>
    </div>
  );
}
