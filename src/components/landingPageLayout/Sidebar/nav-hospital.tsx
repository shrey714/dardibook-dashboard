import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Dot } from "lucide-react";
import { useOrganization } from "@clerk/nextjs";

export function NavHospital() {  
  const { isLoaded,organization } = useOrganization()
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className="flex">
          <NavigationMenuTrigger
            className="border-2 gap-1 px-1"
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
                <Avatar className="rounded-sm h-7 w-7 bg-secondary ring-1 ring-background">
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
            <ul className="grid lg:p-4 w-[200px] md:w-[300px] lg:w-[400px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3 m-2">
                <Avatar className="rounded-sm aspect-square h-full w-full bg-secondary ring-1 ring-background">
                  <AvatarImage src={organization?.imageUrl} alt="H" />
                  <AvatarFallback>H</AvatarFallback>
                </Avatar>
              </li>

              <li className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                <div className="text-sm font-medium leading-none">
                  Clinic Name
                </div>
                <p className="line-clamp-2 flex flex-row text-sm leading-snug text-muted-foreground">
                  <Dot />
                  {organization?.name}
                </p>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
