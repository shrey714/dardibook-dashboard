"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";

import {
  type TodayPatientsStore,
  createTodayPatientsStore,
  initStore,
} from "@/lib/stores/todayPatientsStore";

export const StoreContext = createContext<StoreApi<TodayPatientsStore> | null>(
  null
);

export interface StoreProviderProps {
  children: ReactNode;
}

export const TodayPatientsProvider = ({ children }: StoreProviderProps) => {
  // 🔹 Use `null` as the initial value instead of `undefined`
  const storeRef = useRef<StoreApi<TodayPatientsStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createTodayPatientsStore(initStore());
  }

  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};

export const useTodayPatientStore = <T,>(selector: (store: TodayPatientsStore) => T): T => {
  const commonStoreContext = useContext(StoreContext);

  if (!commonStoreContext) {
    throw new Error(`useTodayPatientStore must be used within TodayPatientsProvider`);
  }

  return useStore(commonStoreContext, selector);
};
