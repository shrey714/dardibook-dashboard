import React, { useEffect } from "react";

import { toast } from "react-hot-toast";

const ConnectionStatus: React.FC = () => {


  let offlineToastId: string | undefined;

  useEffect(() => {
    console.log("useEffect is running");
    console.log("Initial online status:", navigator.onLine);

    const handleOnline = () => {
      toast.dismiss(offlineToastId);
      toast.success("Back online!", {
        duration: 3000,
        position: "top-right",
      });
    };

    const handleOffline = () => {
      offlineToastId = toast.error("You're offline!", {
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

  return (
    <>
     
    </>
  );
};

export default ConnectionStatus;
