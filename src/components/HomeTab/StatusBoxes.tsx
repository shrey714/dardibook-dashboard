"use client";
import { Check, Pencil, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { getTime, startOfMonth, endOfMonth } from "date-fns";
import { useAppSelector } from "@/redux/store";
import { getAllPatients } from "@/app/services/getAllPatients";

const StatusBoxes = () => {
  const user = useAppSelector<any>((state) => state.auth.user);
  const [patientsRegisteredToday, setPatientsRegisteredToday] =
    useState<number>(0);
  const [patientsAttendedToday, setPatientsAttendedToday] = useState<number>(0);
  const [newPatientsThisMonth, setNewPatientsThisMonth] = useState<number>(0);
  const [patientsAttendedThisMonth, setPatientsAttendedThisMonth] =
    useState<number>(0);
  const [loader, setLoader] = useState(true);
  const [patientsCollection, setpatientsCollection] = useState([]);
  // ========================
  useEffect(() => {
    const fetchPatients = async () => {
      if (user) {
        try {
          setLoader(true);
          const data = await getAllPatients(
            user.uid,
            getTime(startOfMonth(new Date())),
            getTime(endOfMonth(new Date()))
          );
          if (data.data) {
            setLoader(false);
            setpatientsCollection(data.data);
          } else {
            setpatientsCollection([]);
          }
        } catch (error) {
          setpatientsCollection([]);

          setLoader(false);
        }
      }
    };

    fetchPatients();
  }, [user]);
  // ================
  const fetchPatientVisitData = (patientsCollection: any[]) => {
    const today = new Date();
    const todayDate = today.toISOString().split("T")[0]; // Use ISO format YYYY-MM-DD
    const month = today.getMonth() + 1; // Months are 0-based, so add 1
    const year = today.getFullYear();

    let registeredTodayCount = 0;
    let attendedTodayCount = 0;
    let newPatientsThisMonthCount = 0;
    let patientsAttendedThisMonthCount = 0;

    patientsCollection?.forEach((patient) => {
      const lastVisitedDate = new Date(patient?.last_visited)
        .toISOString()
        .split("T")[0];
      const visitedDates =
        patient?.visitedDates?.map(
          (date: number) => new Date(date).toISOString().split("T")[0]
        ) || [];

      if (lastVisitedDate === todayDate) {
        registeredTodayCount++;
      }

      if (visitedDates.includes(todayDate)) {
        attendedTodayCount++;
      }

      const visitMonthsAndYears = visitedDates.map((date: string) => {
        const visitDate = new Date(date);
        return `${visitDate.getFullYear()}-${visitDate.getMonth() + 1}`;
      });

      const currentMonthYear = `${year}-${month}`;

      if (
        visitedDates.length === 1 &&
        visitMonthsAndYears[0] === currentMonthYear
      ) {
        newPatientsThisMonthCount++;
      }

      patientsAttendedThisMonthCount += visitMonthsAndYears.filter(
        (date: string) => date === currentMonthYear
      ).length;
    });

    setPatientsRegisteredToday(registeredTodayCount);
    setPatientsAttendedToday(attendedTodayCount);
    setNewPatientsThisMonth(newPatientsThisMonthCount);
    setPatientsAttendedThisMonth(patientsAttendedThisMonthCount);
  };

  useEffect(() => {
    if (!loader) {
      fetchPatientVisitData(patientsCollection);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientsCollection, loader]);

  const LoaderBox: React.FC = () => (
    <Skeleton className="bg-custom-gradient bg-gray-300/70 skeleton h-[33px] w-[20%] rounded-sm"></Skeleton>
  );
  const DetailsBox: React.FC<{
    icon: React.ReactNode;
    count: number;
    title: string;
  }> = ({ icon, count, title }) => (
    <>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-card border-2">
        {icon}
      </div>
      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-2xl font-bold">{count}</h4>
          <p className="text-sm font-medium leading-tight text-ring">{title}</p>
        </div>
      </div>
    </>
  );
  return (
    <div className="w-full mt-2 sm:mt-4 md:mb-6">
      <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
        <div className="px-7 flex flex-col justify-center border-2 h-[170px] rounded-md overflow-hidden bg-gradient-to-b from-muted/50 to-muted">
          <DetailsBox
            icon={<Pencil className="size-5 text-primary" />}
            count={patientsRegisteredToday}
            title={"Registered Today"}
          />
        </div>
        <div className="px-7 flex flex-col justify-center border-2 h-[170px] rounded-md overflow-hidden bg-gradient-to-b from-muted/50 to-muted">
          <DetailsBox
            icon={<Check className="size-5 text-primary" />}
            count={patientsAttendedToday}
            title={"Attended Today"}
          />
        </div>
        <div className="px-7 flex flex-col justify-center border-2 h-[170px] rounded-md overflow-hidden bg-gradient-to-b from-muted/50 to-muted">
          <DetailsBox
            icon={<Star className="size-5 text-primary" />}
            count={newPatientsThisMonth}
            title={"New Patients this Month"}
          />
        </div>
        <div className="px-7 flex flex-col justify-center border-2 h-[170px] rounded-md overflow-hidden bg-gradient-to-b from-muted/50 to-muted">
          <DetailsBox
            icon={<Check className="size-5 text-primary" />}
            count={patientsAttendedThisMonth}
            title={"Attended this month"}
          />
        </div>
      </div>
    </div>
  );
};

export default StatusBoxes;
