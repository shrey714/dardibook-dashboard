"use client";
import React, { useState } from "react";
import Link from "next/link";
import ReOrderingList from "@/components/Appointment/ReOrderingList";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function TShirtsPage() {
  const [patientId, setPatientId] = useState("");

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setPatientId(value);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 self-center pb-12 pt-8 flex flex-1 justify-center flex-col gap-8 items-center">
      <Tabs value="old">
        <TabsList>
          <TabsTrigger className="px-5" value="old">
            Old Case
          </TabsTrigger>
          <TabsTrigger onClick={() => {}} className="px-5" value="new">
            <Link
              href={"appointment/appointmentForm"}
              className="btn animate-none btn-outline btn-primary join-item sm:btn-sm md:btn-wide"
            >
              New Case
            </Link>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Card className="w-full md:w-3/4 p-1 pt-3 pb-3 bg-gradient-to-b from-muted/50 to-muted">
        <CardHeader>
          <CardTitle>
            Patient ID<span className="text-red-500 ml-1">*</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center">
          <input
            type="text"
            placeholder="ID"
            value={patientId.trim()}
            onChange={handleInputChange}
            className="form-input rounded-md bg-background text-lg w-full max-w-xs tracking-[0.2rem] border-border"
          />
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Button disabled={patientId.length > 3 ? false : true}>
            <Link
              href={{
                pathname: "appointment/appointmentForm",
                query: { patientId: patientId },
              }}
              className={`animate-none md:btn-wide md:btn-md md:text-base`}
            >
              Get Details
            </Link>
          </Button>
        </CardFooter>
      </Card>
      <div className="w-full md:w-3/4 p-0 flex flex-row items-center">
        <span className="flex flex-1 h-[2px] bg-gradient-to-r from-transparent to-primary"></span>
        <div className=" flex items-center justify-center">
          <p className="w-auto px-3 py-1 font-medium text-base rounded-full border-primary border-[2px]">
            Today&apos;s Queue
          </p>
        </div>
        <span className="flex flex-1 h-[2px] bg-gradient-to-l from-transparent to-primary"></span>
      </div>
      <div className="w-full md:w-3/4 p-0 -mt-4">
        <ReOrderingList />
      </div>
    </div>
  );
}
