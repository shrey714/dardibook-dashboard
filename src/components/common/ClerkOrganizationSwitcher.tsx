"use client";
import { OrganizationSwitcher } from "@clerk/nextjs";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

const HeaderClerkOrganizationSwitcher = () => {
  const { resolvedTheme } = useTheme();

  return (
    <OrganizationSwitcher
      fallback={<Skeleton className="h-8 w-28" />}
      hidePersonal={true}
      appearance={{
        elements: {
          organizationSwitcherTrigger:
            "w-full border-0 border-border px-0 py-0 bg-background",
          organizationSwitcherPopoverMain:
            "w-full shadow-none bg-muted rounded-none pt-0",
          organizationPreviewAvatarBox: "h-8 w-8",
          organizationSwitcherPopoverActionButton__createOrganization: {
            display: "none",
          },
          organizationSwitcherPopoverFooter: {
            display: "none",
          },
        },
        baseTheme: resolvedTheme === "dark" ? dark : undefined,
      }}
    />
  );
};

export default HeaderClerkOrganizationSwitcher;
