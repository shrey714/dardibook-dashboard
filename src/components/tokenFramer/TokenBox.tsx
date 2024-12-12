"use client";
import React from "react";
import BoxContainer from "./BoxContainer";
import useToken from "@/firebase/useToken"; // Adjust the path accordingly
import { useAppSelector } from "@/redux/store";
import { Minus,Pause,Play,Plus,Volume2,VolumeOff  } from "lucide-react";

export default function TokenBox() {
  const user = useAppSelector<any>((state) => state.auth.user);
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
    <div className="flex flex-col flex-1 py-2 px-3">
      <div className="flex justify-center">
        {/* token play pause button */}
        <button
          onClick={togglePause}
          className={`flex flex-1 px-2 py-2 md:py-[6px] justify-center items-center rounded-none rounded-tl-lg ${
            isPaused ? "bg-gray-600" : "bg-transparent"
          } border-[3px] border-r-[1.5px] border-black`}
        >
          {isPaused ? (
            <Pause className="size-4 text-white animate-pulse" />
          ) : (
            <Play className="size-4 text-black" />
          )}
        </button>
        {/* sound on off button */}
        <button
          onClick={() => toggleNotification(!allowNotification)}
          className={`flex flex-1 px-2 py-2 md:py-[6px] justify-center items-center rounded-none rounded-tr-lg ${
            allowNotification ? "bg-transparent" : "bg-gray-600"
          } border-[3px] border-l-[1.5px] border-black`}
        >
          {allowNotification ? (
            <Volume2 className="size-4 text-black" />
          ) : (
            <VolumeOff className="size-4 text-white animate-pulse" />
          )}
        </button>
      </div>
      <BoxContainer
        CurrentToken={CurrentToken}
        loading={loading}
        isPaused={isPaused}
      />
      <div className="flex justify-center">
        {/* token decrease button */}
        <button
          onClick={() => updateToken(-1)}
          className={`text-black  flex flex-1 px-2 py-2 md:py-[6px] items-center justify-center rounded-none rounded-bl-lg ${
            isPaused
              ? "bg-gray-300 border-gray-300"
              : "bg-red-500/50 border-[#FF3B3B] hover:bg-[#FF3B3B] hover:text-white"
          } border-[3px] border-r-[1.5px] border-black`}
          disabled={isPaused}
        >
          <Minus className="size-4" />
        </button>
        {/* token increase button */}
        <button
          onClick={() => updateToken(1)}
          className={`text-black flex flex-1 px-2 py-2 md:py-[6px] justify-center items-center rounded-none rounded-br-lg ${
            isPaused
              ? "bg-gray-300 border-gray-300"
              : "bg-blue-500/50 border-[#0063F7] hover:bg-[#0063F7]  hover:text-white"
          } border-[3px] border-l-[1.5px] border-black`}
          disabled={isPaused}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}
