"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
// import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useAppSelector } from "@/redux/store";

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
  const user = useAppSelector((state) => state.auth.user);

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Links</SidebarGroupLabel>
      <SidebarMenu>
        {user &&
          pages
            .filter((page) => page.roles.includes(user?.role))
            .map((item, key) => (
              <SidebarMenuItem key={key}>
                <Link href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isSubPath(pathname, item.url)}
                  >
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
