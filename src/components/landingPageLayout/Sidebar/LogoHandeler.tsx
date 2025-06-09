"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

export function LogoHandeler({}) {
  const { orgRole } = useAuth();
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
              <span className="text-[7px] font-semibold border-[1.5px] border-[--border] px-2 rounded-full leading-[normal]">
                {orgRole === "org:clinic_head"
                  ? "Admin"
                  : orgRole === "org:doctor"
                  ? "Doctor"
                  : orgRole === "org:assistant_doctor"
                  ? "SubDoctor"
                  : orgRole === "org:medical_staff"
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
