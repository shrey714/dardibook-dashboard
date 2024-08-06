import React, { useState, useEffect } from "react";
import CustomModal from "@/components/BlockedModal";
import * as animationData from "@/lottieFiles/NoInternet.json";
import Lottie from "react-lottie";
const ConnectionStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(true);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  useEffect(() => {
    console.log("useEffect is running");
    console.log("Initial online status:", navigator.onLine);

    const handleOnline = () => {
      console.log("Back online");
      setIsOnline(true);
    };
    const handleOffline = () => {
      console.log("Went offline");
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <>
      <CustomModal isOpen={!isOnline} mainScreenModal={false}>
        <div className=" text-center">
          <Lottie options={defaultOptions} height={100} width={100} />
          <p className="text-lg font-semibold text-gray-800">Connection Lost</p>
          <p className="text-gray-700 text-sm leading-4 mt-1" >
            It seems you are offline. Please check your internet connection.
          </p>
        </div>
      </CustomModal>
    </>
  );
};

export default ConnectionStatus;
