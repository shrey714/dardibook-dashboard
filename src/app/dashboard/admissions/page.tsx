"use client";
import BedAdmissionModal from "@/components/Admissions/BedAdmissionModal";
import BedEditModal from "@/components/Admissions/BedEditModal";
import { KanbanBoard } from "@/components/Admissions/KanbanBoard";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";

function Admissions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bedId, setbedId] = useState("");
  const [bookingId, setbookingId] = useState("");

  return (
    <React.Fragment>
      <Dialog
        open={isModalOpen}
        onOpenChange={(state) => setIsModalOpen(state)}
      >
        <DialogContent className="max-w-screen-md ">
          <BedAdmissionModal setIsModalOpen={setIsModalOpen} bedId={bedId}/>
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(state) => setIsEditModalOpen(state)}
      >
        <DialogContent className="max-w-screen-md ">
          <BedEditModal setIsEditModalOpen={setIsEditModalOpen} bookingId={bookingId}/>
        </DialogContent>
      </Dialog>
      <div className="w-full">
      <KanbanBoard setIsModalOpen={setIsModalOpen} bedId={bedId} setbedId={setbedId} setIsEditModalOpen={setIsEditModalOpen} setbookingId={setbookingId}/>
      </div>
    </React.Fragment>
  );
}

export default Admissions;
