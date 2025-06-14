"use client";
import BedAdmissionModal from "@/components/Admissions/BedAdmissionModal";
import BedEditModal from "@/components/Admissions/BedEditModal";
import { KanbanBoard } from "@/components/Admissions/KanbanBoard";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useOrganization } from "@clerk/nextjs";
import uniqid from "uniqid";
import { BedInfo } from "@/types/FormTypes";
import { updateOrgBedMetaData } from "./_actions";
import { DialogDescription } from "@radix-ui/react-dialog";

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
    const currentBeds = (organization.publicMetadata?.bedMetaData ||
      []) as BedInfo[];
    const updatedBeds = [...currentBeds, { id: uniqid.time() }];
    toast.promise(
      async () => {
        await updateOrgBedMetaData(updatedBeds)
          .then(
            () => {
              organization.reload();
              setRefresh((prev) => !prev);
            },
            (error) => {
              console.error("Error Adding New Bed:", error);
            }
          )
          .finally(() => {
            setBedAddLoader(false);
          });
      },
      {
        loading: "Adding new bed...",
        success: "New bed added successfully",
        error: "Error when adding bed",
      },
      {
        position: "bottom-right",
      }
    );
  };

  return (
    <div className="h-auto relative">
      <Dialog
        open={isModalOpen}
        onOpenChange={(state) => setIsModalOpen(state)}
      >
        <DialogTitle hidden />
        <DialogDescription hidden />
        <DialogContent className="max-w-screen-md ">
          <BedAdmissionModal setIsModalOpen={setIsModalOpen} bedId={bedId} />
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
