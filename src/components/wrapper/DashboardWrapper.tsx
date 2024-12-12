"use client";
import { ReactNode, useEffect, useState } from "react";
import Navigation from "@/components/landingPageLayout/Navigation";
import { checkSubscriptionStatus } from "@/app/services/checkSubscription";
import { useAppSelector } from "@/redux/store";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import DefaultComponent from "@/components/DefaultDashboard";
import "@/styles/globals.css";
import BlockedModal from "@/components/BlockedModal";
import Loader from "../common/Loader";
import ConnectionStatus from "../common/InternetDialog";
import Link from "next/link";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppSidebar } from "@/components/landingPageLayout/Sidebar/App-sidebar";
import SidebarBreadCrump from "../landingPageLayout/Sidebar/SidebarBreadCrump";
const DashboardWrapper = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector((state) => state.auth.user);

  // ======================
  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState<string | undefined>("");
  const [subscription, setsubscription] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // ======================
  useEffect(() => {
    const checkUserSubscription = async () => {
      setloading(true);
      if (user) {
        const subscriptionStatus = await checkSubscriptionStatus(user.uid);
        if (subscriptionStatus?.status) {
          setloading(false);
          setsubscription(true);
        } else {
          setloading(false);
          setmessage(subscriptionStatus?.message);
          setsubscription(false);
          setIsModalOpen(true);
        }
      }
    };
    checkUserSubscription();
  }, [user]);
  // ===================
  return (
    <>
      {isModalOpen && (
        <Dialog open={true}>
          <DialogContent className="md:max-w-3xl overflow-y-auto max-h-full" showCloseBtn={false}>
            <DialogHeader>
              <DialogTitle>Subscription Info</DialogTitle>
              <DialogDescription hidden>
                DESC
              </DialogDescription>
            </DialogHeader>
            <SubscriptionPlans message={message} />
          </DialogContent>
        </Dialog>
      )}
      <ConnectionStatus />
      {/* <div className="min-h-svh flex"> */}
      {/* <div className="md:h-screen md:overflow-hidden flex"> for mobile view */}
      {/* <Navigation /> */}
      {/* <div className="flex flex-col flex-grow w-screen md:w-full bg-background"> */}
      {loading ? (
        <div
          style={{
            left: 0,
            width: "100vw",
            position: "absolute",
            height: "100%",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100000,
          }}
          className="bg-background"
        >
          <Loader size="large" />
        </div>
      ) : subscription ? (
        children ? (
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="h-svh overflow-hidden">
              <SidebarBreadCrump />
              {children}
            </SidebarInset>
          </SidebarProvider>
        ) : (
          <DefaultComponent />
        )
      ) : (
        <></>
      )}
      {/* </div> */}
      {/* </div> */}
    </>
  );
};

export default DashboardWrapper;
