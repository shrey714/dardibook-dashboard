import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Sidebar3,
  SidebarContent3,
  SidebarFooter3,
  SidebarGroup3,
  SidebarGroupAction3,
  SidebarGroupContent3,
  SidebarGroupLabel3,
  SidebarHeader3,
  SidebarMenu3,
  SidebarMenuItem3,
  SidebarMenuSkeleton3,
  SidebarSeparator3,
} from "@/components/ui/sidebar3";
import {
  query,
  collection,
  onSnapshot,
  where,
  doc,
  getDoc,
  or,
  and,
} from "firebase/firestore";
import { Inbox, RotateCcw } from "lucide-react";
import {
  eachDayOfInterval,
  endOfWeek,
  formatRelative,
  isWithinInterval,
  startOfMonth,
  startOfWeek,
  endOfDay,
  getTime,
  startOfDay,
} from "date-fns";
import { enUS } from "date-fns/locale";
import { useAuth } from "@clerk/nextjs";
import { db } from "@/firebase/firebaseConfig";
import { Reorder } from "framer-motion";
import {
  Week,
  WeekProps,
  NextMonthButton,
  PreviousMonthButton,
} from "react-day-picker";
import { BedPatientList } from "./BedPatientList";
// import { useBedsStore } from "@/lib/stores/useBedsStore";
import { BedPatientTypes, OrgBed } from "@/types/FormTypes";
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

export function BedSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar3>) {
  const [date, setDate] = useState<Date>(new Date());
  const [bedsForDate, setBedForDate] = useState<OrgBed[]>([]);
  const [patientsForDate, setPatientsForDate] = useState<
    Record<string, BedPatientTypes>
  >({});
  // const { beds, bedPatients, loading } = useBedsStore((state) => state);
  // =================================================================
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentWeek, setCurrentWeek] = useState<Array<Date>>([]);

  const getCurrentWeek = () => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 0 });
    const end = endOfWeek(today, { weekStartsOn: 0 });
    setCurrentWeek(eachDayOfInterval({ start: start, end: end }));
  };

  const getNextWeek = () => {
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    const nextWeekStart = startOfWeek(new Date(end.getTime() + 1), {
      weekStartsOn: 0,
    });
    const nextWeekEnd = endOfWeek(new Date(end.getTime() + 7), {
      weekStartsOn: 0,
    });
    setCurrentWeek(
      eachDayOfInterval({ start: nextWeekStart, end: nextWeekEnd })
    );
    setCurrentDate(new Date(end.getTime() + 1));
  };

  const getPreviousWeek = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const previousWeekStart = startOfWeek(new Date(start.getTime() - 1), {
      weekStartsOn: 0,
    });
    const previousWeekEnd = endOfWeek(new Date(start.getTime() - 7), {
      weekStartsOn: 0,
    });
    setCurrentWeek(
      eachDayOfInterval({ start: previousWeekStart, end: previousWeekEnd })
    );
    setCurrentDate(new Date(start.getTime() - 1));
  };

  useEffect(() => {
    getCurrentWeek();
  }, []);

  function CurrentWeekRow(props: WeekProps) {
    const isDateInCurrentWeek = (dateToCheck: Date) => {
      const today = currentDate;
      const start = startOfWeek(today);
      const end = endOfWeek(today);
      return isWithinInterval(dateToCheck, { start, end });
    };
    const isNotCurrentWeek = props.week.days.every(
      (date) => !isDateInCurrentWeek(date.date)
    );
    if (isNotCurrentWeek) return <></>;
    return <Week {...props} />;
  }
  // =================================================================
  const [loader, setLoader] = useState(false);
  const { isLoaded, orgId } = useAuth();

  useEffect(() => {
    let unsubscribe: () => void;
    const getTodayPatientQueue = () => {
      if (isLoaded && orgId && date) {
        const bedsQuery = query(
          collection(db, "doctor", orgId, "beds"),
          or(
            and(
              where("admission_at", "<=", getTime(startOfDay(date))),
              where("discharge_at", ">=", getTime(endOfDay(date)))
            ),
            and(
              where("admission_at", ">=", getTime(startOfDay(date))),
              where("admission_at", "<=", getTime(endOfDay(date)))
            ),
            and(
              where("discharge_at", "<=", getTime(endOfDay(date))),
              where("discharge_at", ">=", getTime(startOfDay(date)))
            )
          )
        );

        setLoader(true);
        unsubscribe = onSnapshot(bedsQuery, async (snapshot) => {
          const bedsData: OrgBed[] = [];
          const patientIds = new Set<string>();

          snapshot.forEach((doc) => {
            const bed = doc.data() as OrgBed;
            bedsData.push(bed);
            patientIds.add(bed.patient_id);
          });

          if (Array.from(patientIds).length > 0) {
            const patientsData: Record<string, BedPatientTypes> = {};

            await Promise.all(
              Array.from(patientIds).map(async (patientId) => {
                const patientRef = doc(
                  db,
                  "doctor",
                  orgId,
                  "patients",
                  patientId
                );
                const patientSnap = await getDoc(patientRef);

                if (patientSnap.exists()) {
                  const { patient_id, name, mobile, gender, age, bed_info } =
                    patientSnap.data();
                  patientsData[patientId] = {
                    patient_id,
                    name,
                    mobile,
                    gender,
                    age,
                    bed_info,
                  };
                }
              })
            );

            setPatientsForDate(patientsData);
          }

          setBedForDate(bedsData);
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
  // ================================================================
  return (
    <Sidebar3
      side="right"
      variant="floating"
      className="h-full absolute top-0"
      {...props}
    >
      <SidebarHeader3 className="p-0">
        <SidebarGroup3 className="group-data-[collapsible=icon]:hidden p-0">
          <SidebarGroupLabel3 className="justify-center">
            Bed Management
          </SidebarGroupLabel3>
          <SidebarGroupContent3>
            <Calendar
              month={startOfMonth(currentDate)}
              classNames={{
                hidden: "none",
              }}
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
              disabled={{
                before: currentWeek[0],
                after: currentWeek[currentWeek.length - 1],
              }}
              components={{
                Week: CurrentWeekRow,
                NextMonthButton: (props) => (
                  <NextMonthButton {...props} onClick={getNextWeek} />
                ),
                PreviousMonthButton: (props) => (
                  <PreviousMonthButton {...props} onClick={getPreviousWeek} />
                ),
                Chevron: (props) => {
                  if (props.orientation === "left") {
                    return <ChevronLeft className="h-4 w-4" {...props} />;
                  }
                  return <ChevronRight className="h-4 w-4" {...props} />;
                },
              }}
            />
          </SidebarGroupContent3>
        </SidebarGroup3>
      </SidebarHeader3>
      <SidebarContent3 className="overflow-x-hidden w-auto pt-0 flex-none">
        <SidebarGroup3 className="group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel3>
            {date && formatRelative(date, new Date(), { locale: customLocale })}
          </SidebarGroupLabel3>
          <SidebarGroupAction3
            title="Reset"
            onClick={() => {
              setDate(new Date());
              setCurrentDate(new Date());
              getCurrentWeek();
            }}
          >
            <RotateCcw /> <span className="sr-only">Reset</span>
          </SidebarGroupAction3>
        </SidebarGroup3>
      </SidebarContent3>
      <SidebarSeparator3 />
      <SidebarContent3 className="overflow-x-hidden w-auto pt-0">
        <SidebarGroup3 className="group-data-[collapsible=icon]:hidden py-[4px]">
          <SidebarGroupContent3>
            {loader ? (
              <SidebarMenu3 className="py-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <SidebarMenuItem3 key={index}>
                    <SidebarMenuSkeleton3 />
                  </SidebarMenuItem3>
                ))}
              </SidebarMenu3>
            ) : bedsForDate.length === 0 ? (
              <div className="text-sidebar-foreground/70 flex flex-1 items-center justify-center flex-col gap-1 min-h-28">
                <Inbox />
                Empty
              </div>
            ) : (
              <ul className="w-full">
                <Reorder.Group
                  values={bedsForDate}
                  onReorder={() => {}}
                  draggable={false}
                >
                  <BedPatientList
                    patientsForDate={patientsForDate}
                    bedsForDate={bedsForDate}
                    forDate={date}
                  />
                </Reorder.Group>
              </ul>
            )}
          </SidebarGroupContent3>
        </SidebarGroup3>
      </SidebarContent3>
      <SidebarFooter3>
        <Kbd variant="outline" className="self-start">
          <span className="text-xs">⌘</span>b
        </Kbd>
      </SidebarFooter3>
    </Sidebar3>
  );
}