"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InboxIcon, ClipboardPlusIcon, X } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { format } from "date-fns";
import { query, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

import { Skeleton } from "@/components/ui/skeleton";
import {
  PharmacySelectedPatientType,
  PrescriptionFormTypes,
} from "@/types/FormTypes";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface PrescriptionsForPatientTypes {
  selectedPatient: PharmacySelectedPatientType | undefined;
  setselectedPrescription: React.Dispatch<
    React.SetStateAction<PrescriptionFormTypes | undefined>
  >;
  selectedPrescription: PrescriptionFormTypes | undefined;
}

const PrescriptionsForPatient = ({
  selectedPatient,
  setselectedPrescription,
  selectedPrescription,
}: PrescriptionsForPatientTypes) => {
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(false);
  const [prescriptions, setPrescriptions] = useState<PrescriptionFormTypes[]>(
    []
  );
  const { isLoaded, orgId } = useAuth();

  useEffect(() => {
    const getBillsForPatient = async () => {
      if (isLoaded && orgId && selectedPatient?.patient_id) {
        try {
          const billsQuery = query(
            collection(
              db,
              "doctor",
              orgId,
              "patients",
              selectedPatient.patient_id,
              "prescriptions"
            )
          );

          setPrescriptionsLoading(true);

          const snapshot = await getDocs(billsQuery);

          const billsData: PrescriptionFormTypes[] = [];
          snapshot.forEach((doc) => {
            const bill = doc.data() as PrescriptionFormTypes;
            billsData.push(bill);
          });
          setPrescriptions(
            billsData.sort((a, b) => b.created_at - a.created_at)
          );
        } catch (error) {
          console.error("Error fetching prescriptions for patient:", error);
          setPrescriptions([]);
        } finally {
          setPrescriptionsLoading(false);
        }
      } else {
        setPrescriptions([]);
        setPrescriptionsLoading(false);
      }
    };

    getBillsForPatient();
  }, [isLoaded, orgId, selectedPatient]);

  useEffect(() => {
    setselectedPrescription(undefined);
  }, [selectedPatient?.patient_id, setselectedPrescription]);

  return (
    <ScrollArea className="w-full pb-[6.5px]">
      <div className="w-full p-1 rounded-md">
        <AnimatePresence mode="wait">
          {prescriptionsLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-x-3 flex flex-row"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-9 w-24 text-sm bg-border shadow rounded-md transition-all animate-pulse"
                  style={{
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </motion.div>
          ) : prescriptions.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="text-sm text-foreground bg-border rounded-md shadow w-24 h-9 flex items-center justify-center transition-all"
            >
              <InboxIcon className="text-muted-foreground size-6" />
            </motion.div>
          ) : (
            <motion.div
              key="data"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="space-x-3 flex flex-row"
            >
              {selectedPrescription && (
                <motion.div
                  key={"clear"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                  className="rounded-md w-fit transition-all"
                >
                  <Button
                    variant={"outline"}
                    onClick={() => {
                      setselectedPrescription(undefined);
                    }}
                    className={`relative text-sm w-fit h-9 shadow flex flex-row items-center justify-center px-4 py-2 gap-x-2`}
                  >
                    <X className="!size-6" />
                  </Button>
                </motion.div>
              )}

              {prescriptions.map((prescription, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.15 }}
                  className="rounded-md w-full transition-all"
                >
                  <Button
                    variant={"secondary"}
                    onClick={() => {
                      setselectedPrescription(prescription);
                    }}
                    className={`${
                      selectedPrescription?.prescription_id ===
                      prescription.prescription_id
                        ? "bg-primary text-primary-foreground hover:bg-primary"
                        : "bg-border text-muted-foreground"
                    } relative text-sm w-fit h-9 shadow flex flex-row items-center justify-center px-4 py-2 gap-x-2`}
                  >
                    <ClipboardPlusIcon className="!size-6" />
                    <p className="text-xs leading-tight line-clamp-1">
                      {format(prescription.created_at, "do MMM")}
                    </p>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default PrescriptionsForPatient;
