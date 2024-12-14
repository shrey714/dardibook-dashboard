"use client";
import React from "react";
import BoxContainer from "./BoxContainer";
import useToken from "@/firebase/useToken"; // Adjust the path accordingly
import { useAppSelector } from "@/redux/store";
import { Minus, Pause, Play, Plus, Volume2, VolumeOff } from "lucide-react";
import { useSidebar } from "../ui/sidebar";

export default function TokenBox() {
  const user = useAppSelector<any>((state) => state.auth.user);
  const { state, isMobile } = useSidebar();
  const {
    CurrentToken,
    loading,
    updateToken,
    allowNotification,
    toggleNotification,
    isPaused,
    togglePause,
  } = useToken(user?.uid);

  return (
    <div
      className={`flex flex-col m-2 rounded-lg bg-background transition-all border border-border shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] ${
        state === "collapsed" && !isMobile
          ? "w-60 opacity-60 hover:opacity-100"
          : ""
      } ${
        user?.role === "subDoctor" || user?.role === "admin" ? "" : "hidden"
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
      <div className="flex h-24 p-1 pt-0 flex-row gap-1 items-center justify-center">
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
        />
        <button
          onClick={() => updateToken(1)}
          className={`text-black h-full px-2 items-center justify-center rounded-md bg-blue-500/50 border-[#0063F7] hover:bg-[#0063F7] hover:text-white border-0 disabled:opacity-0 transition-all`}
          disabled={isPaused}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
