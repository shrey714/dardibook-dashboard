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
        <BlockedModal isOpen={isModalOpen}>
          <SubscriptionPlans message={message} />
        </BlockedModal>
      )}
      <ConnectionStatus />
      <div className="h-svh overflow-hidden flex">
        {/* <div className="md:h-screen md:overflow-hidden flex"> for mobile view */}
        <Navigation />
        <div className="flex flex-col flex-grow w-screen md:w-full overflow-y-auto bg-gray-300">
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
                background: "rgba(0,0,0,0.5)",
                zIndex: 100000,
              }}
            >
              <Loader
                size="large"
                color="text-primary"
                secondaryColor="text-gray-300"
              />
            </div>
          ) : subscription ? (
            children ? (
              children
            ) : (
              <DefaultComponent />
            )
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardWrapper;
