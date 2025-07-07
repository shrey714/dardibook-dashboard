"use client";
import React from "react";
import { OrganizationList, useOrganizationList } from "@clerk/nextjs";
import RegistrationForm from "@/components/forms/RegistrationForm";
import Loader from "../common/Loader";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
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
    <>
      {!isLoaded ||
      userMemberships.isFetching ||
      userMemberships.isLoading ||
      userInvitations.isFetching ||
      userInvitations.isLoading ? (
        <div className="w-full h-full overflow-hidden flex flex-1 items-center justify-center">
          <Loader size="medium" />
        </div>
      ) : (
        <div className=" flex flex-col items-center w-full flex-1 p-2 sm:p-4 pt-0 sm:pt-0 gap-y-1">
          {(userMemberships.count > 0 || userInvitations.count > 0) && (
            <React.Fragment>
              <OrganizationList
                afterCreateOrganizationUrl={"/"}
                afterSelectOrganizationUrl={"/"}
                hidePersonal={true}
                appearance={{
                  elements: {
                    headerTitle: "text-foreground",
                    headerSubtitle: "text-gray-600 dark:text-gray-300",
                    rootBox: "w-full max-w-screen-xl",
                    cardBox:
                      "max-w-full shadow-none w-full border-2 border-border rounded-md",
                    card: "w-full shadow-none bg-muted/50 rounded-none",
                    formContainer: "px-8 md:px-12 lg:px-36",
                    formFieldLabel: "text-foreground",
                    organizationListPreviewItems: "border-border",
                    organizationPreviewMainIdentifier: "text-foreground",
                    organizationListCreateOrganizationActionButton: "hidden",
                    organizationAvatarUploaderContainer: "text-foreground",
                    organizationListPreviewItemActionButton: "text-foreground",
                    avatarImageActionsUpload: "text-foreground dark:bg-muted",
                    footer: {
                      display: "none",
                    },
                  },
                  baseTheme: resolvedTheme === "dark" ? dark : undefined,
                }}
              />
              <p className="text-muted-foreground text-sm leading-normal">or</p>
            </React.Fragment>
          )}

          <div className="w-full flex flex-1 flex-col border-2 rounded-md overflow-hidden border-border bg-gradient-to-b from-muted/50 to-muted max-w-screen-xl">
            <div className="flex flex-col gap-y-1 items-center py-8 border-b">
              <h1 className="text-foreground font-bold text-[1.0625rem] leading-[1.41176] tracking-normal">
                Create an organization
              </h1>

              <p className="text-gray-600 dark:text-gray-300 text-[0.8125rem] font-normal leading-[1.38462] break-words">
                to continue to DardiBook
              </p>
            </div>
            <div className="w-full py-8 sm:py-12 px-8 md:px-12 lg:px-36 flex items-center justify-between">
              <RegistrationForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrganizationHandeler;
