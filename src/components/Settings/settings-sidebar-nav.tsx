"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useAuth } from "@clerk/nextjs";
import { sidebarNavItems } from "./settings-sidebar-config";

export function SettingSidebarNav() {
  const pathname = usePathname();
  const { orgRole, isLoaded } = useAuth();

  return (
    <div className="border-grid scroll-mt-24 border-b px-2 sticky top-0 bg-background z-[1]">
      <div className="container-wrapper">
        <div className="container flex items-center py-3">
          <div className="relative overflow-hidden">
            <ScrollArea className="max-w-none">
              <div className="flex items-center">
                {isLoaded &&
                  orgRole &&
                  sidebarNavItems
                    .filter((page) => page.roles.includes(orgRole))
                    .map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="flex h-7 text-sm md:text-base shrink-0 items-center justify-start whitespace-nowrap rounded-full px-4 text-center  font-medium text-muted-foreground transition-colors hover:text-foreground data-[active=true]:bg-muted data-[active=true]:text-foreground"
                        data-active={pathname === item.href}
                      >
                        {item.title}
                      </Link>
                    ))}
              </div>
              <ScrollBar orientation="horizontal" className="invisible" />
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
