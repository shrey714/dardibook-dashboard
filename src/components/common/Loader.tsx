// components/Loader.tsx

import React from "react";
import { Loader as LoaderAnimation } from "lucide-react";
import { cn } from "@/lib/utils";
import { type ClassValue } from "clsx"
interface LoaderProps {
  size?: "small" | "medium" | "large" | "extra-large";
  color?: ClassValue; // Tailwind color class
}

const sizeClasses = {
  small: "w-4 h-4",
  medium: "w-6 h-6",
  large: "w-8 h-8",
  "extra-large": "w-10 h-10",
};

const Loader: React.FC<LoaderProps> = ({
  size = "medium",
  color = "text-blue-700",
}) => {
  const sizeClass = sizeClasses[size];

  return (
    <LoaderAnimation className={cn("animate-spin", sizeClass,color)} />
  );
};

export default Loader;

{
  // <svg
  //   xmlns="http://www.w3.org/2000/svg"
  //   width="24"
  //   height="24"
  //   viewBox="0 0 24 24"
  //   fill="none"
  //   stroke={color}
  //   strokeWidth="2"
  //   strokeLinecap="round"
  //   strokeLinejoin="round"
  //   className={`lucide lucide-loader animate-spin ${sizeClass}`}
  // >
  //   <path d="M12 2v4" />
  //   <path d="m16.2 7.8 2.9-2.9" />
  //   <path d="M18 12h4" />
  //   <path d="m16.2 16.2 2.9 2.9" />
  //   <path d="M12 18v4" />
  //   <path d="m4.9 19.1 2.9-2.9" />
  //   <path d="M2 12h4" />
  //   <path d="m4.9 4.9 2.9 2.9" />
  // </svg>
  /* <Loader size="small" color="text-blue-600" secondaryColor="text-gray-500" />
<Loader size="medium" color="text-green-600" secondaryColor="text-gray-200" />
<Loader size="large" color="text-red-600" secondaryColor="text-gray-200" />
<Loader size="extra-large" color="text-yellow-600" secondaryColor="text-gray-200" /> */
}
