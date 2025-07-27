"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

export function LogoHandeler({}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem className="flex items-center justify-center">
        <SidebarMenuButton
          className="relative overflow-visible 
          hover:bg-transparent
          active:bg-transparent
          size-auto group-data-[collapsible=icon]:!size-auto data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground 
          flex-col items-center justify-center p-0 group-data-[collapsible=icon]:!p-0"
        >
          <div className="absolute inset-0 rounded-full bg-primary/50 blur-xl dark:bg-primary/20 dark:blur-xl"></div>
          <Link
            href="/"
            className="flex shrink-0 h-14 aspect-square items-center justify-center rounded-md"
          >
            <Image
              alt="Logo"
              src="/Logo.svg"
              width={56}
              height={56}
              className="aspect-square drop-shadow-md size-14"
              priority
            />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
