"use server";

import { AnimatePresence } from "framer-motion";
import Intro from "@/components/Welcome/intro";
import Next from "@/components/Welcome/next";
import Select from "@/components/Welcome/select";
import Dataroom from "@/components/Welcome/dataroom";
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
    <div className="mx-auto flex h-screen max-w-3xl flex-col items-center justify-center overflow-x-hidden">
      <OnboardCompletionButton />
      <AnimatePresence mode="wait">
        <Suspense>
          {type ? <BackButton /> : <Intro key="intro" />}
          {type === "next" && <Next key="next" />}
          {type === "select" && <Select key="select" />}
          {type === "dataroom" && <Dataroom key="dataroom" />}
        </Suspense>
      </AnimatePresence>
    </div>
  );
}
