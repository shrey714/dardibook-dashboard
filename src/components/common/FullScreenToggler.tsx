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
      variant={"outline"}
      className="p-2 aspect-square text-muted-foreground h-min w-min ml-2 rounded-full shadow-none transition"
    >
      {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
    </Button>
  );
};

export default FullscreenToggle;
