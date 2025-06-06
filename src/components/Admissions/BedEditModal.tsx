import { db } from "@/firebase/firebaseConfig";
import { useBedsStore } from "@/lib/stores/useBedsStore";
import { useUser, useAuth, useOrganization } from "@clerk/nextjs";
import { getTime, isAfter, isBefore } from "date-fns";
import { writeBatch, doc, arrayUnion } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import Loader from "../common/Loader";
import Availability from "./Availability";
import { BedPatientTypes, OrgBed } from "@/types/FormTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CalendarPlusIcon, CalendarMinusIcon } from "lucide-react";
import { DateTimePicker } from "../Appointment/DateTimePicker";
import { Organization } from "@clerk/nextjs/server";
import { CategoryBar } from "../ui/CategoryBar";

interface BedEditModalProps {
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bookingId: string;
  bedId: string;
  setWasEdited: React.Dispatch<React.SetStateAction<boolean>>;
}

const BedEditModal: React.FC<BedEditModalProps> = ({
  setIsEditModalOpen,
  bookingId,
  bedId,
  setWasEdited
}) => {
  const { user } = useUser();
  const { orgId } = useAuth();
  const [dischargeLoader, setDischargeLoader] = useState(false);
  const { beds, bedPatients } = useBedsStore((state) => state);

  const selectedAdmission = beds.find((bed) => bed.bedBookingId == bookingId);
  const patientData = (selectedAdmission?.patient_id && bedPatients[selectedAdmission?.patient_id]) as BedPatientTypes;

  const [fromDate, setFromDate] = useState<Date>(new Date(selectedAdmission?.admission_at || 0));
  const [toDate, setToDate] = useState<Date>(new Date(selectedAdmission?.discharge_at || 0));
  const [admissionInfo, setadmissionInfo] = useState<OrgBed | undefined>(selectedAdmission);
  const [loader, setloader] = useState(false);
  const [warning, setWarning] = useState<string>("");

  const { memberships } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
      role: ["org:doctor", "org:clinic_head"],
    },
  });      

  const dischargePatient = async () => {
    setDischargeLoader(true);
    if (!orgId || !user) return;

    try {
      const batch = writeBatch(db);
      const currentBedData = beds.find((bed) => bed.bedBookingId == bookingId);
      if (!currentBedData) return;

      const bedPatientData = bedPatients[currentBedData?.patient_id];

      const bedRef = doc(db, "doctor", orgId, "beds", bookingId);
      console.log(`deleting ${currentBedData?.patient_id} ${bookingId}`)
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
      console.log("updatedBedInfo : ",updatedBedInfo)

      batch.update(patientRef, { bed_info: updatedBedInfo });
      setWasEdited(true);

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

  const updateHandler = async (e: { preventDefault: () => void }) => {
    console.log("calling submit handker")
      e.preventDefault();
      if (!orgId || !bedId || !user) return;

      if (
        getTime(fromDate) === getTime(new Date(0)) ||
        getTime(toDate) === getTime(new Date(0))
      ) {
        setWarning("Please Select appropriate booking times");
        return;
      }

      const isClash = beds.some(({ admission_at, discharge_at,bedBookingId }) => {
        if (bedBookingId === bookingId) {
          //Ignore checking clash with the booking being updated itself
          return false;
        }
        const existingStart = getTime(admission_at);
        const existingEnd = getTime(discharge_at);

        return (
          isBefore(getTime(fromDate), existingEnd) &&
          isAfter(getTime(toDate), existingStart)
        );
      });

      if (isClash) {
        setWarning("This time slot is already booked");
        return;
      }

      setloader(true);

      try {
        const bedBookingId = admissionInfo?.bedBookingId || "";
        const batch = writeBatch(db);
        const bedRef = doc(db, "doctor", orgId, "beds", bedBookingId);
        batch.update(
          bedRef,
          {
            ...admissionInfo,
            bedBookingId: bedBookingId,
            bedId: bedId,
            admission_at: getTime(fromDate),
            discharge_at: getTime(toDate),
          }
        );
        const {patient_id,...admissionInfoExcludingPatientId} = admissionInfo as OrgBed;

        const patientRef = doc(db, "doctor", orgId, "patients", patient_id);
        const newData = {
          ...admissionInfoExcludingPatientId,
          bedBookingId: bedBookingId,
          bedId: bedId,
          admission_at: getTime(fromDate),
          discharge_at: getTime(toDate),
        };
        const updatedBedInfo = patientData.bed_info.map((bedInfo)=>bedInfo.bedBookingId === bookingId ? {...bedInfo,...newData} : bedInfo);
        console.log(updatedBedInfo);
        batch.update(
          patientRef,
          {
            bed_info: updatedBedInfo,
          }
        );
        await batch.commit();
        setWasEdited(true);
      } catch (error) {
        console.log(error);
        toast.error("Error updating");
      } finally {
        setloader(false);
        setIsEditModalOpen(false);
      }
    };

  return (
    <form className="flex flex-col" onSubmit={updateHandler}>
      <p className="text-center">Bed Id : {bedId}</p>
      <Availability beds={beds} bedPatients={bedPatients} />
      <div className=" py-1 md:grid md:grid-cols-3 sm:gap-4 md:px-8">
        <label
          htmlFor="registerd_for"
          className="text-sm font-medium leading-6  flex items-center gap-1"
        >
          Appointed Doctor<p className="text-red-500">*</p>
        </label>
        <Select
          aria-hidden={false}
          required
          name="registerd_for"
          value={admissionInfo?.admission_for.id || ""}
          onValueChange={(val) => {
            const member = memberships?.data?.find(
              (mem) => mem.publicUserData?.userId === val
            );

            if (member && member.publicUserData) {
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

              setadmissionInfo((prev: any) => ({
                ...prev,
                admission_for: selectedMember,
              }));
            }
          }}
        >
          <SelectTrigger
            autoFocus={true}
            id="registerd_for"
            className="w-full md:col-span-2 disabled:text-primary shadow-sm rounded-md border-border bg-transparent form-input py-1 pl-2 sm:text-sm sm:leading-6"
          >
            <SelectValue placeholder="Doctor" />
          </SelectTrigger>
          <SelectContent>
            {memberships &&
              memberships.data?.map((member, index) =>
                member.publicUserData?.userId ? (
                  <SelectItem value={member.publicUserData.userId} key={index}>
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
      <div className="flex flex-col md:px-8 sm:flex-row gap-2 pt-1 pb-4">
        <div className="flex-1">
          <DateTimePicker
            registered_date={[]}
            date={fromDate}
            setDate={setFromDate}
            icon={<CalendarPlusIcon mr-2 h-4 w-4 />}
          />
        </div>
        <div className="flex-1">
          <DateTimePicker
            registered_date={[]}
            date={toDate}
            setDate={setToDate}
            icon={<CalendarMinusIcon mr-2 h-4 w-4 />}
          />
        </div>
      </div>
      {warning.length > 0 && (
        <p className="text-center text-red-600 font-normal pb-4">{warning}</p>
      )}
      <div className="flex gap-2">
      <Button onClick={dischargePatient} className="flex-1" type="button">
        {dischargeLoader ? <Loader /> : "discharge"}
      </Button>
      <Button type="submit" className="flex-1"> {loader ? "loading" : "Update Booking"} </Button>
      </div>
    </form>
  );
};

export default BedEditModal;
