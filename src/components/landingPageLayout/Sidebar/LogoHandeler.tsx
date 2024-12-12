"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useAppSelector } from "@/redux/store";
import Image from "next/image";

export function LogoHandeler({}) {
  const userInfo = useAppSelector((state) => state.auth.user);
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-white">
            <Image
              alt="Logo"
              src="/Logo.svg"
              width={32}
              height={32}
              className="aspect-square size-7"
              priority
            />
          </div>

          <div className="grid flex-1 items-center text-sm leading-tight">
            <Link
              href={"/"}
              className="cursor-pointer flex flex-row items-center justify-center gap-1 w-fit self-center"
            >
              <span className="self-center text-xl font-semibold whitespace-nowrap">
                DardiBook
              </span>
              <span className="text-[7px] font-semibold border-[1.5px] border-[--border] px-2 rounded-full">
                {userInfo?.role === "admin"
                  ? "Doctor"
                  : userInfo?.role === "subDoctor"
                  ? "subDoctor"
                  : userInfo?.role === "medical"
                  ? "Medical"
                  : ""}
              </span>
            </Link>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
