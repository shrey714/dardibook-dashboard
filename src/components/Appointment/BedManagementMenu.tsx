"use client";

import {
  BedSingle,
  BriefcaseMedicalIcon,
  CircleX,
  LogOut,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { db } from "@/firebase/firebaseConfig";
import { Button } from "@/components/ui/button";
import { doc, writeBatch } from "firebase/firestore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import Loader from "../common/Loader";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { BedPatientTypes, OrgBed, orgUserType } from "@/types/FormTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface BedManagementMenuProps {
  bed: OrgBed;
  patient: BedPatientTypes;
  disabled?: boolean;
}

export const BedManagementMenu: React.FC<BedManagementMenuProps> = ({
  bed,
  patient,
  disabled,
}) => {
  const { orgId } = useAuth();
  const [menuLoader, setMenuLoader] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const { memberships } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
      role: ["org:doctor", "org:clinic_head"],
    },
  });

  const handleDoctorChange = async (doctor: orgUserType) => {
    if (!orgId) return;

    setMenuLoader(true);

    try {
      const batch = writeBatch(db);

      const bedRef = doc(db, "doctor", orgId, "beds", bed.bedBookingId);
      batch.update(bedRef, { admission_for: doctor });

      const patientRef = doc(
        db,
        "doctor",
        orgId,
        "patients",
        patient.patient_id
      );
      const updatedBedInfo = patient.bed_info.map((patient_bed) =>
        patient_bed.bedBookingId === bed.bedBookingId
          ? { ...patient_bed, admission_for: doctor }
          : patient_bed
      );

      batch.update(patientRef, { bed_info: updatedBedInfo });

      await batch.commit();
    } catch (error) {
      void error;
      toast.error("Error updating");
    } finally {
      setMenuLoader(false);
    }
  };

  const handleDischarge = async () => {
    if (!orgId) return;

    setMenuLoader(true);

    try {
      const batch = writeBatch(db);

      const bedRef = doc(db, "doctor", orgId, "beds", bed.bedBookingId);
      batch.update(bedRef, { dischargeMarked: true });

      const patientRef = doc(
        db,
        "doctor",
        orgId,
        "patients",
        patient.patient_id
      );
      const updatedBedInfo = patient.bed_info.map((patient_bed) =>
        patient_bed.bedBookingId === bed.bedBookingId
          ? { ...patient_bed, dischargeMarked: true }
          : patient_bed
      );

      batch.update(patientRef, { bed_info: updatedBedInfo });

      await batch.commit();
    } catch (error) {
      void error;
      toast.error("Error discharging");
    } finally {
      setMenuLoader(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          disabled={disabled}
          className="flex h-9 w-h-9 aspect-square p-0 data-[state=open]:bg-muted border rounded-md"
        >
          {menuLoader ? <Loader size="small" /> : <MoreHorizontal />}
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={10}
        side="bottom"
        align="end"
        className="min-w-[380px]"
      >
        <DropdownMenuLabel className="border-b border-green-600 text-green-600 flex flex-row gap-x-2">
          <BedSingle className="w-5 h-5" /> {patient.name}
        </DropdownMenuLabel>
        <div className="w-full pt-2 pb-1 flex flex-row gap-x-1">
          <span className="bg-green-500/10 flex h-auto px-2 rounded-md aspect-square items-center justify-center">
            <BriefcaseMedicalIcon size={20} className="text-green-500" />
          </span>
          <Select
            disabled={menuLoader}
            // (patient.registerd_by.id !== user?.id &&
            //   patient.registerd_for.id !== user?.id) ||
            required
            defaultValue={bed.admission_for.id}
            name="admission_for"
            onValueChange={(val) => {
              const member = memberships?.data?.find(
                (mem) => mem.publicUserData.userId === val
              );

              if (member && member.publicUserData.userId) {
                const {
                  userId,
                  firstName = "",
                  lastName = "",
                  identifier,
                } = member.publicUserData;

                const selectedMember = {
                  id: userId,
                  name: `${firstName} ${lastName}`.trim(),
                  email: identifier,
                };
                handleDoctorChange(selectedMember);
              }
            }}
          >
            <SelectTrigger
              id="admission_for"
              className="w-full md:max-w-md lg:col-span-2 disabled:text-primary shadow-sm rounded-md border-border bg-transparent form-input py-1 pl-2 sm:text-sm sm:leading-6"
            >
              <SelectValue placeholder="Doctor" />
            </SelectTrigger>
            <SelectContent>
              {memberships &&
                memberships.data?.map((member, index) =>
                  member.publicUserData.userId ? (
                    <SelectItem
                      value={member.publicUserData.userId}
                      key={index}
                    >
                      {member.publicUserData.firstName}{" "}
                      {member.publicUserData.lastName}
                    </SelectItem>
                  ) : (
                    <></>
                  )
                )}
            </SelectContent>
          </Select>
        </div>
        <Alert
          variant="default"
          className="px-1 py-0.5 border-0 text-muted-foreground"
        >
          <AlertTitle hidden></AlertTitle>
          <AlertDescription className="text-xs text-end">
            Please checkout Bed Management page for more access.
          </AlertDescription>
        </Alert>
        <DropdownMenuSeparator />

        <div className="flex items-centerw-full relative">
          <motion.button
            disabled={confirming || menuLoader}
            className={`${
              confirming ? "" : "hover:!bg-red-500/20"
            } font-medium flex items-center justify-center gap-2 py-2 bg-red-500/10 text-red-600 rounded-lg overflow-hidden transition-colors`}
            onClick={() => setConfirming(!confirming)}
            initial={{ width: "100%" }}
            animate={{ width: confirming ? "66%" : "100%" }}
            transition={{ duration: 0.3 }}
          >
            {confirming ? (
              "Are you Sure?"
            ) : (
              <>
                <LogOut size={18} /> Discharge
              </>
            )}
          </motion.button>
          <motion.div
            initial={{
              opacity: 0,
              display: "none",
              translateX: "100%",
            }}
            animate={{
              opacity: confirming ? 1 : 0,
              display: confirming ? "flex" : "none",
              translateX: confirming ? 0 : "100%",
            }}
            exit={{ opacity: 0, display: "none", translateX: "100%" }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 w-[34%] flex h-full items-center justify-center flex-row gap-x-1 px-1"
          >
            <DropdownMenuItem
              className="flex-1 cursor-pointer bg-destructive focus:bg-destructive/90"
              asChild
            >
              <Button
                variant={"destructive"}
                className="rounded-lg flex flex-1 items-center justify-center h-full"
                onClick={() => handleDischarge()}
                disabled={menuLoader}
              >
                <Trash2 size={18} />
              </Button>
            </DropdownMenuItem>
            <Button
              variant={"secondary"}
              className="rounded-lg flex flex-1 items-center justify-center h-full px-2"
              onClick={() => setConfirming(false)}
              disabled={menuLoader}
            >
              <CircleX size={18} />
            </Button>
          </motion.div>
        </div>

        <Alert
          variant="default"
          className="px-1 pt-1 pb-0 border-0 text-muted-foreground"
        >
          <AlertTitle hidden></AlertTitle>
          <AlertDescription className="text-xs text-end">
            This action is not reversible.
          </AlertDescription>
        </Alert>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
