"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { createSubscription } from "@/app/services/create-subscription/create-sub";
import { checkSubscriptionStatus } from "@/app/services/checkSubscription";
import { useRouter } from "next/navigation";
import RightBox from "./RightBox";
import LeftBox from "./LeftBox";
import SkeletonBox from "./SkeletonBox";
import getPlanById from "@/app/services/razorpay/getPlanById";
import { auth } from "@/firebase/firebaseConfig";
import { useAuth, useUser } from "@clerk/nextjs";
import SubscriptionDialogBtn from "@/components/common/SubscriptionDialogBtn";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SubscriptionBox = ({ planId }: { planId: string }) => {
  const { orgId, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [thisPlanDetails, setthisPlanDetails] = useState();
  const [alreadySubscribed, setalreadySubscribed] = useState(false);
  const [error, seterror] = useState(false);
  const [loading, setloading] = useState(true);
  const [mobileNumber, setmobileNumber] = useState(
    auth?.currentUser?.phoneNumber
  );
  const [isValid, setIsValid] = useState(true);
  const [subscriptionFields, setsubscriptionFields] = useState({
    planId,
    customer_notify: 1,
    total_count: 1,
  });
  const handleSubscription = async () => {
    // console.log("planid", subscriptionFields);
    try {
      setloading(true);
      const sub = await createSubscription(subscriptionFields);
      const parsedsub = await sub.json();
      // console.log("parsedsub==", parsedsub);
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: parsedsub.id,
        name: "DardiBook",
        description: "description",
        image: "/Logo.svg",
        modal: {
          ondismiss: function () {
            setloading(false);
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_signature: string;
          razorpay_subscription_id: string;
        }) => {
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
            const userDocRef = doc(db, "doctor", orgId || "");
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
          name: isLoaded && user?.firstName,
          email: isLoaded && user?.emailAddresses[0].emailAddress,
          contact: `+91${mobileNumber}`,
        },
        theme: {
          color: "blue",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on(
        "payment.failed",
        function (response: { error: { description: string } }) {
          setloading(false);
          alert(response.error.description);
        }
      );
      paymentObject.open();
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };
  useEffect(() => {
    const fetchPlans = async () => {
      setloading(true);
      if (orgId && isLoaded && planId) {
        const subscriptionStatus = await checkSubscriptionStatus(orgId || "");
        if (subscriptionStatus?.status) {
          setalreadySubscribed(true);
          setloading(false);
        } else {
          if (planId) {
            const planDetails = await getPlanById(planId);
            const parsedPlanDetails = await planDetails.json();
            if (parsedPlanDetails?.item?.name) {
              setthisPlanDetails(parsedPlanDetails);
              setloading(false);
            } else {
              seterror(true);
              setloading(false);
            }
          } else {
            seterror(true);
            setloading(false);
          }
        }
      }
    };
    fetchPlans();
  }, [planId, router, isLoaded, orgId]);

  return (
    <>
      {loading ? (
        <SkeletonBox />
      ) : alreadySubscribed || error ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              {error
                ? "PlanId is not provided or it's not valid"
                : "You are already already subscribed"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error ? (
              <Button
                onClick={() => {
                  router.push("/");
                }}
                type="button"
                variant={"outline"}
                className="rounded-full"
              >
                Home
              </Button>
            ) : (
              <SubscriptionDialogBtn
                size={"sm"}
                variant={"secondary"}
                className="w-full"
              />
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <LeftBox
            subscriptionFields={subscriptionFields}
            setsubscriptionFields={setsubscriptionFields}
            mobileNumber={mobileNumber}
            setmobileNumber={setmobileNumber}
            isValid={isValid}
            setIsValid={setIsValid}
          />
          <div className="hidden md:block w-px mx-5 self-stretch bg-gradient-to-tr from-transparent  to-transparent opacity-25 via-ring"></div>
          <div className="block md:hidden w-full h-px my-5 self-stretch bg-gradient-to-r from-transparent  to-transparent opacity-50 via-ring"></div>
          <RightBox
            thisPlanDetails={thisPlanDetails}
            handleSubscription={handleSubscription}
            isValid={isValid}
          />
        </>
      )}
    </>
  );
};

export default SubscriptionBox;
