"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Loader from "@/components/common/Loader";
import {
  getTime,
  startOfYear,
  endOfYear,
} from "date-fns";
import { getAllPatients } from "@/app/services/getAllPatients";
import { DateRange } from "react-day-picker";
import DataCalendar from "@/components/Calendar/DataCalendar";

interface PatientData {
  id: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  age: string;
  gender: string;
  appointed: boolean;
  last_visited: number;
  visitedDates: number[]; //array of timestamps in milliseconds
}

export default function TaskPage() {
  const { isLoaded, orgId } = useAuth();
  const [loader, setLoader] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [dateRange] = useState<DateRange | undefined>({
    from: startOfYear(new Date(1717353000000)),
    to: endOfYear(new Date()),
  });

  useEffect(() => {
    const fetchPatients = async () => {
      if (isLoaded && orgId) {
        try {
          setLoader(true);
          const data = await getAllPatients(
            orgId,
            getTime(dateRange?.from || 0),
            getTime(dateRange?.to || 0)
          );
          if (data.data) {
            setPatients(data.data);
          } else {
            setError("Error fetching patients");
          }
          setLoader(false);
        } catch (error) {
          setError(`Error fetching patients : ${error}`);
          setLoader(false);
        }
      }
    };

    fetchPatients();
  }, [orgId, isLoaded, dateRange]);

  return (
    <>
      {loader ? (
        <div className="w-full h-full overflow-hidden flex items-center justify-center">
          <Loader size="medium" />
        </div>
      ) : error ? (
        <div className="w-full h-full overflow-hidden flex items-center justify-center">
          {error}
        </div>
      ) : (
        <div className="w-full py-2 px-2 h-full">
          <DataCalendar data={patients} />
        </div>
      )}
    </>
  );
}
