"use client";
import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/store";
import { db } from "@/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import RightBox from "./RightBox";
import LeftBox from "./LeftBox";
import Skeleton from "./Skeleton";
import { checkSubscription } from "@/app/api/check-subscription/route";
import { createSubscription } from "@/app/api/create-subscription/route";
import getPlanById from "@/app/api/razorpay/getPlanById";
import HeaderMain from "@/components/HeaderMain";
export default function Subscribe() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");
  const user = useAppSelector<any>((state) => state.auth.user);
  const [thisPlanDetails, setthisPlanDetails] = useState();
  const [loading, setloading] = useState(true);
  const [subscriptionFields, setsubscriptionFields] = useState({
    planId,
    customer_notify: 1,
    total_count: 1,
  });
  const handleSubscription = async () => {
    console.log("planid", subscriptionFields);
    try {
      setloading(true);
      const sub = await createSubscription(subscriptionFields);
      const parsedsub = await sub.json();
      console.log("parsedsub==", parsedsub);
      const options = {
        key: "rzp_test_aKsPMFZwmfbD4d",
        subscription_id: parsedsub.id,
        name: "DardiBook",
        description: "description",
        modal: {
          ondismiss: function () {
            setloading(false);
          },
        },
        handler: async (response: any) => {
          setloading(true);
          const legitCheck = await fetch(
            "https://backend.dardibook.in/verification",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json", // Set the content type to JSON
              },
              body: JSON.stringify({
                razorpay_payment_id: response?.razorpay_payment_id,
                sid: parsedsub.id,
                razorpay_signature: response?.razorpay_signature,
              }),
            }
          );
          const legit = await legitCheck.json();

          if (legit.status === "success") {
            const userDocRef = doc(db, "payment", user.uid);
            await setDoc(
              userDocRef,
              {
                subscriptionId: response?.razorpay_subscription_id,
              },
              { merge: true }
            );
            // setloading(false);
            console.log("payment  == succesfully done");
            router.push("/");
          } else {
            setloading(false);
          }

          // console.log("response", response);
        },
        prefill: {
          name: user?.displayName,
          email: user?.email,
          contact: "+919512095862",
        },
        notes: {
          note_key_1: "Tea. Earl Grey. Hot",
          note_key_2: "Make it so.",
        },
        theme: {
          color: "blue",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        setloading(false);
        alert(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };
  useEffect(() => {
    const fetchPlans = async () => {
      setloading(true);
      if (user) {
        const subscriptionStatus = await checkSubscription(user.uid);
        if (subscriptionStatus?.status) {
          router.push("/");
        } else {
          if (planId) {
            const planDetails = await getPlanById(planId);
            const parsedPlanDetails = await planDetails.json();
            setthisPlanDetails(parsedPlanDetails);
            setloading(false);
          } else {
            router.push("/");
          }
        }
      }
    };
    fetchPlans();
  }, [planId, router, user]);

  return (
    <div className="flex pt-24 flex-col justify-evenly items-center h-screen w-screen overflow-hidden">
      <Image
        src="/Logo.svg"
        fill={true}
        className="document-background-image"
        alt="logo"
      />
      <HeaderMain user={user} />
      <div className=" flex flex-row p-6 mx-auto w-9/12 h-auto text-center rounded-lg borderborder-gray-600 xl:p-8 bg-gray-800 bg-opacity-95 text-white">
        {loading ? (
          <Skeleton />
        ) : (
          <>
            <LeftBox
              subscriptionFields={subscriptionFields}
              setsubscriptionFields={setsubscriptionFields}
            />
            <div className="w-px mx-5 self-stretch bg-gradient-to-tr from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400"></div>
            <RightBox
              thisPlanDetails={thisPlanDetails}
              handleSubscription={handleSubscription}
              subscriptionFields={subscriptionFields}
            />
          </>
        )}
      </div>
    </div>
  );
}
