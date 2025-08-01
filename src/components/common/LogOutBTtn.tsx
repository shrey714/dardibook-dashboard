"use client";
import React from "react";
import { Button, buttonVariants } from "../ui/button";
import { LogOut } from "lucide-react";
import animationData from "@/lottieFiles/SignOut.json";
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
import Lottie from "react-lottie";
import { SignOutButton } from "@clerk/nextjs";
import { VariantProps } from "class-variance-authority";

interface LogOutBtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const LogOutBTtn: React.FC<LogOutBtnProps> = ({ className, ...props }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          {...props}
          className={className}
          icon={LogOut}
          iconPlacement="right"
          effect="expandIcon"
        >
          Sign Out
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>SignOut</DialogTitle>
          <DialogDescription>You can SignIn again anytime..</DialogDescription>
        </DialogHeader>

        <Lottie options={defaultOptions} height={100} width={100} />
        <h3 className="text-base md:text-lg font-medium pb-5 w-full text-center self-center">
          Are you sure you want to SignOut?
        </h3>
        <DialogFooter className="justify-center sm:justify-center items-center flex-row flex-wrap gap-x-4 gap-y-2">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <SignOutButton redirectUrl="/signin">
            <Button variant={"destructive"}>SignOut</Button>
          </SignOutButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LogOutBTtn;
