"use client";
import React, { useEffect } from "react";
import { useTodayPatientStore } from "@/lib/providers/todayPatientsProvider";
import { useAuth } from "@clerk/nextjs";
import { useBedsStore } from "@/lib/stores/useBedsStore";

const InitializeZustandStore = () => {
  const { getTodayPatients } = useTodayPatientStore((state) => state);
  const { fetchBeds } = useBedsStore((state) => state);
  const { isLoaded, orgId } = useAuth();

  useEffect(() => {
    if (orgId && isLoaded) {
      getTodayPatients(orgId);
      fetchBeds(orgId);
    }
  }, [fetchBeds, getTodayPatients, isLoaded, orgId]);

  return <></>;
};

export default InitializeZustandStore;
