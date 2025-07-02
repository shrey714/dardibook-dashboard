"use client";

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
import BillActivity from "@/components/Settings/SubscriptionInfo/BillActivity";

export default function UserBilling() {
  return (
    <div className="w-full py-2 sm:py-5 px-2 md:px-5 2xl:flex 2xl:flex-row 2xl:gap-5 2xl:justify-center">
      <div className="h-min w-full mx-auto max-w-4xl 2xl:mx-0 2xl:max-w-xl">
        <Card className="bg-sidebar/70 shadow-none border w-full">
          <CardHeader className="border-b p-4">
            <CardTitle className="font-medium tracking-normal">
              Billing & Subscription
            </CardTitle>
            <CardDescription>
              Manage your subscription and billing details
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row">
              <div>
                <div className="flex items-center gap-2">
                  <Package className="text-primary size-5" />
                  <h2 className="text-lg font-semibold">Pro Plan</h2>
                  <Badge variant="success">Current Plan</Badge>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">
                  $29/month • Renews on April 1, 2024
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <PlayIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Resume Subscription</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <PauseIcon />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Pause Subscription</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="destructive" size="icon">
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

            <div className="mt-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className="text-primary size-3.5" />
                    <span className="text-xs font-normal">
                      Current billing cycle (Jul 01 - Jul 31)
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    29 days remaining
                  </span>
                </div>
                <Progress value={71.5} className="h-[4px]" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t p-3 pl-4 flex items-start justify-between gap-4 flex-row">
            {/* Payment Method */}
            <div className="space-y-1.5">
              <h2 className="text-base font-medium leading-none">
                Payment Method
              </h2>
              <div className="flex items-center gap-2">
                <CreditCard className="text-muted-foreground size-4" />
                <span className="text-muted-foreground text-sm">
                  Visa ending in 4242
                </span>
              </div>
            </div>

            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary" size="icon">
                    <SquareArrowOutUpRightIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Update Payment Method</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardFooter>
        </Card>
      </div>

      <div className="flex flex-col mt-2 sm:mt-5 2xl:mt-0 mx-auto 2xl:mx-0 max-w-4xl gap-2 w-full">
        <BillActivity />
      </div>
    </div>
  );
}
