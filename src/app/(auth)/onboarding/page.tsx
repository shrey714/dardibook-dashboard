"use server";

import { AnimatePresence } from "framer-motion";
import Intro from "@/components/Onboarding/Intro";
import Features from "@/components/Onboarding/Features";
import Appointments from "@/components/Onboarding/Appointments";
import Prescriptions from "@/components/Onboarding/Prescriptions";
import History from "@/components/Onboarding/History";
import TokenSystem from "@/components/Onboarding/Token";
import Subscription from "@/components/Onboarding/Subscription";
import Done from "@/components/Onboarding/Done";
import {
  BackButton,
  OnboardCompletionButton,
} from "@/components/Welcome/BackButton";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { type } = await searchParams;

  return (
    <div className="mx-auto relative flex min-h-svh w-full flex-col items-center justify-center overflow-x-hidden px-1 sm:px-4 md:px-4">
      <OnboardCompletionButton />
      <AnimatePresence mode="wait">
        <Suspense>
          {!type && <Intro key="intro" />}
          {type && <BackButton />}
          {type === "features" && <Features key="features" />}
          {type === "appointments" && <Appointments key="appointments" />}
          {type === "prescriptions" && <Prescriptions key="prescriptions" />}
          {type === "history" && <History key="history" />}
          {type === "token" && <TokenSystem key="token" />}
          {type === "subscription" && <Subscription key="subscription" />}
          {type === "done" && <Done key="done" />}
        </Suspense>
      </AnimatePresence>
    </div>
  );
}
