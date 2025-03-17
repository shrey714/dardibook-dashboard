import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@clerk/nextjs";

export function NavHospital() {
  const { isLoaded, organization } = useOrganization();
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className="flex">
          <NavigationMenuTrigger
            className="border rounded-full gap-1 px-1 bg-secondary"
            disabled={!isLoaded}
          >
            {!isLoaded ? (
              <div className="flex items-center gap-1">
                <Skeleton className="h-7 w-7 rounded-sm" />
                <div className="hidden md:block">
                  <Skeleton className="h-5 w-[50px]" />
                </div>
              </div>
            ) : (
              <>
                <Avatar className="rounded-full h-7 w-7 bg-secondary ring-0">
                  <AvatarImage src={organization?.imageUrl} alt="H" />
                  <AvatarFallback>H</AvatarFallback>
                </Avatar>
                <div className="w-[50px] overflow-hidden truncate hidden md:block">
                  {organization?.name}
                </div>
              </>
            )}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-2 w-32 flex flex-1 flex-col gap-2">
              <Avatar className="rounded-full border overflow-hidden aspect-square h-full w-full bg-transparent">
                <AvatarImage src={organization?.imageUrl} alt="H" />
                <AvatarFallback>H</AvatarFallback>
              </Avatar>

              <div className="border-dotted border rounded-md py-1 px-2 leading-none">
                {organization?.name}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
