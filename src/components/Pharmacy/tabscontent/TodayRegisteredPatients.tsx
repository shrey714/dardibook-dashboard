"use client";
import React, { useState } from "react";
import { BriefcaseMedical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTodayPatientStore } from "@/lib/providers/todayPatientsProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { SidebarMenuSkeleton } from "@/components/ui/sidebar";
import { PharmacySelectedPatientType } from "@/types/FormTypes";
import { Input } from "@/components/ui/input";

const TodayRegisteredPatients = ({
  onSelectPatient,
}: {
  onSelectPatient: (patient: PharmacySelectedPatientType) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { todayPatients, loading } = useTodayPatientStore((state) => state);

  const filteredPatients = searchTerm
    ? todayPatients.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.mobile.includes(searchTerm)
      )
    : todayPatients;

  return (
    <Card className="h-full w-full overflow-hidden flex-col gap-0 py-0">
      <CardHeader className="p-3 space-y-1">
        <CardTitle className="text-lg font-medium text-muted-foreground flex items-center justify-between">
          <span>Todays Registered Patients</span>
          <span className="text-sm font-normal text-muted-foreground">
            {todayPatients.length} patients
          </span>
        </CardTitle>
        <div className="relative w-full">
          <Input
            type="search"
            placeholder="Search by name or mobile"
            wrapClassName="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="h-auto py-1.5">Name</TableHead>
            <TableHead className="h-auto py-1.5">Mobile</TableHead>
            <TableHead className="h-auto py-1.5  text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      <CardContent className="p-0 flex-col overflow-y-auto h-[var(--content-height)]">
        <Table>
          <TableBody>
            {loading ? (
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
                  <TableCell className="col-span-3 h-auto flex flex-col justify-start items-start">
                    <p className="text-sm font-normal">{patient.name}</p>
                    <p className="text-sm text-muted-foreground gap-x-2 inline-flex items-center">
                      {patient.patient_id}
                    </p>
                  </TableCell>
                  <TableCell>{patient.mobile}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="default"
                      effect={"ringHover"}
                      size="sm"
                      onClick={() =>
                        onSelectPatient({
                          name: patient.name,
                          patient_id: patient.patient_id,
                          mobile: patient.mobile,
                          gender: patient.gender,
                        })
                      }
                      className="my-1 mr-1 h-7 border-0 sm:h-8 py-1 flex items-center justify-center"
                    >
                      <BriefcaseMedical />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-muted-foreground"
                >
                  No patients registered today
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TodayRegisteredPatients;
