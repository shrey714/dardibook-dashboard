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
import { ScheduleSidebar } from "../../../components/Appointment/ScheduleSidebar";
import { SidebarProvider2, SidebarTrigger2 } from "@/components/ui/sidebar2";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarProvider3 } from "@/components/ui/sidebar3";
import { BedSidebar } from "@/components/Appointment/BedSidebar";
export default function TShirtsPage() {
  const [patientId, setPatientId] = useState("");

  const handleInputChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    setPatientId(value);
  };

  return (
    <div className="flex flex-1 flex-row relative h-full w-full overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 self-center pb-12 pt-8 flex flex-1 flex-col gap-8 items-center relative h-full overflow-y-auto">
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
        <Card className="w-full p-1 pt-3 pb-3 bg-gradient-to-b from-muted/50 to-muted">
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
        <div className="w-full p-0 flex flex-row items-center">
          <span className="flex flex-1 h-[2px] bg-gradient-to-r from-transparent to-primary"></span>
          <div className=" flex items-center justify-center">
            <p className="w-auto px-3 py-1 font-medium text-base rounded-full border-primary border-[2px]">
              Today&apos;s Queue
            </p>
          </div>
          <span className="flex flex-1 h-[2px] bg-gradient-to-l from-transparent to-primary"></span>
        </div>
        <div className="w-full p-0 -mt-4">
          <ReOrderingList />
        </div>
      </div>

      <div className="h-full relative">
        <SidebarProvider2 defaultOpen={true} className="hidden sm:flex">
          <SidebarProvider3 defaultOpen={false} className="hidden sm:flex">
            <div className="h-fit flex flex-col py-2 absolute -left-9 gap-2">
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <SidebarTrigger2 className="border" />
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Calendar</p>
                  </TooltipContent>
                </Tooltip>
                {/* <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <SidebarTrigger3 className="border" />
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Bed</p>
                  </TooltipContent>
                </Tooltip> */}
              </TooltipProvider>
            </div>
            <ScheduleSidebar />
            <BedSidebar />
          </SidebarProvider3>
        </SidebarProvider2>
      </div>
    </div>
  );
}
