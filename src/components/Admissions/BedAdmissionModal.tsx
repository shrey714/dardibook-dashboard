import React, { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";
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
} from "../ui/select";
import { useAuth, useOrganization, useUser } from "@clerk/nextjs";
import { OrgBed } from "@/types/FormTypes";
import { DateTimePicker } from "../Appointment/DateTimePicker";
import toast from "react-hot-toast";
import { getTime } from "date-fns";
import uniqid from "uniqid";


interface BedAdmissionModalProps {
  bedId: string;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface SuggestionType {
  label: string;
    value: string;
    patient_id: string;
    mobile: string;
    inBed: boolean;
}

const BedAdmissionModal: React.FC<BedAdmissionModalProps> = ({ bedId,setIsModalOpen }) => {
    const { orgId } = useAuth();
    const {user} = useUser();
  const { todayPatients, loading } = useTodayPatientStore((state) => state);
  const [suggestions, setsuggestions] = useState<SuggestionType[]>([]);
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [patientId,setPatientId] = useState<string>("");
  const [toDate, setToDate] = useState<Date>(new Date());

  const { memberships } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
      role: ["org:doctor", "org:clinic_head"],
    },
  });

  const [admissionInfo, setadmissionInfo] = useState<OrgBed | undefined>();
  const [loader, setloader] = useState(false)

  useEffect(() => {
    console.log("todayPatients = ", todayPatients);
    const fetchedSuggestions = todayPatients.map(
      (
        todayPatient
      ): SuggestionType => ({
        label: todayPatient.name,
        value: todayPatient.patient_id,
        patient_id: todayPatient.patient_id,
        mobile: todayPatient.mobile,
        inBed: todayPatient.inBed
      })
    );
    setsuggestions(fetchedSuggestions);
  }, [loading,todayPatients]);

  const admitHandler = async()=>{
    if (!orgId || !bedId || !user) return;
    setloader(true);
    console.log(orgId,bedId,user)

    try {
      const bedBookingId = uniqid.time();
      const batch = writeBatch(db);
      const bedRef = doc(db,"doctor",orgId,"beds",bedBookingId);
      batch.set(bedRef, {
        ...admissionInfo,
        patient_id:patientId,
        bedBookingId: bedBookingId,
        bedId:bedId,
        admission_at:getTime(fromDate),
        discharge_at:getTime(toDate),
        dischargeMarked:false,
        admission_by: {
            id: user.id,
            name: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
        },
      }, { merge: true });
      const patientRef = doc(db,"doctor",orgId,"patients",patientId);
      batch.set(patientRef, {
        bed_info:arrayUnion({
          ...admissionInfo,
        bedBookingId: bedBookingId,
        bedId:bedId,
        admission_at:getTime(fromDate),
        discharge_at:getTime(toDate),
        dischargeMarked:false,
        admission_by: {
            id: user.id,
            name: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
        }
        }
      )
      }, { merge: true });
      await batch.commit()
      
    } catch (error) {
      console.log(error)
      toast.error("Error updating");
    }
    finally{
      setloader(false)
      setIsModalOpen(false)
    }
  }

  return (
    <div className="flex flex-col">
      {bedId}
      <CreatableSelect
        components={{
          DropdownIndicator: () => null,
          IndicatorSeparator: () => null,
          Option: (patient:any) => {
            console.log(patient);
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
        filterOption={(option:any, inputValue) => {
          const search = inputValue.toLowerCase();
          return (
            (option.data.label.toLowerCase().includes(search) ||
            option.data.patient_id.toLowerCase().includes(search) ||
            option.data.mobile.toLowerCase().includes(search)) && option.data.inBed==false
          );
        }}
        onChange={(val) => {
          setPatientId(val?.patient_id || "");
        }}
        isClearable={true}
        isValidNewOption={() => false}
        allowCreateWhileLoading={false}
        options={suggestions}
        noOptionsMessage={() => "Empty"}
        backspaceRemovesValue={false}
        placeholder="Admit patient using ID, name, or phone number..."
        className="max-w-2xl w-full mx-auto pr-9 xl:pr-0"
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
            `!bg-slate-50 dark:!bg-sidebar !border-border !overflow-hidden !shadow-md !mt-0 !w-[calc(100%-2.25rem)] xl:!w-full ${
              state.selectProps.menuIsOpen
                ? "!border-t-0 !border-b-2 !border-x-2 !rounded-b-2xl !rounded-t-none"
                : "!border-2 !rounded-2xl"
            }`,
          menuList: () => "!py-1 md:!py-2",
        }}
      />
      <div className="px-4 py-1 md:py-6 md:grid md:grid-cols-3 sm:gap-4 md:px-8">
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
          onValueChange={(val) => {
            const member = memberships?.data?.find(
              (mem) => mem.publicUserData.userId === val
            );

            if (member) {
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

              setadmissionInfo((prev:any) => ({
                ...prev,
                admission_for: selectedMember,
              }));
            }
          }}
        >
          <SelectTrigger
            autoFocus={true}
            id="registerd_for"
            className="w-full md:max-w-md lg:col-span-2 disabled:text-primary shadow-sm rounded-md border-border bg-transparent form-input py-1 pl-2 sm:text-sm sm:leading-6"
          >
            <SelectValue placeholder="Doctor" />
          </SelectTrigger>
          <SelectContent>
            {memberships &&
              memberships.data?.map((member, index) =>
                member.publicUserData.userId ? (
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
      <DateTimePicker
        registered_date={[]}
        date={fromDate}
        setDate={setFromDate}
      />
      <DateTimePicker registered_date={[]} date={toDate} setDate={setToDate} />
      <Button onClick={admitHandler}> {loader?"loading":"Add Patient"} </Button>                    

    </div>
  );
};

export default BedAdmissionModal;
