import React, { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { CalendarMinusIcon, CalendarPlusIcon } from "lucide-react";
import { db } from "@/firebase/firebaseConfig";
import { writeBatch, doc, arrayUnion } from "firebase/firestore";
import { useTodayPatientStore } from "@/lib/providers/todayPatientsProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth, useOrganization, useUser } from "@clerk/nextjs";
import { BedInfo, orgUserType } from "@/types/FormTypes";
import { DateTimePicker } from "./DateTimePicker";
import toast from "react-hot-toast";
import { getTime, isBefore, isAfter } from "date-fns";
import uniqid from "uniqid";
import Availability from "./Availability";
import { useBedsStore } from "@/lib/stores/useBedsStore";
import { logActivity } from "@/utility/activityLogging/logActivity";
import { PatientActivityLog } from "@/types/logTypes";
import { useToken } from "@/firebase/TokenStore";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "../ui/label";

interface BedAdmissionModalProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  bedId: string | null;
  setbedId: React.Dispatch<React.SetStateAction<string | null>>;
  patientId: string | null;
  setPatientId: React.Dispatch<React.SetStateAction<string | null>>;
}

interface SuggestionType {
  label: string;
  value: string;
  patient_id: string;
  mobile: string;
  inBed: boolean;
}

const BedAdmissionModal: React.FC<BedAdmissionModalProps> = ({
  setIsModalOpen,
  bedId,
  setbedId,
  patientId,
  setPatientId,
}) => {
  const { orgId } = useAuth();
  const { user } = useUser();
  const { doctorId } = useToken();
  const { todayPatients, loading } = useTodayPatientStore((state) => state);
  const { beds, bedPatients } = useBedsStore((state) => state);

  const [fromDate, setFromDate] = useState<Date>(new Date(0));
  const [toDate, setToDate] = useState<Date>(new Date(0));

  const { memberships } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
      role: ["org:doctor", "org:clinic_head"],
    },
  });

  const [admissionFor, setAdmissionFor] = useState<orgUserType>({
    id: doctorId || "",
    name: "",
    email: "",
  });
  const [loader, setloader] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  const { organization, isLoaded } = useOrganization();

  const bedInfo = useMemo(() => {
    return isLoaded && organization && organization.publicMetadata.beds
      ? (organization.publicMetadata?.beds as BedInfo[])
      : [];
  }, [isLoaded, organization]);

  const filteredBed = beds.filter((b) => b.bedId == bedId);

  const fetchedSuggestions = !loading
    ? todayPatients
        .filter((todayPatient) => {
          const isAlreadyAdmitted = beds.some(
            (b) => b.patient_id == todayPatient.patient_id
          );
          return todayPatient.inBed === false && !isAlreadyAdmitted;
        })
        .map(
          (todayPatient): SuggestionType => ({
            label: todayPatient.name,
            value: todayPatient.patient_id,
            patient_id: todayPatient.patient_id,
            mobile: todayPatient.mobile,
            inBed: todayPatient.inBed,
          })
        )
    : [];

  const selectedPatient = fetchedSuggestions.find(
    (patient) => patient.patient_id === patientId
  );

  const validateDates = (admissionDate: Date, dischargeDate: Date) => {
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

    const now = Date.now();
    if (getTime(admissionDate) <= now) {
      return "Admission time must be in the future";
    }

    if (getTime(dischargeDate) <= now) {
      return "Discharge time must be in the future";
    }

    const isClash = filteredBed.some(({ admission_at, discharge_at }) => {
      const existingStart = getTime(admission_at);
      const existingEnd = getTime(discharge_at);

      return (
        isBefore(getTime(admissionDate), existingEnd) &&
        isAfter(getTime(dischargeDate), existingStart)
      );
    });

    if (isClash) {
      return "This time slot conflicts with an existing booking";
    }

    return null;
  };

  const admitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!orgId || !bedId || !user || !patientId) return;

    const validationError = validateDates(fromDate, toDate);
    if (validationError) {
      setWarning(validationError);
      return;
    }

    setloader(true);

    try {
      const bedBookingId = uniqid.time();
      const batch = writeBatch(db);
      const bedRef = doc(db, "doctor", orgId, "beds", bedBookingId);
      const bedAdmissionData = {
        admission_for: admissionFor,
        patient_id: patientId,
        bedBookingId: bedBookingId,
        bedId: bedId,
        admission_at: getTime(fromDate),
        discharge_at: getTime(toDate),
        dischargeMarked: false,
        admission_by: {
          id: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
        },
      };
      batch.set(bedRef, bedAdmissionData, { merge: true });
      const patientRef = doc(db, "doctor", orgId, "patients", patientId);
      batch.set(
        patientRef,
        {
          bed_info: arrayUnion({
            admission_for: admissionFor,
            bedBookingId: bedBookingId,
            bedId: bedId,
            admission_at: getTime(fromDate),
            discharge_at: getTime(toDate),
            dischargeMarked: false,
            admission_by: {
              id: user.id,
              name: user.fullName,
              email: user.primaryEmailAddress?.emailAddress,
            },
          }),
        },
        { merge: true }
      );
      await batch.commit();
      //logging
      const logData: PatientActivityLog = {
        agent_id: user.id,
        id: bedBookingId,
        action: "admitted",
        timestamp: Date.now(),
        oldData: null,
        newData: bedAdmissionData,
        module: "admission",
      };
      logActivity(logData);
    } catch (error) {
      console.log(error);
      toast.error("Error updating");
    } finally {
      setloader(false);
      setIsModalOpen(false);
    }
  };

  const suggestedBeds = useMemo(() => {
    if (
      getTime(fromDate) === getTime(new Date(0)) ||
      getTime(toDate) === getTime(new Date(0)) ||
      getTime(toDate) <= getTime(fromDate) ||
      getTime(fromDate) <= Date.now() ||
      getTime(toDate) <= Date.now()
    ) {
      return [];
    }

    return bedInfo.filter((info) => {
      const bookingsForBed = beds.filter((b) => b.bedId === info.bed_id);
      return !bookingsForBed.some(({ admission_at, discharge_at }) => {
        return (
          isBefore(getTime(fromDate), getTime(discharge_at)) &&
          isAfter(getTime(toDate), getTime(admission_at))
        );
      });
    });
  }, [bedInfo, beds, fromDate, toDate]);

  const fromDateTimeChangeHandler = (admissionDataFromCalender: Date) => {
    setFromDate(admissionDataFromCalender);

    if (getTime(toDate) !== getTime(new Date(0))) {
      const validationError = validateDates(admissionDataFromCalender, toDate);
      setWarning(validationError);
    } else {
      setWarning(null);
    }
  };

  const toDateTimeChangeHandler = (dischargeDataFromCalender: Date) => {
    setToDate(dischargeDataFromCalender);

    if (getTime(fromDate) !== getTime(new Date(0))) {
      const validationError = validateDates(
        fromDate,
        dischargeDataFromCalender
      );
      setWarning(validationError);
    } else {
      setWarning(null);
    }
  };

  const isFormValid = () => {
    return (
      patientId &&
      bedId &&
      admissionFor.id.length > 0 &&
      getTime(fromDate) !== getTime(new Date(0)) &&
      getTime(toDate) !== getTime(new Date(0)) &&
      warning === null
    );
  };

  const [open, setOpen] = React.useState(false);

  return (
    <form
      className="flex flex-col flex-1 overflow-y-auto gap-2 sm:gap-3 pt-1 px-2 sm:px-4 md:px-6 pb-2 sm:pb-4 md:pb-6"
      onSubmit={admitHandler}
    >
      <Popover modal open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between max-w-2xl w-full mx-auto rounded-full h-auto px-6 py-3"
          >
            {patientId ? (
              <span className="flex flex-row gap-1">
                <p>{selectedPatient?.label || ""}</p>
                <p className="text-muted-foreground"> - {patientId}</p>
              </span>
            ) : (
              <p className="text-muted-foreground truncate">
                Admit patient using ID, name, or phone number...
              </p>
            )}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="sm:w-[450px] md:w-[600px] p-0">
          <Command>
            <CommandInput
              placeholder="Search by ID, name, or phone..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No registred patient found.</CommandEmpty>
              <CommandGroup>
                {fetchedSuggestions
                  .filter((patient) => !patient.inBed)
                  .map((patient) => (
                    <CommandItem
                      key={patient.patient_id}
                      value={`${patient.label} ${patient.patient_id} ${patient.mobile}`}
                      onSelect={() => {
                        if (patientId === patient.patient_id) {
                          setPatientId(null);
                        } else {
                          setPatientId(patient.patient_id);
                        }
                        setOpen(false);
                      }}
                      className="grid grid-cols-7 gap-1 py-1 px-2 sm:px-4"
                    >
                      <div className="col-span-3 flex flex-col">
                        <p className="text-sm leading-tight font-normal">
                          {patient.label}
                        </p>
                        <p className="text-sm leading-tight text-muted-foreground">
                          {patient.patient_id}
                        </p>
                      </div>
                      <div className="col-span-3 text-sm leading-tight">
                        {patient.mobile}
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <Check
                          className={cn(
                            "h-4 w-4",
                            patientId === patient.patient_id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </div>
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {bedId ? (
        <div className="w-full mt-2">
          <span className="text-sm text-muted-foreground flex items-center gap-2">
            <p className="font-semibold text-primary">{bedId}</p>
            <p>Availibility :</p>
          </span>
          <Availability beds={filteredBed} bedPatients={bedPatients} />
        </div>
      ) : (
        <div className="relative w-full h-44 flex flex-col mt-2">
          <span className="h-4 rounded-md w-28 bg-border opacity-80 dark:opacity-40"></span>
          <span className="flex flex-row justify-between mt-2">
            <p className="h-4 w-8 bg-border rounded-md opacity-80 dark:opacity-40"></p>
            <p className="h-4 w-8 bg-border rounded-md opacity-80 dark:opacity-40"></p>
          </span>
          <span className="h-8 sm:h-9 w-full bg-border mt-2 opacity-80 dark:opacity-40"></span>

          <div className="flex flex-row gap-2 mt-5 mx-auto overflow-hidden justify-center w-full">
            {Array.from({ length: 10 }).map((_, index) => (
              <span
                key={index}
                className="size-10 sm:size-14 bg-border rounded-md opacity-80 dark:opacity-40"
              ></span>
            ))}
          </div>

          <span className="absolute w-full h-full text-sm sm:text-base flex items-center justify-center text-center p-3 truncate text-muted-foreground font-medium">
            <p>Select bed to view availability</p>
          </span>
        </div>
      )}
      <div className="py-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
        <div className="space-y-2">
          <Label htmlFor="admission_for">
            Appointed Doctor<p className="text-red-500">*</p>
          </Label>
          <Select
            aria-hidden={false}
            required
            value={admissionFor?.id}
            name="admission_for"
            onValueChange={(val) => {
              const member = memberships?.data?.find(
                (mem) => mem.publicUserData?.userId === val
              );

              if (member && member.publicUserData?.userId) {
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

                setAdmissionFor(selectedMember);
              }
            }}
          >
            <SelectTrigger
              autoFocus={true}
              id="registerd_for"
              className={`w-full ${
                admissionFor?.id === doctorId && "text-green-500"
              }`}
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
            disableBefore={new Date()}
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
      <div className="bg-input/30 border rounded-md">
        <h3 className="text-sm text-muted-foreground leading-tight justify-self-center p-2">
          Available Beds
        </h3>
        <div className="flex flex-wrap gap-2 overflow-auto scroll-smooth max-h-[300px] p-3">
          {suggestedBeds.length === 0 ? (
            <p className="text-sm text-muted-foreground mx-auto py-3">
              No beds available for selected timeline
            </p>
          ) : (
            suggestedBeds.map((bed, index) => (
              <Button
                key={index}
                type="button"
                size="sm"
                variant={"ghost"}
                onClick={() => {
                  if (bed.bed_id === bedId) {
                    setbedId(null);
                  } else setbedId(bed.bed_id);
                }}
                className={`h-auto min-w-24 flex flex-col items-center justify-center gap-0.5 p-2 text-xs bg-green-500/20 text-green-600 hover:text-green-500 hover:bg-green-500/40 transition-all duration-300 ${
                  bed.bed_id === bedId
                    ? "ring-2 ring-primary/90 ring-offset-2"
                    : ""
                }`}
              >
                <p className="truncate">{bed.bed_id}</p>
                <p>{bed.ward}</p>
              </Button>
            ))
          )}
        </div>
      </div>
      {warning && (
        <p className="text-center text-red-500 px-2 py-1 leading-tight w-fit mx-auto font-normal rounded-md border border-red-600 text-sm bg-destructive/20">
          {warning}
        </p>
      )}
      <Button
        type="submit"
        disabled={!isFormValid()}
        loading={loader}
        loadingText="Admitting"
        effect={"ringHover"}
        className="max-w-md mx-auto w-full mt-4"
      >
        Admit Patient
      </Button>
    </form>
  );
};

export default BedAdmissionModal;
