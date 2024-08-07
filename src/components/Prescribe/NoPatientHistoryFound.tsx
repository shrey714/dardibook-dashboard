import React from "react";

const NoPatientHistoryFound: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100svh",
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

export default NoPatientHistoryFound;
