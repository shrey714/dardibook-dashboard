"use client";
import BedAdmissionModal from "@/components/Admissions/BedAdmissionModal";
import BedEditModal from "@/components/Admissions/BedEditModal";
import { KanbanBoard } from "@/components/Admissions/KanbanBoard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useOrganization } from "@clerk/nextjs";
import uniqid from "uniqid";
import { BedInfo } from "@/types/FormTypes";
import { updateOrgMetadata } from "../settings/clinic/_actions";

function Admissions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [bedId, setbedId] = useState("");
  const [bookingId, setbookingId] = useState("");
  const { organization } = useOrganization();
  const [bedAddLoader, setBedAddLoader] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [wasEdited, setWasEdited] = useState(false);

  const openAddModal = (bedId: string) => {
    setIsModalOpen(true);
    setbedId(bedId);
  };

  const openEditModal = (bookingId: string, bedId: string) => {
    setIsEditModalOpen(true);
    setbookingId(bookingId);
    setbedId(bedId);
  };

  const addNewBedHandler = async () => {
    if (!organization) return;
    setBedAddLoader(true);
    try {
      const currentBeds = (organization.publicMetadata?.bedMetaData ||
        []) as BedInfo[];
      const updatedBeds = [...currentBeds, { id: uniqid.time() }];
      const data = await updateOrgMetadata({ bedMetaData: updatedBeds });
      organization.reload();
      setRefresh((prev) => !prev);
    } catch (error) {
      toast.error("Error in adding Bed");
    } finally {
      setBedAddLoader(false);
    }
  };

  return (
    <div className="h-auto relative">
      <Dialog
        open={isModalOpen}
        onOpenChange={(state) => setIsModalOpen(state)}
      >
        <DialogContent className="max-w-screen-md ">
          <BedAdmissionModal setIsModalOpen={setIsModalOpen} bedId={bedId} />
        </DialogContent>
      </Dialog>
      <Dialog
        open={isEditModalOpen}
        onOpenChange={(state) => setIsEditModalOpen(state)}
      >
        <DialogContent className="max-w-screen-md ">
          <BedEditModal
            setIsEditModalOpen={setIsEditModalOpen}
            bookingId={bookingId}
            bedId={bedId}
            setWasEdited={setWasEdited}
          />
        </DialogContent>
      </Dialog>
      <KanbanBoard
        isEditModalOpen={isEditModalOpen}
        bedId={bedId}
        setbedId={setbedId}
        openAddModal={openAddModal}
        openEditModal={openEditModal}
        refresh={refresh}
        setWasEdited={setWasEdited}
        wasEdited={wasEdited}
        bedAddLoader={bedAddLoader}
        addNewBedHandler={addNewBedHandler}
      />
    </div>
  );
}

export default Admissions;
