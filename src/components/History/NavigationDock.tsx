"use client";

import { HistoryIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Dock, DockIcon } from "@/components/ui/dock";
import { useAuth } from "@clerk/nextjs";
import { historyPages } from "@/app/dashboard/history/_actions";
import { usePathname } from "next/navigation";

import { CalendarIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export type IconProps = React.HTMLAttributes<SVGElement>;

export function NavigationDock() {
  const { orgRole, isLoaded } = useAuth();
  const pathname = usePathname();

  const [isVisible, setIsVisible] = useState<true | undefined>(undefined);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(undefined);
    }, 2000);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (
    orgRole &&
    isLoaded &&
    historyPages.some((page) => page.href === pathname)
  ) {
    return (
      <HoverCard openDelay={60} open={isVisible}>
        <HoverCardTrigger asChild>
          <Button
            className={`absolute shadow-[inset_0px_0px_5px_8px_#00000024] border-b-0 bg-border left-1/2 -translate-x-1/2 bottom-0 p-0 m-0 w-60 h-2.5 rounded-b-none transition-all duration-500 ease-out`}
            variant="outline"
          ></Button>
        </HoverCardTrigger>
        <HoverCardContent
          side="top"
          className="w-auto rounded-2xl p-0 bg-transparent border-0 data-[side=top]:slide-in-from-bottom-10 data-[state=closed]:slide-out-to-bottom-10"
        >
          <TooltipProvider>
            <Dock direction="middle" className="mt-0">
              <DockIcon>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/dashboard/history"
                      aria-label="History Home"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "size-full rounded-full"
                      )}
                    >
                      <HistoryIcon className="size-4" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>History Home</p>
                  </TooltipContent>
                </Tooltip>
              </DockIcon>
              <Separator orientation="vertical" className="h-full" />
              {historyPages
                .filter((page) => page.roles.includes(orgRole))
                .map((page, index) => (
                  <DockIcon key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={page.href}
                          aria-label={page.name}
                          className={cn(
                            buttonVariants({ variant: "ghost", size: "icon" }),
                            "size-full rounded-full"
                          )}
                        >
                          <page.Icon className="size-4" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{page.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </DockIcon>
                ))}
            </Dock>
          </TooltipProvider>
        </HoverCardContent>
      </HoverCard>
    );
  } else {
    return <></>;
  }
}
