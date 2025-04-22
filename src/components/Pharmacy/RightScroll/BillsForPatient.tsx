"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ReceiptTextIcon, InboxIcon } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { format } from "date-fns";
import { query, collection, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

import { Skeleton } from "@/components/ui/skeleton";
import { PharmacySelectedPatientType, PharmacyTypes } from "@/types/FormTypes";
import { Button } from "@/components/ui/button";

const BillsForPatient = ({
  onViewBill,
  selectedPatient,
}: {
  selectedPatient: PharmacySelectedPatientType | undefined;
  onViewBill: (bill: PharmacyTypes) => void;
}) => {
  const [billsLoading, setBillsLoading] = useState(false);
  const [billsData, setBillsData] = useState<PharmacyTypes[]>([]);
  const { isLoaded, orgId } = useAuth();

  useEffect(() => {
    const getBillsForPatient = async () => {
      if (isLoaded && orgId && selectedPatient?.patient_id) {
        try {
          const billsQuery = query(
            collection(db, "doctor", orgId, "bills"),
            where("patient_id", "==", selectedPatient.patient_id)
          );

          setBillsLoading(true);

          const snapshot = await getDocs(billsQuery);

          const billsData: PharmacyTypes[] = [];
          snapshot.forEach((doc) => {
            const bill = doc.data() as PharmacyTypes;
            billsData.push(bill);
          });

          setBillsData(billsData);
        } catch (error) {
          console.error("Error fetching bills for patient:", error);
          setBillsData([]);
        } finally {
          setBillsLoading(false);
        }
      } else {
        setBillsData([]);
        setBillsLoading(false);
      }
    };

    getBillsForPatient();
  }, [isLoaded, orgId, selectedPatient]);

  return (
    <div className="pr-1 pl-1">
      <AnimatePresence mode="wait">
        {billsLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-3"
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-[76px] text-sm bg-border shadow rounded-md w-full transition-all animate-pulse"
                style={{
                  animationDelay: `${i * 100}ms`,
                }}
              />
            ))}
          </motion.div>
        ) : billsData.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="text-sm bg-border text-foreground shadow rounded-md w-full flex items-center justify-center py-2 flex-col gap-y-2 transition-all"
          >
            <InboxIcon className="text-muted-foreground size-8" />
            <p className="text-sm text-muted-foreground leading-tight line-clamp-1">
              Empty
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="data"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="space-y-3"
          >
            {billsData.map((bill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-md w-full transition-all"
              >
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    onViewBill(bill);
                  }}
                  className="text-sm w-full h-auto bg-border text-foreground shadow flex items-center justify-center py-2 px-0 flex-col gap-y-2 "
                >
                  <ReceiptTextIcon className="text-muted-foreground !size-8" />
                  <p className="text-xs text-muted-foreground leading-tight line-clamp-1">
                    {format(bill.generated_at, "do MMM")}
                  </p>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BillsForPatient;
