"use client";
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import React from "react";

const LoginBox = () => {
  const { resolvedTheme } = useTheme();

  return (
    <SignIn
      appearance={{
        elements: {
        //   header: "hidden",
          rootBox: "flex justify-center items-center w-full",
          cardBox: "shadow-none w-full rounded-md",
          card: "p-6 pb-0",
          button:
            "h-11 rounded-md",
          footer: {
            display: "none",
          },
        },
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    />
  );
};

export default LoginBox;
