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
import { collection, onSnapshot, query } from "firebase/firestore";
import { Inbox, RotateCcw } from "lucide-react";
import { formatRelative } from "date-fns";
import { enUS } from "date-fns/locale";
import { ScheduleList } from "./ScheduleList";
import { useAuth } from "@clerk/nextjs";
import { db } from "@/firebase/firebaseConfig";
import { getTodayPatients } from "@/app/services/getTodayPatients";
import { Reorder } from "framer-motion";

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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [scheduledPatients, setScheduledPatients] = useState([]);
  const [loader, setLoader] = useState(false);
  const { isLoaded, orgId } = useAuth();

  useEffect(() => {
    let unsubscribe: () => void;

    const getTodayPatientQueue = () => {
      if (isLoaded && orgId) {
        const q = query(collection(db, "doctor", orgId, "patients"));

        setLoader(true);
        unsubscribe = onSnapshot(q, async () => {
          const patientQueueData = await getTodayPatients(orgId, date);
          if (patientQueueData.data) {
            setScheduledPatients(patientQueueData.data);
          } else {
            setScheduledPatients([]);
          }
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
            Schedule
          </SidebarGroupLabel2>
          <SidebarGroupContent2>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="py-0"
              disabled={{ before: new Date() }}
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
              setDate(new Date());
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
