"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAppSelector } from "@/redux/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import RolesModal from "../landingPageLayout/RolesModal";

const AccessibilityWrapper = () => {
  const userInfo = useAppSelector<any>((state) => state.auth.user);
  const router = useRouter();

  return (
    <Dialog open={true}>
      <DialogContent showCloseBtn={false} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Role</DialogTitle>
          <DialogDescription>
            Make changes to your role profile.
          </DialogDescription>
        </DialogHeader>
        <RolesModal userInfo={userInfo} />
        <DialogFooter className="sm:justify-center">
          <Button
            type="button"
            variant={"outline"}
            className="border-2 self-center rounded-full min-h-min h-min py-2 px-7 text-xs leading-none"
            onClick={() => {
              router.back();
            }}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccessibilityWrapper;
