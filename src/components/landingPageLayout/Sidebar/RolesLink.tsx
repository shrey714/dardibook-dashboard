import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ChevronRight, Blend } from "lucide-react";
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

const RolesLink = () => {
  const { orgRole, isLoaded } = useAuth();
  const { resolvedTheme } = useTheme();

  return (
    <>
      {isLoaded && orgRole !== "org:clinic_head" ? (
        <Dialog>
          <DialogTrigger asChild>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={"Roles"}>
                  <Blend />
                  <span>Roles</span>
                  <ChevronRight
                    className={`ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90`}
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
                  card: "w-full shadow-none bg-muted/50 rounded-none",
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
    </>
  );
};

export default RolesLink;
