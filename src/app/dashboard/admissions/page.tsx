"use client";
import BedAdmissionModal from "@/components/Admissions/BedAdmissionModal";
import BedEditModal from "@/components/Admissions/BedEditModal";
import KanbanBoard from "@/components/Admissions/KanbanBoard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useBedsStore } from "@/lib/stores/useBedsStore";
import { useTodayPatientStore } from "@/lib/providers/todayPatientsProvider";
import { useQueryState, parseAsString, parseAsBoolean } from "nuqs";
import { Spinner } from "@/components/ui/spinner";

function Admissions() {
  const [wasEdited, setWasEdited] = useState<boolean>(false);
  const { bedPatients, loading: bpLoading } = useBedsStore((state) => state);
  const { todayPatients, loading: tpLoading } = useTodayPatientStore(
    (state) => state
  );

  const [patientIdParam, setPatientIdParam] = useQueryState(
    "patientId",
    parseAsString
  );
  const [bedIdParam, setBedIdParam] = useQueryState("bedId", parseAsString);
  const [bookingIdParam, setBookingIdParam] = useQueryState(
    "bookingId",
    parseAsString
  );
  const [admitNewPatientParam, setAdmitNewPatientParam] = useQueryState(
    "admitNew",
    parseAsBoolean.withDefault(false)
  );
  const [editAdmissionParam, setEditAdmissionParam] = useQueryState(
    "editAdmission",
    parseAsBoolean.withDefault(false)
  );

  const openAddModal = (bedId: string | null) => {
    setAdmitNewPatientParam(true);
    setBedIdParam(bedId);
  };
  const openEditModal = useCallback(
    (bookingId: string, bedId: string) => {
      setEditAdmissionParam(true);
      setBookingIdParam(bookingId);
      setBedIdParam(bedId);
    },
    [setBedIdParam, setBookingIdParam, setEditAdmissionParam]
  );

  useEffect(() => {
    if (patientIdParam && !bpLoading && !tpLoading) {
      const isPatientAdmitted = patientIdParam in bedPatients;
      const isTodaysPatient = todayPatients.find(
        (tp) => tp.patient_id === patientIdParam
      );

      if (isPatientAdmitted) {
        const bookingId = bedPatients[patientIdParam].bed_info.find(
          (bi) => bi.dischargeMarked == false
        )?.bedBookingId;
        const bedId = bedPatients[patientIdParam].bed_info.find(
          (bi) => bi.dischargeMarked == false
        )?.bedId;
        if (bookingId && bedId) openEditModal(bookingId, bedId);
      } else if (isTodaysPatient) {
        setAdmitNewPatientParam(true);
      } else {
        toast.error(`Patient with Id : ${patientIdParam} can't be admitted`, {
          duration: 3000,
          position: "bottom-right",
        });
      }
    }
  }, [
    patientIdParam,
    bpLoading,
    tpLoading,
    bedPatients,
    todayPatients,
    setAdmitNewPatientParam,
    openEditModal,
    setBedIdParam,
  ]);

  return (
    <div className="h-auto relative">
      <Dialog
        open={admitNewPatientParam}
        onOpenChange={(state) => {
          if (!state) {
            setAdmitNewPatientParam(false);
            setBedIdParam(null);
            setPatientIdParam(null);
          }
        }}
      >
        <DialogContent className="flex flex-col max-w-[95%] sm:max-w-[80%] lg:max-w-[70%] max-h-[95%] sm:max-h-[90%] overflow-hidden gap-0 p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="font-medium">Admit Patient</DialogTitle>
            <DialogDescription>
              Fill in the required details to admit a patient to a bed.
            </DialogDescription>
          </DialogHeader>
          {tpLoading || bpLoading ? (
            <div className="flex w-full items-center justify-center h-20">
              <Spinner size={"md"} className="bg-foreground" />
            </div>
          ) : (
            <BedAdmissionModal
              setIsModalOpen={setAdmitNewPatientParam}
              bedId={bedIdParam}
              setbedId={setBedIdParam}
              patientId={patientIdParam}
              setPatientId={setPatientIdParam}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={editAdmissionParam}
        onOpenChange={(state) => {
          if (!state) {
            setEditAdmissionParam(false);
            setBookingIdParam(null);
            setBedIdParam(null);
          }
        }}
      >
        <DialogContent className="flex flex-col max-w-[95%] sm:max-w-[80%] lg:max-w-[70%] max-h-[95%] sm:max-h-[90%] overflow-hidden gap-0 p-0">
          <DialogHeader>
            <DialogTitle hidden />
            <DialogDescription hidden />
          </DialogHeader>
          {tpLoading || bpLoading ? (
            <div className="flex w-full items-center justify-center h-20">
              <Spinner size={"md"} className="bg-foreground" />
            </div>
          ) : (
            <BedEditModal
              setIsEditModalOpen={setEditAdmissionParam}
              bookingId={bookingIdParam}
              bedId={bedIdParam}
              setbedId={setBedIdParam}
              setWasEdited={setWasEdited}
            />
          )}
        </DialogContent>
      </Dialog>

      <KanbanBoard
        isEditModalOpen={editAdmissionParam}
        openAddModal={openAddModal}
        openEditModal={openEditModal}
        setWasEdited={setWasEdited}
        wasEdited={wasEdited}
      />
    </div>
  );
}

export default Admissions;
