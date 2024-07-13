import React from "react";

const Loader = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <span className="loading loading-spinner loading-md"></span>
    </div>
  );
};

export default Loader;
