"use client";

import { ChevronsUpDown } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import LogOutBTtn from "@/components/common/LogOutBTtn";
import { useAuth, useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";

export function NavUser({}) {
  const { isMobile } = useSidebar();
  const { user } = useUser();
  const { orgRole } = useAuth();

  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground gap-0"
            >
              <Avatar className="size-9 rounded-lg">
                <AvatarImage
                  src={user?.imageUrl || ""}
                  alt={user?.firstName || ""}
                />
                <AvatarFallback className="rounded-lg">
                  {user?.firstName?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-2">
                <span className="truncate font-semibold">
                  {user?.firstName}
                  <Badge variant="outline" className="border-primary ml-1 text-primary rounded-full py-0 px-1.5 text-[11px] font-medium leading-tight">
                    {orgRole === "org:clinic_head"
                      ? "Admin"
                      : orgRole === "org:doctor"
                      ? "Doctor"
                      : orgRole === "org:assistant_doctor"
                      ? "SubDoctor"
                      : orgRole === "org:medical_staff"
                      ? "Medical"
                      : ""}
                  </Badge>
                </span>
                <span className="truncate text-xs">
                  {user?.emailAddresses[0].emailAddress}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user?.imageUrl || ""}
                    alt={user?.firstName || ""}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user?.firstName}
                  </span>
                  <span className="truncate text-xs">
                    {user?.emailAddresses[0].emailAddress}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <LogOutBTtn
              size={"sm"}
              variant={"destructive"}
              className="w-full"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
