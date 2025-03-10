"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
// import { ChevronRight, type LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

const isSubPath = (pathname: string, route: string) => {
  const formattedPathname = pathname.endsWith("/") ? pathname : pathname + "/";
  const formattedRoute = route.endsWith("/") ? route : route + "/";
  return formattedPathname.startsWith(formattedRoute);
};

export function NavMain({
  pathname,
  pages,
}: {
  pathname: string;
  pages: {
    title: string;
    url: string;
    icon?: LucideIcon;
    roles: string[];
  }[];
}) {
  const { orgRole, isLoaded } = useAuth();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Links</SidebarGroupLabel>
      <SidebarMenu>
        {isLoaded &&
          orgRole &&
          pages
            .filter((page) => page.roles.includes(orgRole))
            .map((item, key) => (
              <SidebarMenuItem key={key}>
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isSubPath(pathname, item.url)}
                    className="pl-0 overflow-hidden"
                  >
                    <span
                      className={`w-1 bg-foreground rounded-r-full transition-all duration-300 ease-in-out ${
                        isSubPath(pathname, item.url)
                          ? "h-full max-h-full opacity-100"
                          : "h-0 max-h-0 opacity-0"
                      }`}
                    ></span>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight
                      className={`ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 ${
                        isSubPath(pathname, item.url) ? "visible" : "hidden"
                      }`}
                    />
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
