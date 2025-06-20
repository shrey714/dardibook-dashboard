import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ChevronRight, Blend, SettingsIcon } from "lucide-react";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { OrganizationList, useAuth } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import Link from "next/link";

const isSubPath = (pathname: string, route: string) => {
  const formattedPathname = pathname.endsWith("/") ? pathname : pathname + "/";
  const formattedRoute = route.endsWith("/") ? route : route + "/";
  return formattedPathname.startsWith(formattedRoute);
};

const RolesLink = ({ pathname }: { pathname: string }) => {
  const { orgRole, isLoaded } = useAuth();
  const { resolvedTheme } = useTheme();

  return (
    <>
      {isLoaded && orgRole !== "org:clinic_head" ? (
        <Dialog>
          <DialogTrigger className="group" asChild>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={"Roles"} className="pl-3 h-auto">
                  <Blend />
                  <span>Roles</span>
                  <ChevronRight
                    className={`ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 hidden group-data-[state=open]:block`}
                  />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Change Role</DialogTitle>
              <DialogDescription>
                Make changes to your role profile.
              </DialogDescription>
            </DialogHeader>
            {/* <RolesModal userInfo={user} /> */}
            <OrganizationList
              hidePersonal={true}
              appearance={{
                elements: {
                  header: "hidden",
                  rootBox: "w-full",
                  cardBox:
                    "max-w-full shadow-none w-full border-2 border-border rounded-md",
                  organizationListPreviewItems: "border-t-0",
                  card: "w-full shadow-none bg-muted/50 rounded-none p-0",
                  organizationPreviewMainIdentifier: "text-foreground",
                  footer: {
                    display: "none",
                  },
                  organizationListCreateOrganizationActionButton: {
                    display: "none",
                  },
                },
                baseTheme: resolvedTheme === "dark" ? dark : undefined,
              }}
            />
            <DialogFooter className="sm:justify-center">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant={"outline"}
                  className="border-2 self-center rounded-full min-h-min h-min py-2 px-7 text-xs leading-none"
                >
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <></>
      )}

      <SidebarMenu>
        <SidebarMenuItem>
          <Link href={"/dashboard/settings"} className="relative">
            <SidebarMenuButton
              tooltip={"Settings"}
              isActive={isSubPath(pathname, "/dashboard/settings")}
              className="pl-3 overflow-hidden h-auto"
            >
              <span
                className={`w-1 absolute -left-0.5 bg-foreground rounded-full transition-all duration-300 ease-in-out ${
                  isSubPath(pathname, "/dashboard/settings")
                    ? "h-2/3 opacity-100"
                    : "h-0 opacity-0"
                }`}
              ></span>
              <SettingsIcon />
              <span>Settings</span>
              <ChevronRight
                className={`ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 ${
                  isSubPath(pathname, "/dashboard/settings")
                    ? "visible"
                    : "hidden"
                }`}
              />
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
};

export default RolesLink;
