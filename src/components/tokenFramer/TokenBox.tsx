"use client";
import React from "react";
import BoxContainer from "./BoxContainer";
import useToken from "@/firebase/useToken"; // Adjust the path accordingly
import { useAppSelector } from "@/redux/store";
import {
  MinusIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/solid";

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
    <div className="flex flex-col flex-1 p-2">
      <div className="flex justify-center mb-3 gap-2">
        {/* token play pause button */}
        <button
          onClick={togglePause}
          className={`flex flex-1 px-2 py-2 md:py-1 justify-center items-center ${
            isPaused ? "bg-gray-800 animate-pulse" : "bg-transparent"
          } border-2 border-gray-800 rounded`}
        >
          {isPaused ? (
            <PauseIcon className="size-4 text-white" />
          ) : (
            <PlayIcon className="size-4 text-black" />
          )}
        </button>
        {/* sound on off button */}
        <button
          onClick={() => toggleNotification(!allowNotification)}
          className={`flex flex-1 px-2 py-2 md:py-1 justify-center items-center ${
            allowNotification ? "bg-transparent" : "bg-gray-800 animate-pulse"
          } border-2 border-gray-800 rounded`}
        >
          {allowNotification ? (
            <SpeakerWaveIcon className="size-4 text-black" />
          ) : (
            <SpeakerXMarkIcon className="size-4 text-white" />
          )}
        </button>
      </div>
      <BoxContainer
        CurrentToken={CurrentToken}
        loading={loading}
        isPaused={isPaused}
      />
      <div className="flex justify-center mt-3 gap-2">
        {/* token decrease button */}
        <button
          onClick={() => updateToken(-1)}
          className={`text-black  flex flex-1 px-2 py-2 md:py-1 items-center justify-center   ${
            isPaused
              ? "bg-gray-300 border-2 border-gray-300"
              : "bg-red-500/50 border-2 border-[#FF3B3B] hover:bg-[#FF3B3B] hover:text-white"
          } rounded`}
          disabled={isPaused}
        >
          <MinusIcon className="size-4" />
        </button>
        {/* token increase button */}
        <button
          onClick={() => updateToken(1)}
          className={`text-black flex flex-1 px-2 py-2 md:py-1 justify-center items-center ${
            isPaused
              ? "bg-gray-300 border-2 border-gray-300"
              : "bg-blue-500/50 border-2 border-[#0063F7] hover:bg-[#0063F7]  hover:text-white"
          } rounded`}
          disabled={isPaused}
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
