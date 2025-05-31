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
} from "date-fns";
import DataCalendar from "@/components/Calendar/DataCalendar";
import { query, collection, where, and, or, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { DatesSetArg } from "@fullcalendar/core/index.js";
import {
  CalendarEventTypes,
  OrgBed,
  RegisterPatientFormTypes,
} from "@/types/FormTypes";

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

export default function TaskPage() {
  const { isLoaded, orgId } = useAuth();
  const [loader, setLoader] = useState(false);
  const [monthDate, setMonthDate] = useState<Date>();
  const [calendarData, setCalendarData] = useState<CalendarEventTypes[]>([]);

  useEffect(() => {
    const getBillsGenerated = async () => {
      if (isLoaded && orgId && monthDate) {
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

          // Collect beds
          bedsSnap.forEach((doc) => {
            const bed = doc.data() as OrgBed;
            calendarEvents.push({
              patient_id: bed.patient_id,
              event_type: "bed",
              bed_details: {
                bedId: bed.bedId,
                admission_at: bed.admission_at,
                discharge_at: bed.discharge_at,
                dischargeMarked: bed.dischargeMarked,
              },
            });
          });

          // Collect all patients
          patientsSnaps.forEach((snap) => {
            snap.forEach((doc) => {
              const patient = doc.data() as RegisterPatientFormTypes;

              patient.registered_date_time.forEach((r_date_time) => {
                if (isSameMonth(r_date_time, monthDate)) {
                  calendarEvents.push({
                    patient_id: patient.patient_id,
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
      setMonthDate(newDate);
    }
  };

  return (
    <>
      <div className="w-full py-2 px-2 h-full">
        {loader && (
          <div className="h-full w-full bg-background/80 absolute z-[2]"></div>
        )}

        <DataCalendar
          calendarData={calendarData}
          handleDatesSet={handleDatesSet}
        />
      </div>
    </>
  );
}
