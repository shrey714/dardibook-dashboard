import React from "react";

const FullAreaLoader = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100000,
      }}
    >
      <span className="loading loading-spinner loading-md"></span>
    </div>
  );
};

export default FullAreaLoader;
