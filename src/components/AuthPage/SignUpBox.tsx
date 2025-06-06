"use client";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React from "react";
import { Skeleton } from "../ui/skeleton";

const SignUpBox = () => {
  return (
    <SignUp
      fallback={
        <div className="flex flex-col items-center gap-5">
          <div className="w-full gap-1 flex flex-col items-center">
            <Skeleton className="h-6 sm:h-7 min-w-56" />
            <Skeleton className="h-[18px] min-w-72" />
          </div>
          <Skeleton className="h-11 w-full mb-6" />
        </div>
      }
      appearance={{
        elements: {
          logoBox: "hidden",
          rootBox: "flex justify-center items-center w-full",
          cardBox: "shadow-none w-full rounded-md",
          headerTitle: "text-base sm:text-xl",
          card: "px-1 pt-0 pb-6 bg-transparent gap-5",
          dividerRow: "hidden",
          form: "hidden",
          button: "h-11 rounded-md",
          footer: {
            display: "none",
          },
        },
        baseTheme: dark,
      }}
    />
  );
};

export default SignUpBox;
