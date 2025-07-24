"use client";
import BedAdmissionModal from "@/components/Admissions/BedAdmissionModal";
import BedEditModal from "@/components/Admissions/BedEditModal";
import KanbanBoard from "@/components/Admissions/KanbanBoard";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useSearchParams } from "next/navigation";
import { useBedsStore } from "@/lib/stores/useBedsStore";
import { useTodayPatientStore } from "@/lib/providers/todayPatientsProvider";

function Admissions() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [bedId, setbedId] = useState<string>("");
  const [bookingId, setbookingId] = useState<string>("");
  const [wasEdited, setWasEdited] = useState<boolean>(false);
  const { bedPatients, loading: bpLoading } = useBedsStore((state) => state);
  const { todayPatients, loading: tpLoading } = useTodayPatientStore(
    (state) => state
  );

  const searchParams = useSearchParams();
  const patientIdParam = searchParams.get("patientid");

  const openAddModal = (bedId: string) => {
    setIsModalOpen(true);
    setbedId(bedId);
  };

  const openEditModal = (bookingId: string, bedId: string) => {
    setIsEditModalOpen(true);
    setbookingId(bookingId);
    setbedId(bedId);
  };

  useEffect(() => {
    if (patientIdParam && !bpLoading && !tpLoading) {
      const isPatientAdmitted = patientIdParam in bedPatients;
      const isTodaysPatient = patientIdParam in todayPatients;

      if (isPatientAdmitted) {
        const bookingId = bedPatients[patientIdParam].bed_info.find(
          (bi) => bi.dischargeMarked == false
        )?.bedBookingId;
        const bedId = bedPatients[patientIdParam].bed_info.find(
          (bi) => bi.dischargeMarked == false
        )?.bedId;
        if (bookingId && bedId) openEditModal(bookingId, bedId);
      } else if (isTodaysPatient) {
        setbedId("");
        setIsModalOpen(true);
      } else {
        toast(`Patient with Id : ${patientIdParam} can't be admitted`, {
          duration: 3000,
          position: "bottom-right",
        });
      }
    }
  }, [patientIdParam, bpLoading, tpLoading, bedPatients, todayPatients]);

  return (
    <div className="h-auto relative">
      <Dialog
        open={isModalOpen}
        onOpenChange={(state) => setIsModalOpen(state)}
      >
        <DialogTitle hidden />
        <DialogDescription hidden />
        <DialogContent className="max-w-screen-md ">
          <BedAdmissionModal
            setIsModalOpen={setIsModalOpen}
            bedId={bedId}
            setbedId={setbedId}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(state) => setIsEditModalOpen(state)}
      >
        <DialogContent className="max-w-screen-md ">
          <DialogTitle hidden />
          <DialogDescription hidden />
          <BedEditModal
            setIsEditModalOpen={setIsEditModalOpen}
            bookingId={bookingId}
            bedId={bedId}
            setbedId={setbedId}
            setWasEdited={setWasEdited}
          />
        </DialogContent>
      </Dialog>

      <KanbanBoard
        isEditModalOpen={isEditModalOpen}
        openAddModal={openAddModal}
        openEditModal={openEditModal}
        setWasEdited={setWasEdited}
        wasEdited={wasEdited}
      />
    </div>
  );
}

export default Admissions;
