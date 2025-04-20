import { db } from "@/firebase/firebaseConfig";
import { useBedsStore } from "@/lib/stores/useBedsStore";
import { useUser, useAuth } from "@clerk/nextjs";
import { getTime } from "date-fns";
import { writeBatch, doc } from "firebase/firestore";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import Loader from "../common/Loader";
import Availability from "./Availability";

interface BedEditModalProps {
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bookingId: string;
}

const BedEditModal: React.FC<BedEditModalProps> = ({
  setIsEditModalOpen,
  bookingId,
}) => {
  const { user } = useUser();
  const { orgId } = useAuth();
  const [dischargeLoader, setDischargeLoader] = useState(false);
  const { beds, bedPatients } = useBedsStore((state) => state);

  const dischargePatient = async () => {
    setDischargeLoader(true);
    if (!orgId || !user) return;

    try {
      const batch = writeBatch(db);
      const currentBedData = beds.find((bed) => bed.bedBookingId == bookingId);
      console.log(bookingId, currentBedData);
      if (!currentBedData) return;

      const bedPatientData = bedPatients[currentBedData?.patient_id];

      const bedRef = doc(db, "doctor", orgId, "beds", bookingId);
      batch.update(bedRef, {
        dischargeMarked: true,
        discharge_at:
          currentBedData.discharge_at < getTime(new Date())
            ? currentBedData.discharge_at
            : getTime(new Date()),
        discharged_by: {
          id: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
        },
      });

      const patientRef = doc(
        db,
        "doctor",
        orgId,
        "patients",
        bedPatientData.patient_id
      );
      const updatedBedInfo = bedPatientData.bed_info.map((patient_bed) =>
        patient_bed.bedBookingId === currentBedData.bedBookingId
          ? {
              ...patient_bed,
              dischargeMarked: true,
              discharge_at:
                currentBedData.discharge_at < getTime(new Date())
                  ? currentBedData.discharge_at
                  : getTime(new Date()),
              discharged_by: {
                id: user.id,
                name: user.fullName,
                email: user.primaryEmailAddress?.emailAddress,
              },
            }
          : patient_bed
      );

      batch.update(patientRef, { bed_info: updatedBedInfo });

      await batch.commit();
    } catch (error) {
      void error;
      console.log(error);
      toast.error("Error discharging");
    } finally {
      setDischargeLoader(false);
      setIsEditModalOpen(false);
    }
  };

  return (
    <div>
      <Availability beds={beds} bedPatients={bedPatients}/>
      <Button onClick={dischargePatient}>
        {dischargeLoader ? <Loader /> : "discharge"}
      </Button>
    </div>
  );
};

export default BedEditModal;
