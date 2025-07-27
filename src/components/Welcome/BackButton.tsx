"use client"; // Ensure this is a client component

import { ArrowLeft as ArrowLeftIcon, ArrowRightCircle } from "lucide-react";
import { completeOnboarding } from "./_actions";
import { Button } from "../ui/button";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BackButton() {
  const router = useRouter();

  return (
    <Button
      variant={"outline"}
      effect={"ringHover"}
      className="group fixed z-50 rounded-full p-2 transition-all h-auto w-auto top-2 left-2 sm:left-8 aspect-square hover:ring-border/90"
      onClick={() => router.back()}
    >
      <ArrowLeftIcon className="h-8 w-8 group-active:scale-90" />
    </Button>
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
        router.push("/organizations");
        setloader(false);
      },
      () => {
        setloader(false);
      }
    );
    setloader(false);
  };
  return (
    <div className="z-40 bg-background/50 backdrop-blur-md flex items-center px-2 sm:px-8 py-2 fixed w-full top-0">
      <Button
        onClick={() => {
          handleSubmit();
        }}
        variant={"link"}
        className={"z-40 p-2 text-muted-foreground mr-0 ml-auto leading-normal"}
        loading={loader}
        effect={"expandIcon"}
        icon={ArrowRightCircle}
        iconPlacement="right"
      >
        Skip to dashboard
      </Button>
    </div>
  );
}
