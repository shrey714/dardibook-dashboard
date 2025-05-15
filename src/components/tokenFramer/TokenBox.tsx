"use client";
import React from "react";
import BoxContainer from "./BoxContainer";
import useToken from "@/firebase/useToken"; // Adjust the path accordingly
import {
  ClipboardPlusIcon,
  GhostIcon,
  InfoIcon,
  Minus,
  Pause,
  Play,
  Plus,
  UserCogIcon,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { useAuth } from "@clerk/nextjs";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function TokenBox() {
  const { orgRole } = useAuth();

  const { state, isMobile } = useSidebar();
  const {
    CurrentToken,
    updateDoctorId,
    doctorId,
    loading,
    options,
    updateToken,
    allowNotification,
    toggleNotification,
    isPaused,
    togglePause,
  } = useToken();

  const [open, setOpen] = React.useState(false);

  return (
    <div
      className={`flex z-50 flex-col mx-2 mt-2 rounded-lg bg-background transition-all border border-border shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] ${
        state === "collapsed" && !isMobile
          ? "w-60 opacity-60 hover:opacity-100"
          : ""
      } ${
        orgRole === "org:clinic_head" ||
        orgRole === "org:doctor" ||
        orgRole === "org:assistant_doctor"
          ? ""
          : "hidden"
      }`}
    >
      <div className="flex flex-row p-1 gap-1">
        {/* token play pause button */}
        <button
          onClick={togglePause}
          className={`flex flex-1 py-2 md:py-[6px] justify-center items-center rounded-md bg-secondary`}
        >
          {isPaused ? (
            <Pause className="size-4 text-destructive animate-pulse" />
          ) : (
            <Play className="size-4" />
          )}
        </button>
        {/* sound on off button */}
        <button
          onClick={() => toggleNotification(!allowNotification)}
          className={`flex flex-1 py-2 md:py-[6px] justify-center items-center rounded-md bg-secondary`}
        >
          {allowNotification ? (
            <Volume2 className="size-4" />
          ) : (
            <VolumeOff className="size-4 text-destructive animate-pulse" />
          )}
        </button>
      </div>
      <div className="flex h-20 p-1 py-0 flex-row gap-1 items-center justify-center">
        <button
          onClick={() => updateToken(-1)}
          className={`text-black h-full px-2 items-center justify-center rounded-md bg-red-500/50 border-[#FF3B3B] hover:bg-[#FF3B3B] hover:text-white border-0 disabled:opacity-0 transition-all`}
          disabled={isPaused}
        >
          <Minus className="size-4" />
        </button>
        <BoxContainer
          CurrentToken={CurrentToken}
          loading={loading}
          isPaused={isPaused}
          allowTokenSceenExpand={state === "expanded" && !isMobile}
        />
        <button
          onClick={() => updateToken(1)}
          className={`text-black h-full px-2 items-center justify-center rounded-md bg-blue-500/50 border-[#0063F7] hover:bg-[#0063F7] hover:text-white border-0 disabled:opacity-0 transition-all`}
          disabled={isPaused}
        >
          <Plus className="size-4" />
        </button>
      </div>

      <span className="flex flex-row items-center p-1 gap-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={`w-full ${
                doctorId
                  ? "bg-green-600/20 hover:bg-green-600/20"
                  : "bg-secondary"
              } border-0 pl-2 pr-1.5 gap-1.5 py-1 h-auto`}
            >
              <ClipboardPlusIcon
                size={18}
                className={
                  doctorId ? "text-green-600" : "text-muted-foreground"
                }
              />

              <p
                className={`flex flex-1 ${
                  doctorId ? "text-green-600" : "text-muted-foreground"
                }`}
              >
                {doctorId
                  ? options.find((option) => option.value === doctorId)?.label
                  : "Select doctor..."}
              </p>
              <ChevronsUpDown
                className={`${doctorId ? "text-green-600" : "opacity-50"}`}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0"
            side="bottom"
            sideOffset={8}
            align="start"
          >
            <Command className="bg-sidebar">
              <CommandList>
                <CommandEmpty>
                  <GhostIcon className="mb-1" />
                  No doctor found.
                </CommandEmpty>
                <CommandGroup heading="Doctors">
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        updateDoctorId(
                          currentValue === doctorId ? "" : currentValue
                        );
                        setOpen(false);
                      }}
                    >
                      {option.role === "org:clinic_head" ? (
                        <UserCogIcon />
                      ) : (
                        <ClipboardPlusIcon />
                      )}
                      {option.label}
                      <Check
                        className={cn(
                          "ml-auto",
                          doctorId === option.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" className="p-1 size-auto">
              <InfoIcon className="text-muted-foreground" size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when youre done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4"></div>
              <div className="grid grid-cols-4 items-center gap-4"></div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </span>
    </div>
  );
}
