"use client";
import React, { useState } from "react";

const MarqueBg = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div className="fixed top-0 left-0 w-full h-svh">
      <iframe
        src="https://db-marquee-frame.vercel.app"
        width="100%"
        height="100%"
        title="visual"
        style={{ opacity: iframeLoaded ? 1 : 0 }}
        onLoad={() => setIframeLoaded(true)}
        className="transition-opacity duration-500"
      ></iframe>
    </div>
  );
};

export default MarqueBg;
