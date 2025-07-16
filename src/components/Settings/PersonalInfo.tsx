/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import LogOutBTtn from "../common/LogOutBTtn";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth, useUser } from "@clerk/nextjs";
import { Badge } from "../ui/badge";

const PersonalInfo = () => {
  const { user } = useUser();
  const { orgRole } = useAuth();
  return (
    <Card className="mx-auto max-w-4xl 2xl:mx-0 shadow-none border h-min flex flex-1 flex-col bg-sidebar/70 2xl:max-w-xl">
      <CardHeader className="border-b p-5">
        <CardTitle className="font-medium tracking-normal">
          Personal Information
        </CardTitle>
        <CardDescription hidden></CardDescription>
      </CardHeader>
      <CardContent className="px-5 pt-5 pb-3 flex flex-col items-center gap-2">
        <Avatar className="h-20 w-20 rounded-lg self-center">
          <AvatarImage
            src={user?.imageUrl}
            alt={user?.firstName || "user profile"}
          />
          <AvatarFallback className="rounded-lg">
            {user?.firstName?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-1 flex-col w-full">
          <h3 className="w-full font-medium text-center tracking-tight text-2xl flex flex-row gap-3 items-center justify-center">
            {user?.fullName}
            <Badge variant="success">
              {orgRole === "org:clinic_head"
                ? "Admin"
                : orgRole === "org:doctor"
                ? "Doctor"
                : orgRole === "org:assistant_doctor"
                ? "SubDoctor"
                : orgRole === "org:medical_staff"
                ? "Medical"
                : ""}
            </Badge>
          </h3>

          <p className="w-full text-center text-sm text-muted-foreground">
            {user?.emailAddresses[0].emailAddress}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center px-3 py-3 w-full">
        <LogOutBTtn variant={"destructive"} className="w-full max-w-sm" />
      </CardFooter>
    </Card>
  );
};

export default PersonalInfo;
