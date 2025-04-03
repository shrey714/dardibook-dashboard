import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Sidebar2,
  SidebarContent2,
  SidebarFooter2,
  SidebarGroup2,
  SidebarGroupAction2,
  SidebarGroupContent2,
  SidebarGroupLabel2,
  SidebarHeader2,
  SidebarMenu2,
  SidebarMenuItem2,
  SidebarMenuSkeleton2,
  SidebarSeparator2,
} from "@/components/ui/sidebar2";
import { Inbox, RotateCcw } from "lucide-react";
import { addDays, formatRelative, getTime, startOfDay } from "date-fns";
import { enUS } from "date-fns/locale";
import { ScheduleList } from "./ScheduleList";
import { useAuth } from "@clerk/nextjs";
import { Reorder } from "framer-motion";
import { db } from "@/firebase/firebaseConfig";
import { query, collection, onSnapshot, where } from "firebase/firestore";
import { ScheduledPatientTypes } from "@/types/FormTypes";
import { Kbd } from "../ui/kbd";

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

export function ScheduleSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar2>) {
  const [date, setDate] = useState<Date>(addDays(new Date(), 1));
  const [scheduledPatients, setScheduledPatients] =
    useState<ScheduledPatientTypes[]>();
  const [loader, setLoader] = useState(false);
  const { isLoaded, orgId } = useAuth();

  useEffect(() => {
    let unsubscribe: () => void;
    const getTodayPatientQueue = () => {
      if (isLoaded && orgId && date) {
        const q = query(
          collection(db, "doctor", orgId, "patients"),
          where("registered_date", "array-contains", getTime(startOfDay(date)))
        );

        setLoader(true);
        unsubscribe = onSnapshot(q, async (snapshot) => {
          const patientData: ScheduledPatientTypes[] = [];
          snapshot.forEach((doc) => {
            const pData = doc.data() as ScheduledPatientTypes;
            patientData.push({
              patient_id: pData.patient_id,
              name: pData.name,
              mobile: pData.mobile,
              gender: pData.gender,
              registered_date: pData.registered_date,
              registered_date_time: pData.registered_date_time,
              registerd_by: pData.registerd_by,
              registerd_for: pData.registerd_for,
            });
          });
          setScheduledPatients(patientData);
          setLoader(false);
        });
      } else {
        setLoader(false);
      }
    };

    getTodayPatientQueue();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isLoaded, orgId, date]);

  return (
    <Sidebar2
      side="right"
      variant="floating"
      className="h-full absolute top-0"
      {...props}
    >
      <SidebarHeader2 className="p-0">
        <SidebarGroup2 className="group-data-[collapsible=icon]:hidden p-0">
          <SidebarGroupLabel2 className="justify-center">
            Scheduled Patients
          </SidebarGroupLabel2>
          <SidebarGroupContent2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (d) {
                  setDate(d);
                } else {
                  setDate(date);
                }
              }}
              className="py-0"
              disabled={{ before: addDays(new Date(), 1) }}
            />
          </SidebarGroupContent2>
        </SidebarGroup2>
      </SidebarHeader2>
      <SidebarContent2 className="overflow-x-hidden w-auto pt-0 flex-none">
        <SidebarGroup2 className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel2>
            {date && formatRelative(date, new Date(), { locale: customLocale })}
          </SidebarGroupLabel2>
          <SidebarGroupAction2
            title="Reset"
            onClick={() => {
              setDate(addDays(new Date(), 1));
            }}
          >
            <RotateCcw /> <span className="sr-only">Reset</span>
          </SidebarGroupAction2>
        </SidebarGroup2>
      </SidebarContent2>
      <SidebarSeparator2 />
      <SidebarContent2 className="overflow-x-hidden w-auto pt-0">
        <SidebarGroup2 className="group-data-[collapsible=icon]:hidden py-[4px]">
          <SidebarGroupContent2>
            {loader ? (
              <SidebarMenu2 className="py-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuItem2 key={index}>
                    <SidebarMenuSkeleton2 />
                  </SidebarMenuItem2>
                ))}
              </SidebarMenu2>
            ) : scheduledPatients?.length === 0 ? (
              <div className="text-sidebar-foreground/70 flex flex-1 items-center justify-center flex-col gap-1 min-h-28">
                <Inbox />
                Empty
              </div>
            ) : (
              <ul className="w-full">
                <Reorder.Group
                  values={scheduledPatients ?? []}
                  onReorder={setScheduledPatients}
                  draggable={false}
                >
                  <ScheduleList
                    scheduledPatients={scheduledPatients}
                    forDate={date}
                  />
                </Reorder.Group>
              </ul>
            )}
          </SidebarGroupContent2>
        </SidebarGroup2>
      </SidebarContent2>
      <SidebarFooter2>
        <Kbd variant="outline" className="self-start">
          <span className="text-xs">⌘</span>b
        </Kbd>
      </SidebarFooter2>
    </Sidebar2>
  );
}
