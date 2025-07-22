"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { sidebarNavItems } from "./settings-sidebar-config";

interface SettingsAccessWrapperProps {
  children: React.ReactNode;
}

export default function SettingsAccessWrapper({
  children,
}: SettingsAccessWrapperProps) {
  const { orgRole, isLoaded } = useAuth();
  const pathname = usePathname();

  const checkPageAccess = (
    role: string | null | undefined,
    currentPath: string
  ): boolean => {
    if (!role) return false;

    const formattedPathname = currentPath.endsWith("/")
      ? currentPath
      : currentPath + "/";

    const page = sidebarNavItems.find((p) => {
      const formattedRoute = p.href.endsWith("/") ? p.href : p.href + "/";
      return formattedPathname === formattedRoute;
    });

    return page ? page.roles.includes(role) : false;
  };

  return isLoaded ? (
    checkPageAccess(orgRole, pathname) ? (
      children
    ) : (
      <div className="w-full min-h-[calc(100svh-246px)] lg:min-h-[calc(100svh-234px)] text-muted-foreground text-sm md:text-base p-4 overflow-hidden flex items-center justify-center gap-4 flex-col">
        <Image
          className="w-full max-w-40 lg:mx-auto"
          src="/NoAccess.svg"
          alt="No Access"
          width={160}
          height={160}
        />
        You do not have access to view this page.
      </div>
    )
  ) : (
    <></>
  );
}
