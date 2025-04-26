"use client";
import BedAdmissionModal from "@/components/Admissions/BedAdmissionModal";
import BedEditModal from "@/components/Admissions/BedEditModal";
import { KanbanBoard } from "@/components/Admissions/KanbanBoard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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

  const openEditModal = (bookingId: string,bedId: string) => {
    console.log("bedId : ",bedId);
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
      const updatedBeds = [...currentBeds, { id: uniqid.time() }];;
      console.log(updatedBeds)
      const data = await updateOrgMetadata({ bedMetaData: updatedBeds });
      organization.reload();
      setRefresh((prev)=>!prev);
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error("Error in adding Bed");
    } finally {
      setBedAddLoader(false);
    }
  };

  return (
    <React.Fragment>
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
      <div className="w-full mb-16 mt-4 pl-4 min-h-[calc(100%-5rem)] flex flex-col">
        <KanbanBoard
        isEditModalOpen={isEditModalOpen}
          bedId={bedId}
          setbedId={setbedId}
          openAddModal={openAddModal}
          openEditModal={openEditModal}
          refresh={refresh}
          setWasEdited={setWasEdited}
          wasEdited={wasEdited}
        />
      </div>
      <div
        className="flex items-center justify-center gap-x-4 sm:gap-x-6 absolute 
            bg-clip-padding backdrop-filter backdrop-blur-sm
            bottom-0 py-2 border-t sm:py-3 left-0 right-0"
      >
        <Button
          className="w-28 sm:w-32"
          type="submit"
          variant={"default"}
          onClick={addNewBedHandler}
        >
          {bedAddLoader?<Loader />:"Add New Bed"}
        </Button>
      </div>
    </React.Fragment>
  );
}

export default Admissions;
