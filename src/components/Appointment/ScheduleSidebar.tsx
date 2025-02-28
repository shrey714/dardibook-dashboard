import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Sidebar2,
  SidebarContent2,
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
import {
  addDays,
  endOfDay,
  formatRelative,
  getTime,
  startOfDay,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { ScheduleList } from "./ScheduleList";
import { useAuth } from "@clerk/nextjs";
import { Reorder } from "framer-motion";
import { db } from "@/firebase/firebaseConfig";
import {
  query,
  collection,
  onSnapshot,
  DocumentData,
  where,
  orderBy,
} from "firebase/firestore";

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
  const [date, setDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [scheduledPatients, setScheduledPatients] = useState<any>([]);
  const [loader, setLoader] = useState(false);
  const { isLoaded, orgId } = useAuth();

  useEffect(() => {
    let unsubscribe: () => void;
    const getTodayPatientQueue = () => {
      if (isLoaded && orgId && date) {
        const q = query(
          collection(db, "doctor", orgId, "patients"),
          where("last_visited", ">=", getTime(startOfDay(date))),
          where("last_visited", "<=", getTime(endOfDay(date))),
          orderBy("last_visited", "desc")
        );

        setLoader(true);
        unsubscribe = onSnapshot(q, async (snapshot) => {
          const patientData: DocumentData[] = [];

          snapshot.forEach((doc) => {
            const pData = doc.data();
            const visitedDatesArray = pData?.visitedDates || [];
            const today = new Date().getDate();

            const attended = visitedDatesArray.some(
              (date: number) => new Date(date).getDate() === today
            );
            const old =
              visitedDatesArray.length > 1 ||
              (visitedDatesArray.length === 1 && !attended);

            patientData.push({ ...pData, attended, old });
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
            ) : scheduledPatients.length === 0 ? (
              <div className="text-sidebar-foreground/70 flex flex-1 items-center justify-center flex-col gap-1 min-h-28">
                <Inbox />
                Empty
              </div>
            ) : (
              <ul className="w-full">
                <Reorder.Group
                  values={scheduledPatients}
                  onReorder={setScheduledPatients}
                  draggable={false}
                >
                  <ScheduleList scheduledPatients={scheduledPatients} />
                </Reorder.Group>
              </ul>
            )}
          </SidebarGroupContent2>
        </SidebarGroup2>
      </SidebarContent2>
    </Sidebar2>
  );
}
