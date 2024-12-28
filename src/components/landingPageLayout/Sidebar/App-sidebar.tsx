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
    roles: [
      "org:clinic_head",
      "org:doctor",
      "org:assistant_doctor",
      "org:medical_staff",
    ],
  },
  {
    title: "Register",
    url: "/dashboard/appointment",
    icon: CalendarIcon,
    roles: ["org:clinic_head", "org:doctor", "org:assistant_doctor"],
  },
  {
    title: "Prescribe",
    url: "/dashboard/prescribe",
    icon: ClipboardPlusIcon,
    roles: ["org:clinic_head", "org:doctor"],
  },
  {
    title: "History",
    url: "/dashboard/history",
    icon: HistoryIcon,
    roles: [
      "org:clinic_head",
      "org:doctor",
      "org:assistant_doctor",
      "org:medical_staff",
    ],
  },
  {
    title: "Medical",
    url: "/dashboard/medical",
    icon: BriefcaseMedicalIcon,
    roles: ["org:clinic_head", "org:medical_staff"],
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: SettingsIcon,
    roles: [
      "org:clinic_head",
      "org:doctor",
      "org:assistant_doctor",
      "org:medical_staff",
    ],
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
