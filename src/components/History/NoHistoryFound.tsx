import React from "react";

const NoHistoryFound: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100000,
      }}
    >
      {message}
    </div>
  );
};

export default NoHistoryFound;
