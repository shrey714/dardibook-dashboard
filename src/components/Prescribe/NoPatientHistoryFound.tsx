import React from "react";

const NoPatientHistoryFound: React.FC<{ message: string | null }> = ({
  message,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {message}
    </div>
  );
};

export default NoPatientHistoryFound;
