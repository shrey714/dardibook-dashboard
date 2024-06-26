import React from "react";

const Skeleton = () => {
  return (
    <div className="flex flex-col w-full items-center">
      <div className="skeleton h-8 w-1/4 mb-4   bg-gray-400"></div>
      <div className="skeleton h-6 w-3/4 bg-gray-400"></div>
      <div className="skeleton my-8 h-9 w-1/3 bg-gray-400"></div>

      <div className="mb-8 space-y-4 w-1/2 self-start">
        <div className="skeleton h-6 bg-gray-400"></div>
        <div className="skeleton h-6 bg-gray-400"></div>
      </div>

      <div className="skeleton h-8 w-full bg-gray-400"></div>
    </div>
  );
};

export default Skeleton;
