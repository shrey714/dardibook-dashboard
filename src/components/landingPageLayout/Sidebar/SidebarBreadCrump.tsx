import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { AvatarStack } from "./collaboration/avatar-stack";
import { NavHospital } from "./nav-hospital";
const CollaborationProvider = dynamic(() =>
  import("./collaboration/collaboration-provider").then(
    (mod) => mod.CollaborationProvider
  )
);

const SidebarBreadCrump = () => {
  const paths = usePathname();

  // Split and filter the pathname into segments
  const pathNames = paths
    .split("/")
    .filter((path) => path && path !== "dashboard");

  // Create an array of breadcrumb items with name and path
  const pathItems = pathNames.map((path, i) => ({
    name: path,
    path: `/${pathNames.slice(0, i + 1).join("/")}`,
  }));

  return (
    <header className="flex shrink-0 items-center justify-between gap-2 border-b px-4 py-2">
      <div className="flex items-center gap-2 pr-4">
        <SidebarTrigger className="" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {/* Render all items except the last one as links */}
            {pathItems.slice(0, -1).map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink asChild>
                    <Link href={`/dashboard${item.path}`}>{item.name}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </React.Fragment>
            ))}

            {/* Render the last item as plain text */}
            {pathItems.length > 0 && (
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {pathItems[pathItems.length - 1].name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center pl-4">
          <CollaborationProvider>
            <AvatarStack />
          </CollaborationProvider>
        <NavHospital />
      </div>
    </header>
  );
};

export default SidebarBreadCrump;
