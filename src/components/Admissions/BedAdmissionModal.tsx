import React, { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  ArrowUpRight,
  CalendarMinusIcon,
  CalendarPlusIcon,
} from "lucide-react";
import { db } from "@/firebase/firebaseConfig";
import { writeBatch, doc, arrayUnion } from "firebase/firestore";
import { useTodayPatientStore } from "@/lib/providers/todayPatientsProvider";
import CreatableSelect from "react-select/creatable";
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
import { Spinner } from "../ui/spinner";

interface BedAdmissionModalProps {
  bedId: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setbedId: React.Dispatch<React.SetStateAction<string>>;
}

interface SuggestionType {
  label: string;
  value: string;
  patient_id: string;
  mobile: string;
  inBed: boolean;
}

const BedAdmissionModal: React.FC<BedAdmissionModalProps> = ({
  bedId,
  setIsModalOpen,
  setbedId,
}) => {
  const { orgId } = useAuth();
  const { user } = useUser();
  const { todayPatients, loading } = useTodayPatientStore((state) => state);
  const [fromDate, setFromDate] = useState<Date>(new Date(0));
  const [patientId, setPatientId] = useState<string>("");
  const [toDate, setToDate] = useState<Date>(new Date(0));

  const { memberships } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
      role: ["org:doctor", "org:clinic_head"],
    },
  });

  const [admissionFor, setAdmissionFor] = useState<orgUserType>({
    id: "",
    name: "",
    email: "",
  });
  const [loader, setloader] = useState(false);
  const [warning, setWarning] = useState<string>("");
  const { beds, bedPatients } = useBedsStore((state) => state);
  const [bedInfo, setBedInfo] = useState<BedInfo[] | []>([]);
  const { organization, isLoaded } = useOrganization();

  const filteredBeds = beds.filter((b) => b.bedId == bedId);

  const fetchedSuggestions = todayPatients
    .filter((todayPatient) => {
      const isAlreadyAdmitted = beds.some(b=>b.patient_id==todayPatient.patient_id);
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
    );

  const validateDates = (admissionDate: Date, dischargeDate: Date): string => {
    setWarning("");

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

    const isClash = filteredBeds.some(({ admission_at, discharge_at }) => {
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

    return "";
  };

  const admitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!orgId || !bedId || !user) return;

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
      }
      batch.set(
        bedRef,
        bedAdmissionData,
        { merge: true }
      );
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
        oldData:null,
        newData:bedAdmissionData,
        module: "admission"
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

    setbedId("");
    return bedInfo.filter((info) => {
      const bookingsForBed = beds.filter(b => b.bedId === info.bed_id);
      return !bookingsForBed.some(({ admission_at, discharge_at }) => {
        return (
          isBefore(getTime(fromDate), getTime(discharge_at)) &&
          isAfter(getTime(toDate), getTime(admission_at))
        );
      });
    });
  }, [bedInfo, beds, fromDate, toDate, setbedId]);

  const fromDateTimeChangeHandler = (admissionDataFromCalender: Date) => {
    setFromDate(admissionDataFromCalender);
    
    if (getTime(toDate) !== getTime(new Date(0))) {
      const validationError = validateDates(admissionDataFromCalender, toDate);
      setWarning(validationError);
    } else {
      setWarning("");
    }
  };

  const toDateTimeChangeHandler = (dischargeDataFromCalender: Date) => {
    setToDate(dischargeDataFromCalender);
    
    if (getTime(fromDate) !== getTime(new Date(0))) {
      const validationError = validateDates(fromDate, dischargeDataFromCalender);
      setWarning(validationError);
    } else {
      setWarning("");
    }
  };

  useEffect(() => {
    const fetchBedMetaData = () => {
      if (organization && organization.publicMetadata) {
        const bedMetaData: BedInfo[] =
          (organization.publicMetadata?.beds as BedInfo[]) || [];
        setBedInfo(bedMetaData);
      }
    };

    if (isLoaded && organization) {
      fetchBedMetaData();
    }
  }, [isLoaded, organization]);

  const isFormValid = () => {
    return (
      patientId.length > 0 &&
      bedId.length > 0 &&
      admissionFor.id.length > 0 &&
      getTime(fromDate) !== getTime(new Date(0)) &&
      getTime(toDate) !== getTime(new Date(0)) &&
      warning.length === 0
    );
  };

  return (
    <form className="flex flex-col h-[400px] overflow-y-scroll" onSubmit={admitHandler}>
      <CreatableSelect
        required
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          Option: (patient) => {
            return (
              <div
                {...patient.innerProps}
                className={`grid !text-primary cursor-pointer group relative grid-cols-7 gap-1 w-[calc(100%-16px)] rounded-r-full md:w-[calc(100%-24px)] py-1 px-4 md:py-2 ${
                  patient.isFocused ? "bg-background" : ""
                }`}
              >
                <span
                  className={`w-1 bg-blue-500 h-3/4 self-center rounded-r-full absolute left-0 ${
                    patient.isFocused ? "visible" : "invisible"
                  }`}
                ></span>

                <div className="col-span-3 h-auto flex flex-col justify-start items-start">
                  <p className="text-sm font-normal">{patient.data.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {patient.data.patient_id}
                  </p>
                </div>

                <div className="col-span-3 h-min py-[0px] sm:py-[5.5px] px-2 font-normal text-sm leading-6 w-full">
                  {patient.data.mobile}
                </div>

                <div className="col-span-1 flex justify-center items-center">
                  <ArrowUpRight height={15} width={15} />
                </div>
              </div>
            );
          },
        }}
        filterOption={(option, inputValue) => {
          const search = inputValue.toLowerCase();
          return (
            (option.data.label.toLowerCase().includes(search) ||
              option.data.patient_id.toLowerCase().includes(search) ||
              option.data.mobile.toLowerCase().includes(search)) &&
            option.data.inBed == false
          );
        }}
        onChange={(val) => {
          setPatientId(val?.patient_id || "");
        }}
        isClearable={true}
        isValidNewOption={() => false}
        allowCreateWhileLoading={false}
        options={fetchedSuggestions}
        noOptionsMessage={() => "Empty"}
        backspaceRemovesValue={false}
        placeholder="Admit patient using ID, name, or phone number..."
        className="max-w-2xl w-full mx-auto xl:pr-0"
        classNames={{
          control: (state) =>
            `!shadow-sm !transition-all !duration-900 !bg-slate-50 dark:!bg-sidebar !py-1.5 ${
              state.isFocused ? "!border-blue-500" : "!border-border"
            } 
              ${
                state.selectProps.menuIsOpen
                  ? "!border-2 !rounded-t-2xl !rounded-b-none"
                  : "!border-2 !rounded-full"
              }  
              `,
          placeholder: () => "!truncate !text-sm sm:!text-base !px-4",
          singleValue: () => "!text-primary !px-4",
          input: () => "!text-primary !px-4",
          menu: (state) =>
            `!bg-slate-50 dark:!bg-sidebar !border-border !overflow-hidden !shadow-md !mt-0 xl:!w-full ${
              state.selectProps.menuIsOpen
                ? "!border-t-0 !border-b-2 !border-x-2 !rounded-b-2xl !rounded-t-none"
                : "!border-2 !rounded-2xl"
            }`,
          menuList: () => "!py-1 md:!py-2",
        }}
      />
      <Availability beds={filteredBeds} bedPatients={bedPatients} />
      <div className=" py-1 md:grid md:grid-cols-3 sm:gap-4 md:px-8">
        <label
          htmlFor="admission_for"
          className="text-sm font-medium leading-6  flex items-center gap-1"
        >
          Appointed Doctor<p className="text-red-500">*</p>
        </label>
        <Select
          aria-hidden={false}
          required
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
            disableBefore={new Date()}
            date={fromDate}
            setDate={setFromDate}
            icon={<CalendarPlusIcon className="mr-2 h-4 w-4" />}
            onChange={fromDateTimeChangeHandler}
            required
          />
        </div>
        <div className="flex-1">
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
      {suggestedBeds.length > 0 && (
        <div className="md:px-8 mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Available Beds
          </h3>
          <div className="flex flex-wrap gap-3 overflow-x-auto pb-2 scroll-smooth h-[100px] overflow-y-scroll">
            {suggestedBeds.map((bed, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setbedId(bed.bed_id);
                }}
                className={`min-w-[120px] shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition hover:bg-blue-100 ${
                  bed.bed_id === bedId
                    ? "bg-blue-500 text-gray-700 border-blue-600"
                    : "bg-white text-gray-700 border-gray-300"
                }`}
              >
                <p className="truncate">{bed.bed_id}</p>
                <p className="text-xs text-muted-foreground">{bed.ward}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {warning.length > 0 && (
        <p className="text-center text-red-600 font-normal pb-4">{warning}</p>
      )}
      <Button type="submit" disabled={!isFormValid() || loader}>
        {loader ? <Spinner className="bg-primary" size={"lg"} /> : "Add Patient"}
      </Button>
    </form>
  );
};

export default BedAdmissionModal;
