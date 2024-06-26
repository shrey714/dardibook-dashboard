"use client";
import React, { ReactNode, useRef, useEffect, useState } from "react";
import Head from "next/head";
import Sidebar from "./Sidebar";
import MenuBarMobile from "./MenuBarMobile";
import DefaultComponent from "../../pages/default/page";
import { checkSubscription } from "@/app/api/check-subscription/route";
import { useAppSelector } from "@/redux/store";
import { useRouter } from "next/navigation";
import SubscriptionPlans from "../../components/SubscriptionPlans";
interface LayoutProps {
  pageTitle?: string;
  children?: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ pageTitle, children }) => {
  let titleConcat = "Responsive Sidebar Example";
  if (pageTitle) titleConcat = pageTitle + " | " + titleConcat;
  const [showSidebar, setShowSidebar] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();
  const modalref = useRef(null);
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
      <Head>
        <title>{titleConcat}</title>
      </Head>
      <dialog id="my_modal_3" className="modal" ref={modalref}>
        <div className="modal-box flex flex-col pt-2 max-w-screen-md">
          <SubscriptionPlans message={message} />
        </div>
      </dialog>
      <div className="min-h-screen">
        <div className="flex">
          <MenuBarMobile setter={setShowSidebar} />
          <Sidebar show={showSidebar} setter={setShowSidebar} />
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
                  zIndex: 100,
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
};
export default Layout;
