import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useAppSelector } from "@/redux/store";
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
import RolesModal from "../RolesModal";
import { Button } from "@/components/ui/button";

const RolesLink = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <>
      {user && user.role !== "admin" ? (
        <Dialog
        >
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
            <RolesModal userInfo={user} />
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
