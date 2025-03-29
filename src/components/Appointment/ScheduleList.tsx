import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { BriefcaseMedicalIcon, PencilLineIcon } from "lucide-react";
import { UserReOrderMenu } from "./UserReOrderMenu";
import { Reorder } from "framer-motion";
import { format } from "date-fns";
import Link from "next/link";
import UserSchedulebtn from "./UserSchedulebtn";
import { usePatientHistoryModalStore } from "@/lib/stores/patientHistoryModalStore";
import { ScheduledPatientTypes } from "@/types/FormTypes";

interface ScheduleListProps {
  scheduledPatients?: ScheduledPatientTypes[];
  forDate: Date;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({
  scheduledPatients,
  forDate,
}) => {
  const { openModal } = usePatientHistoryModalStore();
  const base = 4;
  const t = (d: number) => d * base;
  return (
    <table className="w-full">
      <tbody className="rounded-lg">
        {(scheduledPatients ?? []).map((patient, index) => {
          const matchingTimestamp = patient.registered_date_time.find(
            (timestamp) => {
              return (
                new Date(timestamp).toDateString() === forDate?.toDateString()
              );
            }
          );
          return (
            <Reorder.Item
              drag={false}
              as="tr"
              key={patient.patient_id}
              value={patient.patient_id}
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
              <td className="text-center font-medium text-sm sm:text-base relative">
                <HoverCard openDelay={80} closeDelay={80}>
                  <div className={`flex flex-1 w-full flex-row my-1 h-8`}>
                    <HoverCardTrigger className="flex flex-1 flex-row items-center justify-center">
                      <div
                        className={`rounded-s-full flex items-center px-3 py-1 rounded-l-full h-full bg-border
                        }`}
                      >
                        {index + 1}
                        <p className="text-xs ml-2">
                          (
                          {matchingTimestamp
                            ? format(new Date(matchingTimestamp), "hh:mm a")
                            : "---"}
                          )
                        </p>
                      </div>

                      <Link
                        href={"#"}
                        role="button"
                        onClick={() =>
                          openModal({
                            patientId: patient.patient_id,
                          })
                        }
                        className={`py-1 rounded-r-full flex flex-1 text-xs h-full items-center ${
                          false ? "bg-green-600" : "bg-border"
                        }`}
                      >
                        <p className={`underline px-4 text-sm`}>
                          {patient.patient_id}
                        </p>
                      </Link>
                    </HoverCardTrigger>
                    <span className="flex flex-row gap-1 items-center ml-1">
                      <UserReOrderMenu
                        patient={patient}
                        matchingDate={forDate}
                      />
                      <UserSchedulebtn
                        patient={patient}
                        matchingDate={forDate}
                      />
                    </span>
                  </div>
                  <HoverCardContent
                    className="w-auto bg-muted"
                    side="left"
                    sideOffset={20}
                  >
                    <div className="flex flex-col items-start space-y-1">
                      <h4 className="text-sm font-semibold">
                        Id : {patient.patient_id}
                      </h4>
                      <h4 className="text-sm font-semibold">
                        Name : {patient.name}
                      </h4>
                      <h4 className="text-sm font-semibold">
                        Contact : {patient.mobile}
                      </h4>
                      <h4 className="text-sm font-semibold">
                        Gender : {patient.gender}
                      </h4>

                      <p className="flex text-sm items-center gap-2">
                        <PencilLineIcon size={16} className="text-blue-500" />{" "}
                        {patient.registerd_by.name}
                      </p>
                      <p className="flex text-sm items-center gap-2">
                        <BriefcaseMedicalIcon
                          size={16}
                          className="text-green-500"
                        />{" "}
                        {patient.registerd_for.name}
                      </p>
                    </div>
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
