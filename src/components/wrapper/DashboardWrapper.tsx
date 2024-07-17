"use client";
import { ReactNode, useEffect, useState } from "react";
import Navigation from "@/components/landingPageLayout/Navigation";
import { checkSubscription } from "@/app/api/check-subscription/route";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import DefaultComponent from "@/components/DefaultDashboard";
import "@/styles/globals.css";
import BlockedModal from "@/components/BlockedModal";
const DashboardWrapper = ({ children }: { children: ReactNode }) => {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

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
        const subscriptionStatus = await checkSubscription(user.uid);
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
  }, [user, router]);
  // ===================
  return (
    <>
      {isModalOpen && (
        <BlockedModal isOpen={isModalOpen}>
          <SubscriptionPlans message={message} />
        </BlockedModal>
      )}
      <div className="h-screen overflow-hidden flex">
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
              <span className="loading loading-spinner loading-md"></span>
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
