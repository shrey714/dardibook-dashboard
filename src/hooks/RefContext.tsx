"use client"
import React, { createContext, useContext, useRef, ReactNode } from "react";

// Create a context for the ref
const RefContext = createContext<React.RefObject<any> | null>(null);

// Create a custom hook to easily access the ref
export const useRefContext = () => {
  const context = useContext(RefContext);
  if (!context) {
    throw new Error("useRefContext must be used within a RefProvider");
  }
  return context;
};

// Create a provider component to share the ref
export const RefProvider = ({ children }: { children: ReactNode }) => {
  const appRef = useRef<HTMLElement>(null);

  return (
    <RefContext.Provider value={appRef}>
      {children}
    </RefContext.Provider>
  );
};
