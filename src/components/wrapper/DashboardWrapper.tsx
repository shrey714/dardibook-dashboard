"use client";
import { ReactNode, useEffect, useState } from "react";
import "@/styles/globals.css";
import Loader from "../common/Loader";
import ConnectionStatus from "../common/InternetDialog";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/landingPageLayout/Sidebar/App-sidebar";
import SidebarBreadCrump from "../landingPageLayout/Sidebar/SidebarBreadCrump";
import { useRefContext } from "@/hooks/RefContext";
import { useOrganization } from "@clerk/nextjs";
import { ClerkSubscriptiontypes } from "@/types/SubscriptionTypes";
import { useRouter } from "next/navigation";
import { fromUnixTime, isWithinInterval } from "date-fns";
const DashboardWrapper = ({ children }: { children: ReactNode }) => {
  const { organization, isLoaded } = useOrganization();
  const router = useRouter();
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const snapRef = useRefContext();
  // ======================
  useEffect(() => {
    const checkUserSubscription = async () => {
      setIsCheckingSubscription(true);

      if (isLoaded && organization) {
        const subscription = organization.publicMetadata
          .subscription as ClerkSubscriptiontypes;

        const status = subscription?.status;
        const currentStart = subscription?.current_start;
        const currentEnd = subscription?.current_end;

        const isActive = status === "active" || status === "completed";
        const isCompletedAndWithinRange =
          currentStart &&
          currentEnd &&
          isWithinInterval(new Date(), {
            start: fromUnixTime(currentStart),
            end: fromUnixTime(currentEnd),
          });

        if (isActive && isCompletedAndWithinRange) {
          setIsCheckingSubscription(false);
        } else {
          router.push("/subscription/subscribe");
        }
      }
    };

    checkUserSubscription();
  }, [isLoaded, organization, router]);
  // ===================

  if (!isLoaded || isCheckingSubscription) {
    return (
      <>
        <ConnectionStatus />
        <div className="bg-background left-0 w-screen absolute h-full overflow-hidden flex items-center justify-center z-[100000]">
          <p className="absolute bottom-2 right-2 text-muted-foreground text-xs font-medium">
            Getting your Dashboard ready as per your subscription...
          </p>
          <Loader size="large" />
        </div>
      </>
    );
  }

  return (
    <>
      <ConnectionStatus />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset ref={snapRef} className="h-svh overflow-hidden">
          <SidebarBreadCrump />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default DashboardWrapper;
