"use client";

import * as React from "react";
import {
  Home,
  CalendarIcon,
  ClipboardPlusIcon,
  HistoryIcon,
  BriefcaseMedicalIcon,
  SettingsIcon,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { LogoHandeler } from "./LogoHandeler";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/common/mode-toggle";
import { usePathname } from "next/navigation";
import RolesLink from "./RolesLink";
import TokenBox from "../../tokenFramer/TokenBox";
import Pip from "@/hooks/pip";

const pages = [
  {
    title: "Home",
    url: "/dashboard/home",
    icon: Home,
    roles: ["admin", "subDoctor", "medical"],
  },
  {
    title: "Register",
    url: "/dashboard/appointment",
    icon: CalendarIcon,
    roles: ["admin", "subDoctor"],
  },
  {
    title: "Prescribe",
    url: "/dashboard/prescribe",
    icon: ClipboardPlusIcon,
    roles: ["admin"],
  },
  {
    title: "History",
    url: "/dashboard/history",
    icon: HistoryIcon,
    roles: ["admin", "subDoctor", "medical"],
  },
  {
    title: "Medical",
    url: "/dashboard/medical",
    icon: BriefcaseMedicalIcon,
    roles: ["admin", "medical"],
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: SettingsIcon,
    roles: ["admin", "subDoctor", "medical"],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state, isMobile } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoHandeler />
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden">
        {state === "collapsed" && !isMobile ? <Pip /> : <TokenBox />}
        <NavMain pages={pages} pathname={pathname} />
      </SidebarContent>
      <SidebarFooter>
        <RolesLink />
        <NavUser />
        <ModeToggle />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
