import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CalendarIcon } from "lucide-react";
import { UserReOrderMenu } from "./UserReOrderMenu";
import { Reorder } from "framer-motion";
import { format, formatRelative } from "date-fns";
import Link from "next/link";
import { enUS } from "date-fns/locale";
import UserSchedulebtn from "./UserSchedulebtn";
const customLocale = {
  ...enUS,
  formatRelative: (token: string) => {
    const formatWithoutTime: Record<string, string> = {
      lastWeek: "'last' eeee",
      yesterday: "'yesterday'",
      today: "'today'",
      tomorrow: "'tomorrow'",
      nextWeek: "eeee",
      other: "MMMM dd, yyyy",
    };
    return formatWithoutTime[token];
  },
};

export function ScheduleList({ scheduledPatients }: any) {
  const base = 4;
  const t = (d: number) => d * base;
  return (
    <table className="w-full">
      <tbody className="rounded-lg">
        {[...scheduledPatients].map((patient: any, index: number) => {
          return (
            <Reorder.Item
              drag={false}
              as="tr"
              key={patient.patient_unique_Id}
              value={patient.patient_unique_Id}
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
                  <HoverCardTrigger>
                    <div className={`flex flex-1 w-full items-center justify-between flex-row my-1 h-8`}>
                      <div className={`rounded-s-full flex items-center px-3 py-1 rounded-l-full h-full ${patient.attended ? "bg-green-600" : "bg-border"}`}>
                        {scheduledPatients.length - index}
                        <p className="text-xs ml-2">
                          ({format(new Date(patient.last_visited), "hh:mm a")})
                        </p>
                      </div>

                      <Link
                        href={{
                          pathname: "history/patientHistory",
                          query: {
                            patientId: patient.patient_unique_Id,
                          },
                        }}
                        className={`py-1 rounded-r-full flex flex-1 text-xs h-full items-center ${patient.attended ? "bg-green-600" : "bg-border"}`}
                      >
                        <p className={`underline px-4 text-sm`}>
                          {patient.patient_unique_Id}
                        </p>
                      </Link>

                      <span className="flex flex-row gap-1 items-center ml-1">
                        <UserReOrderMenu
                          item={patient}
                          disabled={patient.attended}
                        />
                        <UserSchedulebtn patient={patient} />
                      </span>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent
                    className="w-auto bg-muted"
                    side="left"
                    sideOffset={20}
                  >
                    <div className="flex justify-between space-x-4">
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold">
                          Id : {patient.patient_unique_Id}
                        </h4>
                        <h4 className="text-sm font-semibold">
                          Name : {patient.first_name} {patient.last_name}
                        </h4>
                        <h4 className="text-sm font-semibold">
                          Contact : {patient.mobile_number}
                        </h4>
                        <h4
                          className={`text-sm font-semibold ${
                            patient.attended ? "text-green-600" : ""
                          }`}
                        >
                          Status :{" "}
                          {patient.attended
                            ? "Attended"
                            : patient.old
                            ? "Old"
                            : "New"}
                        </h4>
                        <div className="flex items-center pt-2">
                          <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                          <span className="text-xs text-muted-foreground">
                            {patient.last_visited &&
                              formatRelative(patient.last_visited, new Date(), {
                                locale: customLocale,
                              })}
                          </span>
                        </div>
                      </div>
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
}
