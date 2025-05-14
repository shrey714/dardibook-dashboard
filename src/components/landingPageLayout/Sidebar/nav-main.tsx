"use client";

import { ChevronRight, HistoryIcon, type LucideIcon } from "lucide-react";
// import { ChevronRight, type LucideIcon } from "lucide-react"
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
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
      roles: string[];
    }[];
  }[];
}) {
  const { orgRole, isLoaded } = useAuth();

  return (
    <SidebarGroup className="py-0">
      <SidebarGroupLabel>Links</SidebarGroupLabel>
      <SidebarMenu>
        {isLoaded &&
          orgRole &&
          pages
            .filter((page) => page.roles.includes(orgRole))
            .map((item, key) => (
              <SidebarMenuItem key={key}>
                <>
                  <Link href={item.url} className="relative">
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isSubPath(pathname, item.url)}
                      className="pl-3 overflow-hidden h-auto"
                    >
                      <span
                        className={`w-1 absolute -left-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out ${
                          isSubPath(pathname, item.url)
                            ? "h-2/3 opacity-100"
                            : "h-0 opacity-0"
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

                  {item.items?.length ? (
                    <SidebarMenuSub className="gap-[2px]">
                      {item.items
                        .filter((page) => page.roles.includes(orgRole))
                        .map((item, index) => (
                          <SidebarMenuSubItem key={index}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={isSubPath(pathname, item.url)}
                            >
                              <Link href={item.url} className="truncate">
                                {item.icon && <item.icon />}
                                {item.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                  ) : null}
                </>
              </SidebarMenuItem>
            ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
