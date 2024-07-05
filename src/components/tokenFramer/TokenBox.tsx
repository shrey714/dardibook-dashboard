"use client";
import React, { useState } from "react";
import BoxContainer from "./BoxContainer";

export default function TokenBox() {
  const [CurrentToken, setCurrentToken] = useState(45);
  return (
    <div className="flex flex-col flex-1 p-2">
      <BoxContainer CurrentToken={CurrentToken} />
      {/* <button
        className="btn"
        onClick={() => {
          setCurrentToken(CurrentToken + 1);
        }}
      >
        +
      </button> */}
    </div>
  );
}
