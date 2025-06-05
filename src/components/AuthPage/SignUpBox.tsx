"use client";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import React from "react";

const SignUpBox = () => {
  const { resolvedTheme } = useTheme();

  return (
    <SignUp
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
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    />
  );
};

export default SignUpBox;
