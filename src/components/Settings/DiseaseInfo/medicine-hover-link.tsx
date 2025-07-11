"use client";
import React, { useEffect, useState } from "react";
import { Ban, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface Medicine {
  id: string;
  instruction: string;
  medicineName: string;
  searchableString: string;
  type: string;
  active: boolean;
}

const MedicineHoverLink = ({
  label,
  className,
}: {
  label: string;
  className?: string;
}) => {
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { orgId } = useAuth();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (isOpen && orgId && label) {
      const fetchMedicine = async () => {
        try {
          const docRef = doc(db, "doctor", orgId, "medicinesData", label);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setMedicine(docSnap.data() as Medicine);
          } else {
            setNotFound(true);
          }
        } catch (error) {
          console.log(error);
          setNotFound(true);
          setMedicine(null);
        }
      };

      fetchMedicine();
    }
  }, [isOpen, label, orgId]);

  return (
    <HoverCard openDelay={300} closeDelay={50} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>
        <Button
          variant="link"
          className={cn(
            "text-secondary h-auto px-2 py-0.5 rounded-sm",
            className
          )}
        >
          {label}
        </Button>
      </HoverCardTrigger>

      <HoverCardContent
        className={`p-2 transition-all w-auto max-w-80 duration-300 ${
          notFound ? "min-w-0" : "min-w-48"
        }`}
        sideOffset={6}
        side="top"
      >
        <div className="flex flex-row justify-start gap-3">
          <Pill size={35} className="text-muted-foreground p-1" />
          {medicine ? (
            <div className="flex flex-1 flex-col">
              <h4 className="text-sm underline font-semibold text-muted-foreground gap-x-2 inline-flex items-center">
                {medicine.id}
                <span
                  className={`w-2 h-2 aspect-square rounded-full ${
                    medicine.active ? "bg-green-500" : "bg-red-500"
                  }`}
                ></span>
              </h4>
              <p className="text-base text-wrap">{medicine.medicineName}</p>
              <p className="text-sm font-medium text-muted-foreground">
                Type : {medicine.type}
              </p>
              <p className="text-sm text-muted-foreground font-light tracking-tight italic leading-tight text-wrap">
                {medicine.instruction}
              </p>
            </div>
          ) : notFound ? (
            <div className="flex flex-1 items-center justify-center">
              <Ban />
            </div>
          ) : (
            <div className="w-full flex flex-1 flex-col gap-1">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default MedicineHoverLink;
