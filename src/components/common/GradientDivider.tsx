import React from "react";

const GradientDivider = () => {
  return (
    <div className="flex py-2 flex-row items-center justify-center bg-gray-300 z-[0] sticky top-10">
      <div className="flex flex-1 h-px mx-3 bg-gradient-to-r from-transparent to-gray-800 opacity-50" />
      <p className="text-gray-800 text-sm">DIVIDEr</p>
      <div className="flex flex-1 h-px mx-3 bg-gradient-to-r  from-gray-800 to-transparent  opacity-50" />
    </div>
  );
};

export default GradientDivider;
