"use client";
import React, { useEffect, useState } from "react";
import { BriefcaseMedical } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { endOfDay, format, getTime, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { db } from "@/firebase/firebaseConfig";

import { SidebarMenuSkeleton } from "@/components/ui/sidebar";
import {
  BedPatientTypes,
  OrgBed,
  PharmacySelectedPatientType,
} from "@/types/FormTypes";

const PatientsInBed = ({
  onSelectPatient,
}: {
  onSelectPatient: (patient: PharmacySelectedPatientType) => void;
}) => {
  const { isLoaded, orgId } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [inBedloader, setInBedLoader] = useState(false);
  const [bedsForDate, setBedForDate] = useState<OrgBed[]>([]);
  const [patientsForDate, setPatientsForDate] = useState<
    Record<string, BedPatientTypes>
  >({});

  useEffect(() => {
    let unsubscribe: () => void;
    const getPatientsInBed = () => {
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

        setInBedLoader(true);
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
                  const {
                    patient_id,
                    name,
                    mobile,
                    gender,
                    age,
                    bed_info,
                  } = patientSnap.data();
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
          setInBedLoader(false);
        });
      } else {
        setInBedLoader(false);
      }
    };

    getPatientsInBed();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isLoaded, orgId, date]);

  const filteredPatients = searchTerm
    ? bedsForDate.filter(
        (bed) =>
          bed.bedId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bed.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patientsForDate[bed.patient_id].name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          patientsForDate[bed.patient_id].mobile.includes(searchTerm)
      )
    : bedsForDate;

  return (
    <Card className="h-full w-full overflow-hidden flex-col">
      <CardHeader className="p-3 space-y-2">
        <CardTitle className="text-lg font-semibold text-muted-foreground flex items-center justify-between">
          <span>Patients in Bed</span>
          <span className="text-sm font-normal text-muted-foreground">
            {bedsForDate.length} patients
          </span>
        </CardTitle>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <div className="relative w-full">
          <input
            type="search"
            placeholder="Search by name, mobile or bed"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="h-auto py-1.5">Bed</TableHead>
            <TableHead className="h-auto py-1.5">Name</TableHead>
            <TableHead className="h-auto py-1.5">Status</TableHead>
            <TableHead className="h-auto py-1.5 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      <CardContent className="p-0 flex-col overflow-y-auto h-[calc(100svh-296px)]">
        <Table>
          <TableBody>
            {inBedloader ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={3}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SidebarMenuSkeleton key={index} />
                  ))}
                </TableCell>
              </TableRow>
            ) : filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => (
                <TableRow
                  key={patient.patient_id + index}
                  className="hover:bg-transparent"
                >
                  <TableCell className="font-medium">{patient.bedId}</TableCell>
                  <TableCell className="col-span-3 h-auto flex flex-col justify-start items-start">
                    <p className="text-sm font-normal">
                      {patientsForDate[patient.patient_id].name}
                    </p>
                    <p className="text-sm text-muted-foreground gap-x-2 inline-flex items-center">
                      {patient.patient_id}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        patient.dischargeMarked
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {patient.dischargeMarked ? "Discharged" : "In Bed"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        onSelectPatient({
                          name: patientsForDate[patient.patient_id].name,
                          patient_id: patient.patient_id,
                          mobile: patientsForDate[patient.patient_id].mobile,
                          gender: patientsForDate[patient.patient_id].gender,
                        })
                      }
                      className="my-1 mr-1 h-7 border-0 sm:h-8 py-1 flex items-center justify-center bg-blue-700 hover:bg-blue-900 text-white hover:text-white rounded-[4px]"
                    >
                      <BriefcaseMedical />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  No patients in bed
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PatientsInBed;
