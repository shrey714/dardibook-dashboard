"use client";

import { ChevronRight, ChevronDown, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SidebarMenuAction } from "@/components/ui/sidebar";
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
      <SidebarGroupLabel className="h-6 group-data-[collapsible=icon]:hidden">
        Links
      </SidebarGroupLabel>
      <SidebarMenu className="group-data-[collapsible=icon]:gap-3.5">
        {isLoaded &&
          orgRole &&
          pages
            .filter((page) => page.roles.includes(orgRole))
            .map((item, key) => {
              if (item.items?.length) {
                return (
                  <Collapsible
                    key={key}
                    asChild
                    defaultOpen={false}
                    open={isSubPath(pathname, item.url) ? true : undefined}
                  >
                    <SidebarMenuItem>
                      <Link
                        href={item.url}
                        className="relative flex flex-col items-center"
                      >
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={isSubPath(pathname, item.url)}
                          className="pl-3 overflow-hidden h-auto"
                        >
                          <span
                            className={`w-1 absolute -left-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden ${
                              isSubPath(pathname, item.url)
                                ? "h-2/3 opacity-100"
                                : "h-0 opacity-0"
                            }`}
                          ></span>
                          {item.icon && <item.icon />}
                          <span className="group-data-[collapsible=icon]:hidden">
                            {item.title}
                          </span>
                        </SidebarMenuButton>
                        <span className="text-[10px] leading-3 font-medium mt-1 max-w-[52px] truncate hidden group-data-[collapsible=icon]:block">
                          {item.title}
                        </span>
                      </Link>

                      <CollapsibleTrigger asChild>
                        <SidebarMenuAction className="data-[state=open]:rotate-180 bg-transparent hover:bg-transparent right-1.5 top-[calc(18px-10px)]">
                          <ChevronDown />
                          <span className="sr-only">Toggle</span>
                        </SidebarMenuAction>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub className="gap-0.5">
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
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              } else {
                return (
                  <SidebarMenuItem key={key}>
                    <Link
                      href={item.url}
                      className="relative flex flex-col items-center"
                    >
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isSubPath(pathname, item.url)}
                        className="pl-3 overflow-hidden h-auto"
                      >
                        <span
                          className={`w-1 absolute -left-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out group-data-[collapsible=icon]:hidden ${
                            isSubPath(pathname, item.url)
                              ? "h-2/3 opacity-100"
                              : "h-0 opacity-0"
                          }`}
                        ></span>
                        {item.icon && <item.icon />}
                        <span className="group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                        <ChevronRight
                          className={`ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden ${
                            isSubPath(pathname, item.url) ? "visible" : "hidden"
                          }`}
                        />
                      </SidebarMenuButton>
                      <span className="text-[10px] leading-3 font-medium mt-1 max-w-[52px] truncate hidden group-data-[collapsible=icon]:block">
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuItem>
                );
              }
            })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
