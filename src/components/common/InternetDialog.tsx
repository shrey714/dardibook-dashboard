"use client";
import React, { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

const ConnectionStatus: React.FC = () => {
  const offlineToastId = useRef<string | undefined>();

  useEffect(() => {
    console.log("useEffect is running");
    console.log("Initial online status:", navigator.onLine);

    const handleOnline = () => {
      if (offlineToastId.current) {
        toast.dismiss(offlineToastId.current);
      }
      toast.success("Back online!", {
        duration: 3000,
        position: "top-right",
      });
    };

    const handleOffline = () => {
      offlineToastId.current = toast.error("You're offline!", {
        duration: Infinity,
        position: "top-right",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return <></>;
};

export default ConnectionStatus;
