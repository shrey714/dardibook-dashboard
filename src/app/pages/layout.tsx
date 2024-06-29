"use client";
import Navigation from "@/components/landingPageLayout/Navigation";
import { ReactNode, useEffect, useRef, useState } from "react";
import { checkSubscription } from "@/app/api/check-subscription/route";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import SubscriptionPlans from "@/components/SubscriptionPlans";
import DefaultComponent from "@/components/DefaultDashboard";

export default function RootLayout({ children }: { children?: ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const modalref = useRef<any>(null);
  // ======================
  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState<string | undefined>("");
  const [subscription, setsubscription] = useState(false);
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
          modalref?.current.showModal();
        }
      }
    };
    checkUserSubscription();
  }, [user, router]);
  // ===================

  return (
    <>
      <dialog id="my_modal_3" className="modal" ref={modalref}>
        <div className="modal-box flex flex-col pt-2 max-w-screen-md">
          <SubscriptionPlans message={message} />
        </div>
      </dialog>
      <div className="min-h-screen">
        <div className="flex">
          <Navigation />
          <div className="flex flex-col flex-grow w-screen md:w-full min-h-screen">
            {loading ? (
              <view
                style={{
                  width: "100%",
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
              </view>
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
      </div>
    </>
  );
}
