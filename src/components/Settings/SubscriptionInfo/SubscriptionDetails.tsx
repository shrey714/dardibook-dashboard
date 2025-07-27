"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Package,
  PauseIcon,
  PlayIcon,
  RefreshCw,
  SquareArrowOutUpRightIcon,
  XIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useOrganization } from "@clerk/nextjs";
import { ClerkSubscriptiontypes } from "@/types/SubscriptionTypes";
import {
  getPlanDetails,
  getSubscriptionDetails,
} from "@/lib/actions/SubscriptionHelpers";
import { Subscriptions } from "razorpay/dist/types/subscriptions";
import { Plans } from "razorpay/dist/types/plans";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { addMonths, differenceInDays, format } from "date-fns";

const SubscriptionDetails = () => {
  const [subscriptionDetails, setSubscriptionDetails] =
    useState<Subscriptions.RazorpaySubscription>();
  const [planDetails, setPlanDetails] = useState<Plans.RazorPayPlans>();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { organization, isLoaded } = useOrganization();

  useEffect(() => {
    const fetchDetails = async () => {
      if (organization && isLoaded) {
        const data = organization.publicMetadata
          .subscription as ClerkSubscriptiontypes;
        if (!data?.sub_id || !data?.plan_id) {
          setError("Subscription/Plan not found.");
          return;
        }
        setLoading(true);
        setError(null);
        try {
          const [subscription, plan] = await Promise.all([
            getSubscriptionDetails(data.sub_id),
            getPlanDetails(data.plan_id),
          ]);
          setSubscriptionDetails(subscription);
          setPlanDetails(plan);
        } catch (err) {
          console.error(err);
          setError("Failed to fetch subscription or plan details.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDetails();
  }, [organization, isLoaded]);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-medium">
            Billing & Subscription
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing details
          </CardDescription>
        </CardHeader>

        {loading ? (
          <>
            <CardContent>
              <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
                <div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-56" />
                  </div>
                  <Skeleton className="h-5 w-44 mt-1" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="size-9" />
                  <Skeleton className="size-9" />
                  <Skeleton className="size-9" />
                </div>
              </div>
              <div className="mt-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Skeleton className="w-44 h-4" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                  <Skeleton className="w-full h-1" />
                </div>
              </div>
              <div className="mt-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Skeleton className="w-44 h-4" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                  <Skeleton className="w-full h-1" />
                </div>
              </div>
              <div className="mt-4">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <Skeleton className="w-44 h-4" />
                    <Skeleton className="w-24 h-4" />
                  </div>
                  <Skeleton className="w-full h-1" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-start justify-between gap-4 flex-row">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-5 w-36" />
              </div>

              <Skeleton className="size-9" />
            </CardFooter>
          </>
        ) : error ? (
          <div className="w-full h-full text-muted-foreground text-sm md:text-base p-4 overflow-hidden flex items-center justify-center gap-4 flex-col">
            <img
              className="w-full max-w-40 lg:mx-auto"
              src="/ErrorTriangle.svg"
              alt="Error"
            />
            {error}
          </div>
        ) : (
          !loading &&
          !error &&
          subscriptionDetails &&
          planDetails && (
            <>
              <CardContent>
                <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
                  <div>
                    <div className="flex items-center gap-2">
                      <Package className="text-primary size-5" />
                      <h2 className="text-lg font-semibold">
                        {planDetails.item.name}
                      </h2>
                      <Badge
                        variant="outline"
                        className="text-xs font-semibold"
                      >
                        Current Plan
                      </Badge>
                      <Badge
                        variant={
                          subscriptionDetails.status === "active" ||
                          subscriptionDetails.status === "completed"
                            ? "success"
                            : "destructive"
                        }
                        className="text-xs font-semibold"
                      >
                        {subscriptionDetails.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: planDetails.item.currency.toUpperCase(),
                        minimumFractionDigits: 2,
                      }).format(Number(planDetails.item.amount) / 100)}{" "}
                      {planDetails.period} / Next Due on{" "}
                      {format(
                        new Date(subscriptionDetails.charge_at * 1000),
                        "LLL dd, yyyy"
                      )}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <TooltipProvider delayDuration={100}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button disabled variant="outline" size="icon">
                            <PlayIcon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Resume Subscription</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button disabled variant="outline" size="icon">
                            <PauseIcon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Pause Subscription</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button disabled variant="destructive" size="icon">
                            <XIcon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Cancel Subscription</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>

                {subscriptionDetails.current_start &&
                  subscriptionDetails.current_end &&
                  (() => {
                    const startDate = new Date(
                      subscriptionDetails.current_start * 1000
                    );
                    const endDate = new Date(
                      subscriptionDetails.current_end * 1000
                    );
                    const today = new Date();

                    const totalDays = differenceInDays(endDate, startDate);
                    const remainingDays = Math.max(
                      differenceInDays(endDate, today),
                      0
                    );
                    const elapsedDays = totalDays - remainingDays;
                    const progress = (elapsedDays / totalDays) * 100;

                    return (
                      <div className="mt-6">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <RefreshCw className="text-primary size-3.5" />
                              <span className="text-xs font-normal">
                                Current billing cycle (
                                {format(startDate, "LLL dd, yy")} -{" "}
                                {format(endDate, "LLL dd, yy")})
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground text-end">
                              {remainingDays} day
                              {remainingDays !== 1 ? "s" : ""} remaining
                            </span>
                          </div>
                          <Progress value={progress} className="h-[4px]" />
                        </div>
                      </div>
                    );
                  })()}

                {subscriptionDetails.paid_count &&
                  subscriptionDetails.total_count &&
                  subscriptionDetails.remaining_count &&
                  (() => {
                    const paid = subscriptionDetails.paid_count;
                    const total = subscriptionDetails.total_count;
                    const remaining = subscriptionDetails.remaining_count;
                    const progress = (paid / total) * 100;

                    return (
                      <div className="mt-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="text-green-600 size-3.5" />
                              <span className="text-xs font-normal">
                                Subscription progress ({paid} of {total}{" "}
                                payments completed)
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground text-end">
                              {remaining} remaining
                            </span>
                          </div>
                          <Progress value={progress} className="h-[4px]" />
                        </div>
                      </div>
                    );
                  })()}

                {subscriptionDetails.start_at &&
                  subscriptionDetails.end_at &&
                  (() => {
                    const startDate = new Date(
                      subscriptionDetails.start_at * 1000
                    );
                    const endDate = addMonths(
                      new Date(subscriptionDetails.end_at * 1000),
                      1
                    );
                    const today = new Date();

                    const totalDuration = differenceInDays(endDate, startDate);
                    const elapsedDuration = Math.min(
                      Math.max(differenceInDays(today, startDate), 0),
                      totalDuration
                    );
                    const progress = (elapsedDuration / totalDuration) * 100;
                    const remaining = Math.max(
                      differenceInDays(endDate, today),
                      0
                    );

                    return (
                      <div className="mt-4">
                        <div>
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <CalendarDays className="text-primary size-3.5" />
                              <span className="text-xs font-normal">
                                Subscription duration (
                                {format(startDate, "LLL dd, yyyy")} -{" "}
                                {format(endDate, "LLL dd, yyyy")})
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground text-end">
                              {remaining} day{remaining !== 1 ? "s" : ""}{" "}
                              remaining
                            </span>
                          </div>
                          <Progress value={progress} className="h-[4px]" />
                        </div>
                      </div>
                    );
                  })()}
              </CardContent>
              <CardFooter className="flex items-start justify-between gap-4 flex-row">
                <div className="space-y-1.5">
                  <h2 className="text-base font-medium leading-none">
                    Payment Method
                  </h2>
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-muted-foreground size-4" />
                    <span className="text-muted-foreground text-sm">
                      {subscriptionDetails.payment_method}
                    </span>
                  </div>
                </div>

                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="secondary" size="icon" asChild>
                        <Link
                          href={subscriptionDetails.short_url}
                          target="_blank"
                        >
                          <SquareArrowOutUpRightIcon />
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Update Payment Method</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </>
          )
        )}
      </Card>
    </>
  );
};

export default SubscriptionDetails;
