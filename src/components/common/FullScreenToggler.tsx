"use client";

import { useState, useEffect } from "react";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "../ui/button";

const FullscreenToggle = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Function to toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <Button
      onClick={toggleFullscreen}
      variant={"secondary"}
      className="p-2 aspect-square h-min w-min ml-4 rounded-full shadow-md transition"
    >
      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
    </Button>
  );
};

export default FullscreenToggle;
