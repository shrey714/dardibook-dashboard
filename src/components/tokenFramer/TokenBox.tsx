"use client";
import React, { useState } from "react";
import BoxContainer from "./BoxContainer";
import { useTokenWithOrganization } from "@/firebase/TokenStore";
import {
  ChevronLeft,
  ClipboardPlusIcon,
  GhostIcon,
  InfoIcon,
  Maximize,
  Minus,
  Pause,
  Play,
  Plus,
  Sparkles,
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
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";

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
  } = useTokenWithOrganization();

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
                  ? "bg-green-600/20 hover:bg-green-600/40"
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
                <CommandEmpty>
                  <GhostIcon className="mb-1" />
                  No doctor found.
                </CommandEmpty>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <TokenManagerInfoModalStructured />
      </span>
    </div>
  );
}

interface FeatureDetail {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const featureDetails: FeatureDetail[] = [
  {
    id: "nextToken",
    title: "Sync Play/Pause",
    description:
      "Controls the synchronized play and pause of the token box across all users linked to the same doctor, ensuring real-time updates.",
    icon: <Play className="h-6 w-6" />,
    color: "bg-indigo-600",
  },
  {
    id: "soundToggle",
    title: "Notification Sound Toggle",
    description:
      "Enables or disables sound notifications for token changes. When enabled, a sound alert is played every time the token updates.",
    icon: <Volume2 className="h-6 w-6" />,
    color: "bg-pink-600",
  },
  {
    id: "decreaseToken",
    title: "Decrease Token",
    description:
      "Decreases the current token number. The minimum possible value is 0, ensuring the count never goes negative.",
    icon: <Minus className="h-6 w-6" />,
    color: "bg-red-600",
  },
  {
    id: "tokenNumber",
    title: "Current Token Display",
    description:
      "Shows the currently active token number, allowing patients to easily identify when they are being called.",
    icon: <span className="text-2xl font-bold">3</span>,
    color: "bg-amber-600",
  },
  {
    id: "fullscreen",
    title: "Fullscreen View",
    description:
      "Expands the token display to fullscreen mode, enhancing visibility for larger screens and shared viewing areas.",
    icon: <Maximize className="h-6 w-6" />,
    color: "bg-emerald-600",
  },
  {
    id: "increaseToken",
    title: "Increase Token",
    description:
      "Increases the current token number, allowing you to move forward in the queue manually.",
    icon: <Plus className="h-6 w-6" />,
    color: "bg-blue-600",
  },
  {
    id: "assignPatient",
    title: "Doctor Assignment",
    description:
      "Displays or updates the doctor associated with the current token. All token-related operations are synchronized with the selected doctor.",
    icon: <ClipboardPlusIcon className="h-6 w-6" />,
    color: "bg-green-600",
  },
];

function TokenManagerInfoModalStructured() {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);

  const handleFeatureClick = (featureId: string) => {
    setActiveFeature(featureId);
  };

  const getFeatureById = (id: string | null) => {
    if (!id) return null;
    return featureDetails.find((f) => f.id === id) || null;
  };

  const currentFeature = getFeatureById(activeFeature);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="p-1 size-auto"
          aria-label="Show token manager information"
        >
          <InfoIcon className="text-muted-foreground" size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl p-3 sm:p-6">
        <DialogHeader className="relative">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Token Manager Guide
          </DialogTitle>
          <DialogDescription className="text-sm">
            Explore the features of your clinics token management system
          </DialogDescription>
        </DialogHeader>

        <div
          className={`px-2 py-1 sm:px-3 sm:py-2 border rounded-lg transition-all duration-300 flex flex-row gap-3 items-center`}
        >
          <Sparkles className="h-5 w-5 text-primary/60" />
          <p className="text-xs text-muted-foreground">
            Select a category below to explore the different features of your
            token management system.
          </p>
        </div>

        <div
          className={`relative max-w-lg w-full justify-self-center overflow-hidden rounded-lg bg-background border border-border shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transition-all duration-500`}
        >
          <div className="grid grid-cols-6 grid-rows-4 gap-2 sm:gap-3 p-2 sm:p-3 h-full w-full">
            <div className="col-span-3">
              <div
                className={`h-14 text-white bg-indigo-600/80 hover:bg-indigo-600/90 rounded-lg flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:ring-2 ring-indigo-500/40`}
                onClick={() => handleFeatureClick("nextToken")}
              >
                <Play size={24} className="mr-2" /> {"/"}
                <Pause size={24} className="ml-2" />
              </div>
            </div>
            <div className="col-span-3 col-start-4">
              <div
                className={`h-14 text-white bg-pink-600/80 hover:bg-pink-600/90 rounded-lg flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:ring-2 ring-pink-500/40`}
                onClick={() => handleFeatureClick("soundToggle")}
              >
                <Volume2 size={24} className="mr-2" /> {"/"}
                <VolumeOff size={24} className="ml-2" />
              </div>
            </div>
            <div className="row-start-2 row-span-2">
              <div
                className={`h-full bg-red-600/80 hover:bg-red-600/90 rounded-lg flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:ring-2 ring-red-500/40`}
                onClick={() => handleFeatureClick("decreaseToken")}
              >
                <Minus size={28} className="text-white" />
              </div>
            </div>
            <div className="col-span-4 row-span-2 row-start-2">
              <div
                onClick={() => handleFeatureClick("tokenNumber")}
                className={`size-full bg-black/80 hover:bg-black/90 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer relative rounded-lg transition-all duration-300 ease-out`}
              >
                <span className="text-5xl font-bold text-white/90">3</span>
                <div
                  className={`absolute top-2 right-2 p-1 text-gray-400 cursor-pointer hover:text-emerald-400 transition-colors z-10`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFeatureClick("fullscreen");
                  }}
                >
                  <Maximize size={20} />
                </div>
              </div>
            </div>
            <div className="col-start-6 row-span-2 row-start-2">
              <div
                className={`h-full bg-blue-600/80 hover:bg-blue-600/90 rounded-lg flex items-center justify-center cursor-pointer shadow-md transition-all duration-300 hover:ring-2 ring-blue-500/40`}
                onClick={() => handleFeatureClick("increaseToken")}
              >
                <Plus size={28} className="text-white" />
              </div>
            </div>
            <div className="col-span-6 row-start-4">
              <div
                className={`h-14 bg-green-600/80 hover:bg-green-600/90 rounded-lg flex items-center justify-center px-3 cursor-pointer shadow-md transition-all duration-300 hover:ring-2 ring-green-500/40`}
                onClick={() => handleFeatureClick("assignPatient")}
              >
                <ClipboardPlusIcon size={20} className="text-white mr-2" />
                <span className="text-white text-sm font-medium">
                  Shrey Patel
                </span>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {currentFeature && (
              <motion.div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 z-30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`size-14 rounded-full ${currentFeature.color} flex items-center text-white justify-center mb-4`}
                  transition={{ delay: 0.1, stiffness: 400, damping: 10 }}
                >
                  {currentFeature.icon}
                </motion.div>
                <motion.h3
                  className="text-xl font-bold mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {currentFeature.title}
                </motion.h3>
                <motion.p
                  className="text-sm text-muted-foreground text-center max-w-xs"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentFeature.description}
                </motion.p>
                <motion.button
                  onClick={() => {
                    setActiveFeature(null);
                  }}
                  className="mt-6 px-4 py-2 bg-foreground/10 hover:bg-foreground/20 rounded-md text-sm flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Overview
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="items-center sm:justify-center">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-min rounded-full"
            >
              Got it!
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
