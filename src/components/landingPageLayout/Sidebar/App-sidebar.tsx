"use client";

import * as React from "react";
import {
  Home,
  ClipboardPlusIcon,
  HistoryIcon,
  SettingsIcon,
  SquarePenIcon,
  CalendarDaysIcon,
  PillIcon,
  UserSearchIcon,
  CalendarClockIcon,
  ClipboardPenIcon,
  BedDoubleIcon,
  ReceiptTextIcon,
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
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: CalendarDaysIcon,
    roles: ["org:clinic_head", "org:doctor", "org:assistant_doctor"],
  },
  {
    title: "Register",
    url: "/dashboard/appointment",
    icon: SquarePenIcon,
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
    items: [
      {
        title: "Patients",
        url: "/dashboard/history/patients",
        icon: UserSearchIcon,
        roles: [
          "org:clinic_head",
          "org:doctor",
          "org:assistant_doctor",
          "org:medical_staff",
        ],
      },
      {
        title: "Registrations",
        url: "/dashboard/history/registrations",
        icon: CalendarClockIcon,
        roles: ["org:clinic_head", "org:doctor", "org:assistant_doctor"],
      },
      {
        title: "Prescriptions",
        url: "/dashboard/history/prescriptions",
        icon: ClipboardPenIcon,
        roles: ["org:clinic_head", "org:doctor", "org:assistant_doctor"],
      },
      {
        title: "Admissions",
        url: "/dashboard/history/admissions",
        icon: BedDoubleIcon,
        roles: [
          "org:clinic_head",
          "org:doctor",
          "org:assistant_doctor",
          "org:medical_staff",
        ],
      },
      {
        title: "Bills",
        url: "/dashboard/history/bills",
        icon: ReceiptTextIcon,
        roles: [
          "org:clinic_head",
          "org:doctor",
          "org:assistant_doctor",
          "org:medical_staff",
        ],
      },
    ],
  },
  {
    title: "Pharmacy",
    url: "/dashboard/pharmacy",
    icon: PillIcon,
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
