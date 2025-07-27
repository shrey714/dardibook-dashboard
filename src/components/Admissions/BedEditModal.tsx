import { db } from "@/firebase/firebaseConfig";
import { useBedsStore } from "@/lib/stores/useBedsStore";
import { useUser, useAuth, useOrganization } from "@clerk/nextjs";
import { getTime, isAfter, isBefore } from "date-fns";
import { writeBatch, doc } from "firebase/firestore";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import Availability from "./Availability";
import { BedInfo, OrgBed } from "@/types/FormTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  CalendarPlusIcon,
  CalendarMinusIcon,
  TimerOff,
  LogOut,
  FileEdit,
  Trash,
  User,
  Phone,
} from "lucide-react";
import { DateTimePicker } from "./DateTimePicker";
import { diff, PatientActivityLog } from "@/types/logTypes";
import { logActivity } from "@/utility/activityLogging/logActivity";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";

interface BedEditModalProps {
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bookingId: string | null;
  bedId: string | null;
  setbedId: React.Dispatch<React.SetStateAction<string | null>>;
  setWasEdited: React.Dispatch<React.SetStateAction<boolean>>;
}

const BedEditModal: React.FC<BedEditModalProps> = ({
  setIsEditModalOpen,
  bookingId,
  bedId,
  setbedId,
  setWasEdited,
}) => {
  const { user } = useUser();
  const { orgId } = useAuth();
  const { beds, bedPatients } = useBedsStore((state) => state);
  const filteredBeds = beds.filter((b) => b.bedId == bedId);
  const { organization, isLoaded } = useOrganization();

  const selectedAdmission = beds.find((bed) => bed.bedBookingId == bookingId);
  const patientData =
    selectedAdmission?.patient_id && bedPatients[selectedAdmission?.patient_id];

  const [fromDate, setFromDate] = useState<Date>(
    new Date(selectedAdmission?.admission_at || 0)
  );
  const [toDate, setToDate] = useState<Date>(
    new Date(selectedAdmission?.discharge_at || 0)
  );
  const [admissionInfo, setadmissionInfo] = useState<OrgBed | undefined>(
    selectedAdmission
  );
  const [updateLoader, setUpdateLoader] = useState(false);
  const [dischargeNowLoader, setDischargeNowLoader] = useState(false);
  const [alreadyDischargedLoader, setAlreadyDischargedLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  const { memberships } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
      role: ["org:doctor", "org:clinic_head"],
    },
  });

  const validateDatesForUpdate = (admissionDate: Date, dischargeDate: Date) => {
    setWarning(null);

    if (
      getTime(admissionDate) === getTime(new Date(0)) ||
      getTime(dischargeDate) === getTime(new Date(0))
    ) {
      return "Please select both admission and discharge times";
    }

    if (getTime(dischargeDate) <= getTime(admissionDate)) {
      return "Discharge time cannot be earlier than admission time";
    }

    const isClash = filteredBeds.some(
      ({ admission_at, discharge_at, bedBookingId }) => {
        if (bedBookingId === bookingId) {
          return false;
        }
        const existingStart = getTime(admission_at);
        const existingEnd = getTime(discharge_at);

        return (
          isBefore(getTime(admissionDate), existingEnd) &&
          isAfter(getTime(dischargeDate), existingStart)
        );
      }
    );

    if (isClash) {
      return "This time slot conflicts with an existing booking";
    }

    return null;
  };

  const dischargePatient = async (alreadyDischarged: boolean) => {
    if (!alreadyDischarged) {
      const isClash = filteredBeds.some(
        ({ admission_at, discharge_at, bedBookingId }) => {
          if (bedBookingId === bookingId) {
            return false;
          }
          const existingStart = getTime(admission_at);
          const existingEnd = getTime(discharge_at);

          return (
            isBefore(getTime(fromDate), existingEnd) &&
            isAfter(Date.now(), existingStart)
          );
        }
      );
      console.log(isClash);

      if (isClash) {
        setWarning(
          "Discharge Time is clashing with future bookings please update the future bookings"
        );
        return;
      }
    }
    if (alreadyDischarged) setAlreadyDischargedLoader(true);
    else setDischargeNowLoader(true);
    if (!orgId || !user) return;

    try {
      const batch = writeBatch(db);
      const currentBedData = beds.find((bed) => bed.bedBookingId == bookingId);
      if (!currentBedData || !bookingId) return;

      const bedPatientData = bedPatients[currentBedData?.patient_id];

      const bedRef = doc(db, "doctor", orgId, "beds", bookingId);
      const dischargedBookingInfo = {
        dischargeMarked: true,
        discharge_at: alreadyDischarged
          ? currentBedData.discharge_at
          : getTime(new Date()),
        discharged_by: {
          id: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
        },
      };
      batch.update(bedRef, dischargedBookingInfo);

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
              discharge_at: alreadyDischarged
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

      //logging
      const logData: PatientActivityLog = {
        agent_id: user.id,
        id: bookingId,
        action: "discharged",
        timestamp: Date.now(),
        oldData: null,
        newData: dischargedBookingInfo,
        module: "admission",
      };
      logActivity(logData);

      setWasEdited(true);

      await batch.commit();
    } catch (error) {
      void error;
      console.log(error);
      toast.error("Error discharging");
    } finally {
      if (alreadyDischarged) setAlreadyDischargedLoader(false);
      else setDischargeNowLoader(false);
      setIsEditModalOpen(false);
    }
  };

  const deleteBookingHandler = async (bookingId: string | null) => {
    const deletePromise = async () => {
      setDeleteLoader(true);
      const batch = writeBatch(db);

      const currentBedData = beds.find((bed) => bed.bedBookingId === bookingId);
      if (!currentBedData || !orgId || !bookingId)
        throw new Error("Booking not found");

      const patientId = currentBedData.patient_id;
      const bedRef = doc(db, "doctor", orgId, "beds", bookingId);
      const patientRef = doc(db, "doctor", orgId, "patients", patientId);

      const bedPatientData = bedPatients[patientId];
      if (!bedPatientData) throw new Error("Patient not found");

      const updatedBedInfo = bedPatientData.bed_info.filter(
        (patient_bed) => patient_bed.bedBookingId !== bookingId
      );

      batch.delete(bedRef);
      batch.update(patientRef, { bed_info: updatedBedInfo });

      await batch.commit();
    };

    await toast.promise(
      deletePromise().finally(() => {
        setDeleteLoader(false);
        setIsEditModalOpen(false);
      }),
      {
        loading: "Deleting booking...",
        success: "Booking deleted successfully!",
        error: (err) => err.message || "Failed to delete booking",
      },
      {
        style: {
          minWidth: "250px",
        },
      }
    );
  };

  const updateHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!orgId || !bedId || !user || !bookingId || !patientData) return;

    const validationError = validateDatesForUpdate(fromDate, toDate);
    if (validationError) {
      setWarning(validationError);
      return;
    }

    setUpdateLoader(true);

    try {
      const bedBookingId = admissionInfo?.bedBookingId || "";
      const batch = writeBatch(db);
      const bedRef = doc(db, "doctor", orgId, "beds", bedBookingId);
      const updatedBookingInfo = {
        ...admissionInfo,
        bedBookingId: bedBookingId,
        bedId: bedId,
        admission_at: getTime(fromDate),
        discharge_at: getTime(toDate),
      };
      batch.update(bedRef, updatedBookingInfo);
      const { patient_id, ...admissionInfoExcludingPatientId } =
        admissionInfo as OrgBed;

      const patientRef = doc(db, "doctor", orgId, "patients", patient_id);
      const newData = {
        ...admissionInfoExcludingPatientId,
        bedBookingId: bedBookingId,
        bedId: bedId,
        admission_at: getTime(fromDate),
        discharge_at: getTime(toDate),
      };
      const updatedBedInfo = patientData.bed_info.map((bedInfo) =>
        bedInfo.bedBookingId === bookingId
          ? { ...bedInfo, ...newData }
          : bedInfo
      );
      batch.update(patientRef, {
        bed_info: updatedBedInfo,
      });
      await batch.commit();

      //logging
      const { oldData: oldLogData, newData: newLogData } = diff(
        selectedAdmission!,
        updatedBookingInfo
      );
      const logData: PatientActivityLog = {
        agent_id: user.id,
        id: bookingId,
        action: "admission_updated", //added | updated | removed
        timestamp: Date.now(),
        oldData: oldLogData,
        newData: newLogData,
        module: "admission",
      };
      logActivity(logData);

      setWasEdited(true);
    } catch (error) {
      console.log(error);
      toast.error("Error updating");
    } finally {
      setUpdateLoader(false);
      setIsEditModalOpen(false);
    }
  };

  const fromDateTimeChangeHandler = (admissionDataFromCalender: Date) => {
    setFromDate(admissionDataFromCalender);

    if (getTime(toDate) !== getTime(new Date(0))) {
      const validationError = validateDatesForUpdate(
        admissionDataFromCalender,
        toDate
      );
      setWarning(validationError);
    } else {
      setWarning(null);
    }
  };

  const toDateTimeChangeHandler = (dischargeDataFromCalender: Date) => {
    setToDate(dischargeDataFromCalender);

    if (getTime(fromDate) !== getTime(new Date(0))) {
      const validationError = validateDatesForUpdate(
        fromDate,
        dischargeDataFromCalender
      );
      setWarning(validationError);
    } else {
      setWarning(null);
    }
  };

  const bedInfo = useMemo(() => {
    return isLoaded && organization && organization.publicMetadata.beds
      ? (organization.publicMetadata?.beds as BedInfo[])
      : [];
  }, [isLoaded, organization]);

  const isFormValid = () => {
    return (
      bedId &&
      admissionInfo?.admission_for.id &&
      getTime(fromDate) !== getTime(new Date(0)) &&
      getTime(toDate) !== getTime(new Date(0)) &&
      warning === null
    );
  };

  const isOverDue =
    selectedAdmission?.discharge_at &&
    selectedAdmission?.discharge_at < getTime(new Date());

  return (
    <>
      {patientData && (
        <div className="flex flex-1 items-center space-x-2 sm:space-x-4 p-4 border-b w-full">
          <User className="size-11 shrink-0 border border-muted-foreground rounded-full p-2 text-muted-foreground" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm md:text-base font-medium line-clamp-1">
                {patientData.name}
              </h3>
              <Badge
                variant={"outline"}
                className="bg-blue-500/10 border-blue-500 text-blue-500 rounded-full line-clamp-1"
              >
                {patientData.patient_id}
              </Badge>
            </div>
            <div className="flex items-center mt-1 text-sm text-muted-foreground gap-x-3 flex-wrap">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                <span>
                  {patientData.gender}({patientData.age})
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                <span className="line-clamp-1">{patientData.mobile}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <form
        className="flex flex-col flex-1 overflow-y-auto gap-2 sm:gap-3 px-2 sm:px-4 md:px-6 py-2 sm:py-4 md:py-6"
        onSubmit={updateHandler}
      >
        <div className="bg-input/30 border rounded-md">
          <h3 className="text-sm text-muted-foreground leading-tight justify-self-center p-2">
            Available Beds
          </h3>
          <div className="flex flex-wrap gap-2 overflow-auto scroll-smooth max-h-[300px] p-3">
            {bedInfo.length === 0 ? (
              <p className="text-sm text-muted-foreground mx-auto py-3">
                No beds available for selected timeline
              </p>
            ) : (
              bedInfo.map((bed, index) => (
                <Button
                  key={index}
                  type="button"
                  size="sm"
                  variant={"ghost"}
                  onClick={() => {
                    setbedId(bed.bed_id);
                  }}
                  className={`h-auto min-w-24 flex flex-col items-center justify-center gap-0.5 p-2 text-xs bg-green-500/20 text-green-600 hover:text-green-500 hover:bg-green-500/40 transition-all duration-300 ${
                    bed.bed_id === bedId &&
                    "ring-2 ring-primary/90 ring-offset-2"
                  } ${bed.bed_id === selectedAdmission?.bedId && "bg-blue-500/20 text-blue-600 hover:text-blue-500 hover:bg-blue-500/40"}`}
                >
                  <p className="truncate">{bed.bed_id}</p>
                  <p>{bed.ward}</p>
                </Button>
              ))
            )}
          </div>
        </div>

        <Availability beds={filteredBeds} bedPatients={bedPatients} />
        <div className="py-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          <div className="space-y-2">
            <Label htmlFor="registerd_for">
              Appointed Doctor<p className="text-red-500">*</p>
            </Label>
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
                    id: userId as string,
                    name: `${firstName} ${lastName}`.trim(),
                    email: identifier,
                  };

                  if (!admissionInfo) return;

                  setadmissionInfo({
                    ...admissionInfo,
                    admission_for: selectedMember,
                  });
                }
              }}
            >
              <SelectTrigger
                autoFocus={true}
                id="registerd_for"
                className="w-full"
              >
                <SelectValue placeholder="Doctor" />
              </SelectTrigger>
              <SelectContent>
                {memberships &&
                  memberships.data?.map((member, index) =>
                    member.publicUserData?.userId ? (
                      <SelectItem
                        value={member.publicUserData.userId}
                        key={index}
                      >
                        {[
                          member.publicUserData.firstName,
                          member.publicUserData.lastName,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      </SelectItem>
                    ) : (
                      <></>
                    )
                  )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="admission_for">
              Admission Time<p className="text-red-500">*</p>
            </Label>
            <DateTimePicker
              date={fromDate}
              setDate={setFromDate}
              icon={<CalendarPlusIcon className="mr-2 h-4 w-4" />}
              onChange={fromDateTimeChangeHandler}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admission_for">
              Exp. Discharge Time<p className="text-red-500">*</p>
            </Label>
            <DateTimePicker
              date={toDate}
              setDate={setToDate}
              icon={<CalendarMinusIcon className="mr-2 h-4 w-4" />}
              disableBefore={fromDate}
              onChange={toDateTimeChangeHandler}
              required
            />
          </div>
        </div>
        {warning && (
          <p className="text-center text-red-500 px-2 py-1 leading-tight w-fit mx-auto font-normal rounded-md border border-red-600 text-sm bg-destructive/20">
            {warning}
          </p>
        )}
        <div
          className={`grid gap-2 grid-cols-1 sm:grid-cols-2 ${
            isOverDue ? "md:grid-cols-4" : "md:grid-cols-3"
          } mt-4`}
        >
          {isOverDue && (
            <Button
              onClick={() => dischargePatient(true)}
              type="button"
              variant={"destructive"}
              icon={TimerOff}
              iconPlacement="left"
              loading={alreadyDischargedLoader}
              loadingText="Discharging"
            >
              Already Discharge
            </Button>
          )}
          <Button
            onClick={() => dischargePatient(false)}
            type="button"
            variant={"destructive"}
            icon={LogOut}
            iconPlacement="left"
            loading={dischargeNowLoader}
            loadingText="Discharging"
          >
            Discharge Now
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid() || updateLoader}
            icon={FileEdit}
            iconPlacement="left"
            loading={updateLoader}
            loadingText="Updating"
          >
            Update Booking
          </Button>
          <Button
            type="button"
            onClick={() => {
              deleteBookingHandler(bookingId);
            }}
            disabled={deleteLoader}
            icon={Trash}
            iconPlacement="left"
            loading={deleteLoader}
            loadingText="Deleting"
          >
            Delete Booking
          </Button>
        </div>
      </form>
    </>
  );
};

export default BedEditModal;
