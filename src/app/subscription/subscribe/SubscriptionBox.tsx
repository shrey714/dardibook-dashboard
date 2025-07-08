"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import RightBox from "./RightBox";
import LeftBox from "./LeftBox";
import SkeletonBox from "./SubscriptionLoadingBox";
import {
  OrganizationSwitcher,
  useAuth,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Script from "next/script";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { BadgeCheck } from "lucide-react";
import {
  ClerkSubscriptiontypes,
  RazorPayPlanTypes,
} from "@/types/SubscriptionTypes";
import Link from "next/link";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createSubscriptionWithUserNote,
  verifyAndActivateSubscription,
} from "@/lib/actions/SubscriptionHelpers";
import { fromUnixTime, isWithinInterval } from "date-fns";

const SubscriptionBox = () => {
  const { resolvedTheme } = useTheme();
  const { organization, isLoaded: OrgLoaded } = useOrganization();
  const { orgId } = useAuth();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [allplans, setallplans] = useState<RazorPayPlanTypes[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>();
  const [alreadySubscribed, setalreadySubscribed] = useState(false);
  const [error, seterror] = useState(false);
  const [loading, setloading] = useState(true);
  const [mobileNumber, setmobileNumber] = useState<string>();
  const [isValid, setIsValid] = useState(true);
  const [subscriptionFields, setsubscriptionFields] = useState({
    customer_notify: 1,
    total_count: 1,
  });
  const handleSubscription = async (planId: string) => {
    if (!orgId || !organization) {
      return;
    }
    try {
      setloading(true);
      const subscriptiondata = await createSubscriptionWithUserNote({
        ...subscriptionFields,
        planId,
        orgid: orgId,
      });
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        subscription_id: subscriptiondata.id,
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
          const result = await verifyAndActivateSubscription({
            response,
            subscriptionId: subscriptiondata.id,
            orgId,
            sub_id: response.razorpay_subscription_id,
            plan_id: planId,
          });

          if (result.success) {
            organization.reload();
            router.replace("/");
          } else {
            setloading(false);
            console.error("Subscription verification failed:", result.reason);
          }
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
      if (OrgLoaded && organization) {
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
          setalreadySubscribed(true);
          setloading(false);
        } else {
          const q = query(
            collection(db, "Subscription-Plans"),
            where("item.active", "==", true)
          );
          const snapshot = await getDocs(q);
          const plans: RazorPayPlanTypes[] = snapshot.docs.map((doc) => ({
            ...(doc.data() as RazorPayPlanTypes),
          }));
          if (plans) {
            setallplans(plans);
            setSelectedPlanId(plans[0].id);
            setloading(false);
          } else {
            seterror(true);
            setloading(false);
          }
        }
      }
    };
    fetchPlans();
    if (OrgLoaded && organization && organization.publicMetadata.phoneNumber) {
      setmobileNumber(
        organization.publicMetadata.phoneNumber as unknown as string
      );
    }
  }, [router, OrgLoaded, organization]);

  return (
    <>
      <OrganizationSwitcher
        fallback={<Skeleton className="h-[68px] w-52" />}
        hidePersonal={true}
        appearance={{
          elements: {
            organizationSwitcherTrigger:
              "w-full border-0 border-border bg-muted py-4 px-5 shadow-md",
            organizationSwitcherPopoverMain:
              "w-full shadow-none bg-muted rounded-none pt-0",
            organizationPreviewAvatarBox: "h-9 w-9",
            organizationSwitcherPopoverFooter: {
              display: "none",
            },
          },
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
        }}
      />

      {loading ? (
        <SkeletonBox />
      ) : alreadySubscribed || error ? (
        <div className=" flex flex-col md:flex-row p-6 mx-auto max-w-screen-xl h-min text-center rounded-lg border-2 border-border xl:p-8 bg-secondary/90 shadow-md">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>
                {error
                  ? "PlanId is not provided or it's not valid"
                  : "You are already already subscribed"}
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <RadioGroup
            value={selectedPlanId}
            onValueChange={(plan) => setSelectedPlanId(plan)}
            className="grid w-full max-w-6xl gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            {allplans?.map((plan, i) => (
              <div key={i}>
                <RadioGroupItem
                  value={plan.id}
                  id={plan.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={plan.id}
                  className="flex cursor-pointer flex-col items-center overflow-hidden justify-between rounded-md w-full border-2 border-border bg-popover hover:text-accent-foreground peer-data-[state=checked]:border-[rgba(120,119,198)] [&:has([data-state=checked])]:border-[rgba(120,119,198)]"
                >
                  <div
                    className={
                      "relative flex flex-col gap-5 w-full overflow-hidden p-6 shadow text-foreground"
                    }
                  >
                    {selectedPlanId === plan.id && <HighlightedBackground />}
                    {selectedPlanId === plan.id && <PopularBackground />}
                    <h2 className="flex items-center gap-3 text-xl font-medium capitalize">
                      {plan.item.name}
                    </h2>
                    <div className="relative h-12">
                      {typeof plan.item.amount === "number" ? (
                        <>
                          <p className="text-4xl font-medium">
                            {new Intl.NumberFormat("en-IN", {
                              style: "currency",
                              currency: plan.item.currency.toUpperCase(),
                              minimumFractionDigits: 2,
                            }).format(Number(plan.item.amount) / 100)}
                          </p>
                          <p className="-mt-1 text-xs font-medium">Per month</p>
                        </>
                      ) : (
                        <h1 className="text-4xl font-medium">
                          {plan.item.amount}
                        </h1>
                      )}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-sm font-medium">
                        {plan.item.description}
                      </h3>
                      <ul className="space-y-2">
                        {plan.notes &&
                          Object.values(plan.notes).map((value, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                            >
                              <BadgeCheck strokeWidth={1} size={16} />
                              {value}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </Label>
              </div>
            ))}

            <div className="relative gap-5 p-6 shadow text-foreground flex flex-col items-center overflow-hidden justify-between rounded-md w-full border-2 border-[rgba(120,119,198,0.6)] dark:border-[rgba(120,119,198,0.3)] bg-popover">
              <h2 className="flex items-center gap-3 text-xl font-medium capitalize z-10">
                Enterprise
              </h2>
              <div className="relative z-10">
                <h1 className="text-4xl font-medium">Custom</h1>
              </div>
              <div className="flex-1 space-y-2 z-10">
                <ul className="space-y-2">
                  {["Everything in Organizations", "Up to 5 team members"].map(
                    (value, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
                      >
                        <BadgeCheck strokeWidth={1} size={16} />
                        {value}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <Button
                asChild
                className=" rounded-full shadow-sm z-10"
                variant={"outline"}
              >
                <Link
                  target="_blank"
                  href="https://dardibook.in/documents/contact-us"
                >
                  Contact Us
                </Link>
              </Button>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:10px_10px] opacity-100 dark:opacity-60 z-0" />
              <div className="absolute inset-0 bg-[rgba(120,119,198,0.3)] dark:bg-[rgba(120,119,198,0.2)] opacity-100 z-0" />
            </div>
          </RadioGroup>

          <div
            className=" flex flex-col md:flex-row p-6 mx-auto max-w-screen-xl h-auto text-center rounded-lg border-2 border-border xl:p-8 bg-secondary/90 shadow-md flex-1"
            key={selectedPlanId}
          >
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
              thisPlanDetails={allplans?.find(
                (plan) => plan.id === selectedPlanId
              )}
              handleSubscription={handleSubscription}
              isValid={isValid}
            />
          </div>
        </>
      )}

      <Script
        id="razorpay-checkout-js"
        async
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
    </>
  );
};

export default SubscriptionBox;

const HighlightedBackground = () => (
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:45px_45px] opacity-100 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:opacity-60" />
);

const PopularBackground = () => (
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.6),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.4),rgba(255,255,255,0))]" />
);
