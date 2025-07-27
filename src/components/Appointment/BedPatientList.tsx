import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  CalendarMinusIcon,
  CalendarPlusIcon,
  ClipboardPlusIcon,
  ClipboardX,
  LogOut,
  PencilLineIcon,
  PhoneIcon,
} from "lucide-react";
import { Reorder } from "framer-motion";
import { format, startOfDay } from "date-fns";
import { BedSingle } from "lucide-react";
import { usePatientHistoryModalStore } from "@/lib/stores/patientHistoryModalStore";
import { BedPatientTypes, OrgBed } from "@/types/FormTypes";
import { BedManagementMenu } from "@/components/Appointment/BedManagementMenu";

interface bedPatientProps {
  patientsForDate: Record<string, BedPatientTypes>;
  bedsForDate: OrgBed[];
  forDate: Date;
}

export const BedPatientList: React.FC<bedPatientProps> = ({
  patientsForDate,
  bedsForDate,
  forDate,
}) => {
  const { openModal } = usePatientHistoryModalStore();
  const base = 4;
  const t = (d: number) => d * base;
  return (
    <table className="w-full">
      <tbody className="rounded-lg">
        {[...bedsForDate].map((bed, index) => {
          const matchingPatient = patientsForDate[bed.patient_id];
          return (
            <Reorder.Item
              drag={false}
              as="tr"
              key={index}
              value={bed.patient_id}
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  type: "spring",
                  bounce: 0.3,
                  opacity: { delay: t(0.025) },
                },
              }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: t(0.15),
                type: "spring",
                bounce: 0,
                opacity: { duration: t(0.03) },
              }}
              className="relative m-0 overflow-hidden"
            >
              <td className="text-center flex font-medium text-sm sm:text-base relative">
                <HoverCard openDelay={80} closeDelay={80}>
                  <div
                    className={`flex flex-1 w-full items-center flex-row my-1 gap-x-2`}
                  >
                    <HoverCardTrigger className="flex w-full flex-1 flex-row rounded-md bg-border h-12 overflow-hidden">
                      {startOfDay(bed.admission_at).toDateString() ===
                      startOfDay(forDate).toDateString() ? (
                        <div className="bg-green-400 w-[4px] h-full"></div>
                      ) : (
                        <div className="bg-yellow-500/90 w-[4px] h-full"></div>
                      )}

                      <div className="relative flex flex-1 items-center gap-2 p-2">
                        <span
                          className={`text-base flex flex-row gap-2 items-center bg-background justify-center font-bold rounded-md px-2 py-1 ${
                            bed.dischargeMarked ? "text-red-600" : ""
                          }`}
                        >
                          {bed.dischargeMarked ? (
                            <ClipboardX className="w-5 h-5" />
                          ) : (
                            <BedSingle className="w-5 h-5" />
                          )}
                          {bed.bedId}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            openModal({ patientId: bed.patient_id })
                          }
                          className="h-full pr-1 cursor-pointer text-start gap-0.5"
                        >
                          <p className="text-xs underline text-muted-foreground line-clamp-1 max-w-20 truncate">
                            {bed.patient_id}
                          </p>
                          <p className="text-sm leading-none max-w-20 truncate">
                            {matchingPatient.name}
                          </p>
                        </button>
                      </div>

                      {startOfDay(bed.discharge_at).toDateString() ===
                      startOfDay(forDate).toDateString() ? (
                        <div className="bg-red-500 w-[4px] h-full"></div>
                      ) : (
                        <div className="bg-yellow-500/90 w-[4px] h-full"></div>
                      )}
                    </HoverCardTrigger>
                    <BedManagementMenu
                      patient={matchingPatient}
                      bed={bed}
                      disabled={bed.dischargeMarked}
                    />
                  </div>

                  <HoverCardContent
                    className="w-auto bg-muted p-2"
                    side="left"
                    sideOffset={20}
                  >
                    <div className="flex flex-row gap-x-4">
                      <div className="flex flex-col items-start space-y-1">
                        <h4 className="text-sm font-semibold">
                          Id : {bed.patient_id}
                        </h4>
                        <h4 className="text-sm font-semibold">
                          Name : {matchingPatient.name}
                        </h4>
                        <h4 className="text-sm font-semibold">
                          Gender : {matchingPatient.gender}
                        </h4>
                        <h4 className="text-sm font-semibold">
                          Age : {matchingPatient.age}
                        </h4>
                        <p className="flex text-sm items-center gap-2">
                          <PhoneIcon size={16} />{" "}
                          {matchingPatient.mobile}
                        </p>
                      </div>
                      <div className="flex flex-col items-start space-y-1">
                        <p className="flex bg-blue-600/10 text-blue-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-t-sm">
                          <PencilLineIcon size={16} /> {bed.admission_by.name}
                        </p>
                        <p className="!mt-0 flex bg-green-500/10 text-green-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-b-sm">
                          <ClipboardPlusIcon size={16} />{" "}
                          {bed.admission_for.name}
                        </p>
                        <p className="flex bg-green-500/10 text-green-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-t-sm">
                          <CalendarPlusIcon size={16} />{" "}
                          {bed.admission_at &&
                            format(bed.admission_at, "dd-MM-yyyy hh:mm aa")}
                        </p>
                        <p className="!mt-0 bg-red-500/10 text-red-600 flex text-sm items-center gap-2 px-2 py-1 w-full rounded-b-sm">
                          <CalendarMinusIcon size={16} />{" "}
                          {bed.discharge_at &&
                            format(bed.discharge_at, "dd-MM-yyyy hh:mm aa")}
                        </p>
                      </div>
                    </div>
                    {bed.dischargeMarked ? (
                      <div className="bg-red-500/10 mt-2 w-full rounded-md text-red-600 flex flex-row gap-4 px-3 py-1 items-center">
                        <LogOut className="w-5 h-5" /> Discharged by{" "}
                        {bed?.discharged_by?.name}
                      </div>
                    ) : (
                      <></>
                    )}
                  </HoverCardContent>
                </HoverCard>
              </td>
            </Reorder.Item>
          );
        })}
      </tbody>
    </table>
  );
};
