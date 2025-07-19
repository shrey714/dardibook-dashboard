"use client";
import React from "react";
import { OrganizationList, useOrganizationList } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import RegistrationForm from "../forms/RegistrationForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

const OrganizationHandeler = () => {
  const { isLoaded, userMemberships, userInvitations } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
    userInvitations: {
      infinite: true,
    },
  });
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex flex-col items-center w-full flex-1 p-2 sm:p-4 pt-0 sm:pt-0">
      {!isLoaded ||
      userMemberships.isFetching ||
      userMemberships.isLoading ||
      userInvitations.isFetching ||
      userInvitations.isLoading ? (
        <OrgLoader className="mb-6" />
      ) : (
        (userMemberships.count > 0 || userInvitations.count > 0) && (
          <div className="flex flex-col max-w-screen-lg w-full">
            <OrganizationList
              fallback={<OrgLoader />}
              afterCreateOrganizationUrl={"/"}
              afterSelectOrganizationUrl={"/"}
              hidePersonal={true}
              appearance={{
                elements: {
                  headerTitle: "text-foreground",
                  headerSubtitle: "text-gray-600 dark:text-gray-300",
                  rootBox: "w-full max-w-screen-lg",
                  cardBox:
                    "shadow-none w-full border border-border rounded-xl",
                  card: "w-full shadow-sm bg-card rounded-none",
                  formContainer: "px-8 md:px-12 lg:px-36",
                  formFieldLabel: "text-foreground",
                  organizationListPreviewItems: "border-border",
                  organizationPreviewMainIdentifier: "text-foreground",
                  organizationListCreateOrganizationActionButton: "hidden",
                  footer: {
                    display: "none",
                  },
                },
                baseTheme: resolvedTheme === "dark" ? dark : undefined,
              }}
            />
            <p className="text-muted-foreground text-sm leading-normal w-full text-center py-0.5">
              or
            </p>
          </div>
        )
      )}
      <Card className="w-full overflow-hidden max-w-screen-lg py-0 gap-0">
        <CardHeader className="p-8 border-b space-y-1">
          <CardTitle className="text-foreground font-bold text-[1.0625rem] text-center leading-[1.41176] tracking-normal">
            Clinic Registration Form
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300 text-[0.8125rem] text-center font-normal leading-[1.38462] break-words">
            Please fill in all the required information to register your clinic
          </CardDescription>
        </CardHeader>
        <CardContent className="w-full py-6 sm:py-12 px-5 md:px-10 lg:px-16 flex items-center justify-center">
          <RegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationHandeler;

import { cn } from "@/lib/utils";
interface OrgLoaderProps {
  className?: string;
}

const OrgLoader: React.FC<OrgLoaderProps> = ({ className }) => {
  return (
    <Skeleton className={cn("w-full min-h-52 max-w-screen-lg", className)} />
  );
};
