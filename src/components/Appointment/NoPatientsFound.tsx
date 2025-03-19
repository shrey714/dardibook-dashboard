import React from "react";

const NoPatientsFound: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="px-2 text-muted-foreground font-medium text-base justify-self-center max-w-4xl h-full flex flex-1 items-center justify-center z-10 overflow-hidden text-center">
      {message}
    </div>
  );
};

export default NoPatientsFound;
