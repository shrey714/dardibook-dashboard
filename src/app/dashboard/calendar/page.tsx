"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  getTime,
  startOfMonth,
  endOfMonth,
  isSameMonth,
  addDays,
  isSameDay,
  format,
} from "date-fns";
import DataCalendar from "@/components/Calendar/DataCalendar";
import {
  query,
  collection,
  where,
  and,
  or,
  doc as dbDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firebaseConfig";
import { DatesSetArg } from "@fullcalendar/core/index.js";
import {
  CalendarEventTypes,
  OrgBed,
  RegisterPatientFormTypes,
} from "@/types/FormTypes";
import { SidebarInset, SidebarProvider } from "@/components/ui/calendarSidebar";
import { CalendarSidebarContent } from "@/components/Calendar/CalendarSidebarContent";

function getAllStartOfDaysInMonth(date: Date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  const days: number[] = [];
  let current = start;

  while (current <= end) {
    days.push(getTime(current));
    current = addDays(current, 1);
  }

  return days;
}

// Helper to chunk an array into pieces of chunkSize
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

const memoryCache = new Map<
  string,
  { data: CalendarEventTypes[]; timestamp: number }
>();
const CACHE_DURATION_MS = 3 * 60 * 1000; // 3 min

export default function TaskPage() {
  const { isLoaded, orgId } = useAuth();
  const [loader, setLoader] = useState(false);
  const [monthDate, setMonthDate] = useState<Date>();
  const [calendarData, setCalendarData] = useState<CalendarEventTypes[]>([]);

  useEffect(() => {
    const getBillsGenerated = async () => {
      if (isLoaded && orgId && monthDate) {
        const cacheKey = `calendarData_${orgId}_${format(
          monthDate,
          "yyyy-MM"
        )}`;
        const now = Date.now();

        // 1. Check memory cache
        const memoryEntry = memoryCache.get(cacheKey);
        if (memoryEntry && now - memoryEntry.timestamp < CACHE_DURATION_MS) {
          setCalendarData(memoryEntry.data);
          return;
        }

        // 2. Check localStorage cache
        const localEntry = localStorage.getItem(cacheKey);
        if (localEntry) {
          try {
            const parsed = JSON.parse(localEntry) as {
              data: CalendarEventTypes[];
              timestamp: number;
            };
            if (now - parsed.timestamp < CACHE_DURATION_MS) {
              memoryCache.set(cacheKey, parsed); // hydrate memory
              setCalendarData(parsed.data);
              return;
            } else {
              localStorage.removeItem(cacheKey); // expired
            }
          } catch (err) {
            console.warn("Invalid cache format", err);
          }
        }

        try {
          setLoader(true);

          // Beds Query (same as yours)
          const bedsQuery = query(
            collection(db, "doctor", orgId, "beds"),
            or(
              and(
                where("admission_at", ">=", getTime(startOfMonth(monthDate))),
                where("admission_at", "<=", getTime(endOfMonth(monthDate)))
              ),
              and(
                where("discharge_at", ">=", getTime(startOfMonth(monthDate))),
                where("discharge_at", "<=", getTime(endOfMonth(monthDate)))
              )
            )
          );

          // Prepare Patients Queries
          const allStartOfDays = getAllStartOfDaysInMonth(monthDate);
          const dayChunks = chunkArray(allStartOfDays, 30);

          const patientQueryPromises = dayChunks.map((chunk) => {
            const patientsQuery = query(
              collection(db, "doctor", orgId, "patients"),
              where("registered_date", "array-contains-any", chunk)
            );
            return getDocs(patientsQuery);
          });

          // Fetch beds and patients in parallel
          const [bedsSnap, ...patientsSnaps] = await Promise.all([
            getDocs(bedsQuery),
            ...patientQueryPromises,
          ]);

          const calendarEvents: CalendarEventTypes[] = [];

          const patientMap = new Map<string, RegisterPatientFormTypes>();

          patientsSnaps.forEach((snap) => {
            snap.forEach((doc) => {
              const patient = doc.data() as RegisterPatientFormTypes;
              patientMap.set(patient.patient_id, patient); // cache by patient_id
            });
          });
          // Collect beds
          for (const doc of bedsSnap.docs) {
            const bed = doc.data() as OrgBed;

            // Try to get patient name from cache
            let patientName: string | undefined = patientMap.get(
              bed.patient_id
            )?.name;

            // If not found, fetch from Firestore
            if (!patientName) {
              try {
                const patientDoc = await getDoc(
                  dbDoc(db, "doctor", orgId, "patients", bed.patient_id)
                );
                if (patientDoc.exists()) {
                  const patientData =
                    patientDoc.data() as RegisterPatientFormTypes;
                  patientName = patientData.name;
                  console.log("patientName==", patientName);
                  patientMap.set(patientData.patient_id, patientData); // cache it
                }
              } catch (err) {
                console.error(
                  "Failed to fetch patient for bed",
                  bed.patient_id,
                  err
                );
              }
            }

            calendarEvents.push({
              patient_id: bed.patient_id,
              patient_name: patientName,
              event_type: "bed",
              bed_details: {
                admission_by: bed.admission_by.name,
                admission_for: bed.admission_for.name,
                bedId: bed.bedId,
                admission_at: bed.admission_at,
                discharge_at: bed.discharge_at,
                dischargeMarked: bed.dischargeMarked,
                discharged_by: bed.discharged_by?.name,
              },
            });
          }

          // Collect all patients
          patientsSnaps.forEach((snap) => {
            snap.forEach((doc) => {
              const patient = doc.data() as RegisterPatientFormTypes;

              patient.registered_date_time.forEach((r_date_time) => {
                if (isSameMonth(r_date_time, monthDate)) {
                  calendarEvents.push({
                    patient_id: patient.patient_id,
                    patient_name: patient.name,
                    event_type: "appointment",
                    appointment_details: {
                      registered_at: r_date_time,
                      prescribed: patient.prescribed_date_time.some(
                        (p_date_time) => isSameDay(p_date_time, r_date_time)
                      ),
                      prescribed_at: patient.prescribed_date_time.find(
                        (p_date_time) => isSameDay(p_date_time, r_date_time)
                      ),
                    },
                  });
                }
              });
            });
          });

          // Set final calendar data
          setCalendarData(calendarEvents);

          const cacheEntry = { data: calendarEvents, timestamp: now };
          memoryCache.set(cacheKey, cacheEntry);
          localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));

          setLoader(false);
        } catch (error) {
          console.log(error);
          setLoader(false);
        }
      }
    };

    getBillsGenerated();
  }, [isLoaded, monthDate, orgId]);

  const handleDatesSet = (arg: DatesSetArg) => {
    const newDate = arg.view.calendar.getDate();
    if (!monthDate || !isSameMonth(monthDate, newDate)) {
      setMonthDate(startOfMonth(newDate));
    }
  };

  return (
    <div className="h-full w-full overflow-hidden relative">
      {loader && (
        <div className="h-full w-full bg-background/80 absolute z-[2]"></div>
      )}
      <SidebarProvider defaultOpen={true} className="flex min-h-0 h-full">
        <SidebarInset className="min-h-0 w-full">
          <div className="w-full p-0 pt-1 sm:p-1 h-full space-y-1 relative">
            <DataCalendar
              calendarData={calendarData}
              handleDatesSet={handleDatesSet}
            />
          </div>
        </SidebarInset>
        <CalendarSidebarContent
          loader={loader}
          calendarData={calendarData}
          monthDate={monthDate ?? new Date()}
        />
      </SidebarProvider>
    </div>
  );
}
