"use client";

import { logActivity } from "@/utility/activityLogging/logActivity";
import React from "react";

const Temp2 = () => {
  const handleClick = () => {
    logActivity({
      action: "TEST_LOG",
      metadata: { clicked: true },
      location: "/temp2",
    });
  };

  return (
    <>
      <button
        onClick={() => {
          handleClick();
        }}
      >
        click here to log
      </button>
    </>
  );
};

export default Temp2;
