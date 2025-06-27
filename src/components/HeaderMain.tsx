import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogOutBTtn from "./common/LogOutBTtn";
import { ModeToggle } from "./common/mode-toggle";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { User } from "@clerk/nextjs/server";
import HeaderClerkOrganizationSwitcher from "./common/ClerkOrganizationSwitcher";

const HeaderMain = async ({ user }: { user: User | null }) => {
  const allPaths = [
    "about-us",
    "cancellation-policy",
    "contact-us",
    "pricing",
    "privacy-policy",
    "terms-conditions",
  ];

  return (
    <nav className="sticky w-full z-20 top-0 start-0 p-4 pb-0">
      <div className="rounded-lg shadow-lg bg-secondary max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-2">
        <Link
          href={"/"}
          className="cursor-pointer flex items-center ml-0 sm:ml-4 mr-3"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            DardiBook
          </span>
        </Link>
        <div className="flex items-center justify-center flex-row gap-2">
          <HeaderClerkOrganizationSwitcher />

          {/* user menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user?.imageUrl || ""}
                  alt={user?.firstName || ""}
                />
                <AvatarFallback className="rounded-lg">
                  {user?.firstName?.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={"bottom"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                      src={user?.imageUrl || ""}
                      alt={user?.firstName || ""}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.firstName}
                    </span>
                    <span className="truncate text-xs">
                      {user?.emailAddresses[0]?.emailAddress}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <LogOutBTtn
                size={"sm"}
                variant={"destructive"}
                className="w-full"
              />
            </DropdownMenuContent>
          </DropdownMenu>
          <ModeToggle />
          {/* ========= */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant={"outline"}
                size={"sm"}
                className="size-8"
                aria-controls="navbar-sticky"
                // aria-expanded={menuOpen}
              >
                <span className="sr-only">Open main menu</span>
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem asChild>
                <Link href={"/"} aria-current="page">
                  Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Documents</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {allPaths.map((path, key) => {
                return (
                  <DropdownMenuItem key={key} asChild>
                    <Link
                      href={`https://www.dardibook.in/documents/${path}`}
                      className={`cursor-pointer block py-2 px-3 rounded`}
                      target="_blank"
                      aria-current="page"
                    >
                      {path.charAt(0).toUpperCase() + path.slice(1)}
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default HeaderMain;
