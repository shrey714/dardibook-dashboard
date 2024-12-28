"use client"; // Ensure this is a client component

import { ArrowLeft as ArrowLeftIcon } from "lucide-react";
import { completeOnboarding } from "./_actions";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loader from "../common/Loader";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      className="group absolute left-2 top-10 z-40 rounded-full p-2 transition-all hover:bg-gray-400 sm:left-10"
      onClick={() => router.back()}
    >
      <ArrowLeftIcon className="h-8 w-8 text-gray-500 group-hover:text-gray-800 group-active:scale-90" />
    </button>
  );
}

export function OnboardCompletionButton() {
  const { user } = useUser();
  const router = useRouter();
  const [loader, setloader] = useState(false);

  const handleSubmit = async () => {
    setloader(true);
    await completeOnboarding().then(
      async () => {
        await user?.reload();
        router.push("/");
        setloader(false);
      },
      () => {
        setloader(false);
      }
    );
    setloader(false);
  };
  return (
    <Button
      onClick={() => {
        handleSubmit();
      }}
      variant={"link"}
      className={
        "absolute right-2 top-10 z-40 p-2 text-muted-foreground sm:right-10 block"
      }
    >
      {loader ? <Loader size="small" /> : "Skip to dashboard"}
    </Button>
  );
}
