/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { signOutUser } from "@/firebase/firebaseAuth";
import { useAppDispatch } from "@/redux/store";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LogOutBTtn from "./common/LogOutBTtn";
import { ModeToggle } from "./common/mode-toggle";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const HeaderMain = ({ user }: any) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const allPaths = [
    "about-us",
    "cancellation-policy",
    "contact-us",
    "pricing",
    "privacy-policy",
    "terms-conditions",
  ];
  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="fixed w-full z-20 top-0 start-0 p-4">
      <div className="rounded-lg shadow-lg bg-secondary max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-2">
        <Link href={"/"} className="cursor-pointer flex items-center ml-4 mr-3">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            DardiBook
          </span>
        </Link>
        <div className="flex items-center justify-center flex-row gap-2">
          {/* user menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={user?.photoURL || ""}
                  alt={user?.displayName || ""}
                />
                <AvatarFallback className="rounded-lg">
                  {user?.displayName?.slice(0, 2)}
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
                      src={user?.photoURL || ""}
                      alt={user?.displayName || ""}
                    />
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user?.displayName}
                    </span>
                    <span className="truncate text-xs">{user?.email}</span>
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
          <Button
            onClick={handleMenuToggle}
            type="button"
            variant={"outline"}
            size={"sm"}
            className="size-8"
            aria-controls="navbar-sticky"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <Menu />
          </Button>
        </div>
        <div
          className={`items-center justify-between ${
            menuOpen ? "flex" : "hidden"
          } w-full`}
          id="navbar-sticky"
        >
          <ul className="flex flex-1 flex-col p-4  mt-4 font-medium border rounded-lg border-border">
            <li>
              <Button
                asChild
                variant={"outline"}
                className="w-full justify-start"
              >
                <Link href={"/"} aria-current="page">
                  Home
                </Link>
              </Button>
            </li>
            <Accordion
              defaultValue="links"
              type="single"
              collapsible
              className="w-full col-span-full px-8"
            >
              <AccordionItem value="links" className="border-0">
                <AccordionTrigger className="text-lg font-medium">
                  Documents
                </AccordionTrigger>
                <AccordionContent>
                  <div className="">
                    {allPaths.map((path, key) => {
                      return (
                        <li key={key}>
                          <Button
                            asChild
                            variant={"outline"}
                            className="w-full justify-start"
                          >
                            <Link
                              onClick={handleMenuToggle}
                              href={`https://www.dardibook.in/documents/${path}`}
                              className={`cursor-pointer block py-2 px-3 rounded`}
                              target="_blank"
                              aria-current="page"
                            >
                              {path.charAt(0).toUpperCase() + path.slice(1)}
                            </Link>
                          </Button>
                        </li>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <li>
              <Button
                asChild
                variant={"outline"}
                className="w-full justify-start"
              >
                <Link href={"/dashboard/settings"} aria-current="page">
                  Setting
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default HeaderMain;
