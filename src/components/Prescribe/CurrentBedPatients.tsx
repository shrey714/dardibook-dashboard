"use client";
import React, { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useBedsStore } from "@/lib/stores/useBedsStore";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarMinusIcon,
  CalendarPlusIcon,
  ClipboardX,
  LogOut,
  PencilLineIcon,
  BedSingle,
  PhoneIcon,
  ClipboardPlusIcon,
  History,
  X,
  Inbox,
  Bed,
} from "lucide-react";
import { Link2 } from "lucide-react";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { format, startOfDay } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarMenuSkeleton } from "../ui/sidebar";
import { usePatientHistoryModalStore } from "@/lib/stores/patientHistoryModalStore";
import { BedManagementMenu } from "../Appointment/BedManagementMenu";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { useOrganization } from "@clerk/nextjs";

interface CurrentBedPatientsFilter {
  admission_for?: string;
}

const CurrentBedPatients = () => {
  const { beds, bedPatients, loading } = useBedsStore((state) => state);
  const isDesktop = useMediaQuery("(min-width: 1536px)");
  const [alerts] = useState<string[]>([]);
  const { openModal } = usePatientHistoryModalStore();
  const [filters, setFilters] = useState<CurrentBedPatientsFilter>();
  const { memberships } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
      role: ["org:doctor", "org:clinic_head", "org:assistant_doctor"],
    },
  });

  const filteredPatients = beds.filter((bed) => {
    if (
      filters?.admission_for &&
      bed.admission_for.id !== filters.admission_for
    ) {
      return false;
    }

    return true;
  });
  return (
    <>
      {isDesktop ? (
        <Card
          className={cn("w-[400px] mb-5 border-2 bg-muted/50 flex flex-col")}
        >
          <CardHeader className="border-b py-4 px-3">
            <CardTitle>Admitted Patients</CardTitle>
            <CardDescription>
              Discharge patients or update their assigned staff.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 flex flex-1 flex-col gap-y-2 overflow-y-hidden">
            <div className="flex w-full flex-row gap-x-1">
              <span className="bg-green-500/10 flex h-auto px-2 rounded-md aspect-square items-center justify-center">
                <ClipboardPlusIcon size={20} className="text-green-500" />
              </span>
              <Select
                value={filters?.admission_for}
                name="admission_for"
                onValueChange={(val) => {
                  setFilters((prev) => ({ ...prev, admission_for: val }));
                }}
              >
                <SelectTrigger
                  id="admission_for"
                  className="w-full md:max-w-md lg:col-span-2 disabled:text-primary shadow-sm rounded-md border-border bg-transparent form-input py-1 pl-2 sm:text-sm sm:leading-6"
                >
                  <SelectValue placeholder="Admission for" />
                </SelectTrigger>
                <SelectContent>
                  {memberships &&
                    memberships.data
                      ?.filter((member) =>
                        ["org:doctor", "org:clinic_head"].includes(member.role)
                      )
                      ?.map((member, index) =>
                        member.publicUserData.userId ? (
                          <SelectItem
                            value={member.publicUserData.userId}
                            key={index}
                          >
                            {[
                              member.publicUserData.firstName,
                              member.publicUserData.lastName,
                            ]
                              .filter(Boolean)
                              .join(" ")}
                          </SelectItem>
                        ) : (
                          <></>
                        )
                      )}
                </SelectContent>
              </Select>

              <Button
                disabled={!filters?.admission_for}
                variant={"destructive"}
                className="border-0 bg-red-500/10 text-red-600 hover:!text-red-600 hover:!bg-red-500/20 flex items-center justify-center"
                onClick={() => {
                  setFilters({ admission_for: "" });
                }}
              >
                <X className="text-red-500" />
              </Button>
            </div>

            <Alert hidden={alerts.length === 0}>
              <AlertCircle className="h-4 w-4 !top-auto" />
              <AlertTitle hidden></AlertTitle>
              {alerts.map((alert, index) => (
                <AlertDescription key={index} className="text-xs">
                  {alert}
                </AlertDescription>
              ))}
            </Alert>

            <ScrollArea type="always" className="w-full border-0 rounded-none">
              {loading ? (
                <div className="flex flex-col space-y-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SidebarMenuSkeleton key={index} />
                  ))}
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="text-sidebar-foreground/70 flex flex-1 items-center justify-center flex-col gap-1 min-h-40">
                  <Inbox />
                </div>
              ) : (
                <div className="pr-4 space-y-1.5">
                  {filteredPatients.map((bed, index) => {
                    const matchingPatient = bedPatients[bed.patient_id];
                    return (
                      <HoverCard key={index} openDelay={80} closeDelay={80}>
                        <div
                          className={`flex flex-1 w-full items-center flex-row gap-x-2`}
                        >
                          <HoverCardTrigger className="flex w-full flex-1 flex-row rounded-md bg-border h-24 overflow-hidden">
                            {startOfDay(bed.admission_at).toDateString() ===
                            startOfDay(new Date()).toDateString() ? (
                              <div className="bg-green-400 w-[4px] h-full"></div>
                            ) : (
                              <div className="bg-yellow-500/90 w-[4px] h-full"></div>
                            )}

                            <div className="flex flex-1 flex-col h-full">
                              <div className="relative flex flex-1 h-1/2 items-center gap-2 p-2">
                                <span
                                  className={`text-lg flex flex-row gap-2 items-center bg-background justify-center font-bold rounded-md px-2 py-1 ${
                                    bed.dischargeMarked ? "text-red-600" : ""
                                  }`}
                                >
                                  {bed.dischargeMarked ? (
                                    <ClipboardX className="w-5 h-5" />
                                  ) : (
                                    <BedSingle className="w-5 h-5" />
                                  )}
                                  {bed.bedId}
                                </span>

                                <div className="px-2 h-auto flex flex-col justify-start items-start">
                                  <p className="text-sm font-normal">
                                    <Link
                                      href={"#"}
                                      role="button"
                                      onClick={() =>
                                        openModal({
                                          patientId: bed.patient_id,
                                        })
                                      }
                                      className={`py-1 text-sm h-full`}
                                    >
                                      <p
                                        className={`underline text-muted-foreground text-sm`}
                                      >
                                        {bed.patient_id}
                                      </p>
                                    </Link>
                                  </p>
                                  <p className="text-sm">
                                    {matchingPatient.name}
                                  </p>
                                </div>
                              </div>
                              <div className="relative flex flex-1 h-1/2 items-center gap-x-2 p-2">
                                <BedManagementMenu
                                  patient={matchingPatient}
                                  bed={bed}
                                  disabled={bed.dischargeMarked}
                                />
                                <Button
                                  variant="default"
                                  className="p-0 border-0 rounded-md h-full aspect-square"
                                  asChild
                                >
                                  <Link
                                    href={"#"}
                                    role="button"
                                    onClick={() =>
                                      openModal({
                                        patientId: bed.patient_id,
                                      })
                                    }
                                  >
                                    <History />
                                  </Link>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="bg-blue-700 hover:bg-blue-900 text-white hover:text-white flex flex-1 rounded-md h-full p-0 border-0 disabled:invisible"
                                  asChild
                                >
                                  <Link
                                    href={{
                                      pathname: "prescribe/prescribeForm",
                                      query: {
                                        patientId: bed.patient_id,
                                      },
                                    }}
                                  >
                                    <ClipboardPlusIcon className="size-4 sm:size-5" />
                                  </Link>
                                </Button>
                              </div>
                            </div>

                            {startOfDay(bed.discharge_at).toDateString() ===
                            startOfDay(new Date()).toDateString() ? (
                              <div className="bg-red-500 w-[4px] h-full"></div>
                            ) : (
                              <div className="bg-yellow-500/90 w-[4px] h-full"></div>
                            )}
                          </HoverCardTrigger>
                        </div>

                        <HoverCardContent
                          className="w-auto bg-muted p-2"
                          side="left"
                          sideOffset={20}
                        >
                          <div className="flex flex-row gap-x-4">
                            <div className="flex flex-col items-start space-y-1">
                              <h4 className="text-sm font-semibold">
                                Id : {bed.patient_id}
                              </h4>
                              <h4 className="text-sm font-semibold">
                                Name : {matchingPatient.name}
                              </h4>
                              <h4 className="text-sm font-semibold">
                                Gender : {matchingPatient.gender}
                              </h4>
                              <h4 className="text-sm font-semibold">
                                Age : {matchingPatient.age}
                              </h4>
                              <p className="flex text-sm items-center gap-2">
                                <PhoneIcon size={16} className="text-primary" />{" "}
                                {matchingPatient.mobile}
                              </p>
                            </div>
                            <div className="flex flex-col items-start space-y-1">
                              <p className="flex bg-blue-600/10 text-blue-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-t-sm">
                                <PencilLineIcon size={16} />{" "}
                                {bed.admission_by.name}
                              </p>
                              <p className="!mt-0 flex bg-green-500/10 text-green-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-b-sm">
                                <ClipboardPlusIcon size={16} />{" "}
                                {bed.admission_for.name}
                              </p>
                              <p className="flex bg-green-500/10 text-green-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-t-sm">
                                <CalendarPlusIcon size={16} />{" "}
                                {bed.admission_at &&
                                  format(
                                    bed.admission_at,
                                    "dd-MM-yyyy hh:mm aa"
                                  )}
                              </p>
                              <p className="!mt-0 bg-red-500/10 text-red-600 flex text-sm items-center gap-2 px-2 py-1 w-full rounded-b-sm">
                                <CalendarMinusIcon size={16} />{" "}
                                {bed.discharge_at &&
                                  format(
                                    bed.discharge_at,
                                    "dd-MM-yyyy hh:mm aa"
                                  )}
                              </p>
                            </div>
                          </div>
                          {bed.dischargeMarked ? (
                            <div className="bg-red-500/10 mt-2 w-full rounded-md text-red-600 flex flex-row gap-4 px-3 py-1 items-center">
                              <LogOut className="w-5 h-5" /> Discharged by{" "}
                              {bed?.discharged_by?.name}
                            </div>
                          ) : (
                            <></>
                          )}
                        </HoverCardContent>
                      </HoverCard>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter className="pt-0 pb-1 px-1 flex items-center justify-center">
            <Link
              href={"/"}
              className="text-xs text-muted-foreground hover:underline flex flex-row gap-2"
            >
              <Link2 size={16} /> Bed Management
            </Link>
          </CardFooter>
        </Card>
      ) : (
        <Drawer autoFocus>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="py-2 px-3 absolute right-2 sm:right-5 h-[59px]"
            >
              <Bed />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-4/5 sm:h-4/6">
            <DrawerHeader>
              <DrawerTitle className="flex w-full justify-between">
                Admitted Patients
                <Link
                  href={"/"}
                  className="text-xs text-muted-foreground hover:underline flex flex-row gap-2"
                >
                  <Link2 size={16} /> Bed Management
                </Link>
              </DrawerTitle>
              <DrawerDescription className="text-left">
                Discharge patients or update their assigned staff.
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-2 pb-2 h-min flex flex-col sm:flex-row flex-wrap gap-2 sm:items-start">
              <div className="flex flex-1 flex-row gap-x-1 items-center">
                <span className="bg-green-500/10 flex h-auto px-2 rounded-md aspect-square items-center justify-center">
                  <ClipboardPlusIcon size={20} className="text-green-500" />
                </span>
                <Select
                  value={filters?.admission_for}
                  name="admission_for"
                  onValueChange={(val) => {
                    setFilters((prev) => ({ ...prev, admission_for: val }));
                  }}
                >
                  <SelectTrigger
                    id="admission_for"
                    className="w-full md:max-w-md lg:col-span-2 disabled:text-primary shadow-sm rounded-md border-border bg-transparent form-input py-1 pl-2 sm:text-sm sm:leading-6"
                  >
                    <SelectValue placeholder="Admission for" />
                  </SelectTrigger>
                  <SelectContent>
                    {memberships &&
                      memberships.data
                        ?.filter((member) =>
                          ["org:doctor", "org:clinic_head"].includes(
                            member.role
                          )
                        )
                        ?.map((member, index) =>
                          member.publicUserData.userId ? (
                            <SelectItem
                              value={member.publicUserData.userId}
                              key={index}
                            >
                              {[
                                member.publicUserData.firstName,
                                member.publicUserData.lastName,
                              ]
                                .filter(Boolean)
                                .join(" ")}
                            </SelectItem>
                          ) : (
                            <></>
                          )
                        )}
                  </SelectContent>
                </Select>
                <Button
                  disabled={!filters?.admission_for}
                  variant={"destructive"}
                  className="border-0 bg-red-500/10 text-red-600 hover:!text-red-600 hover:!bg-red-500/20 flex items-center justify-center"
                  onClick={() => {
                    setFilters({ admission_for: "" });
                  }}
                >
                  <X className="text-red-500" />
                </Button>
              </div>

              <Alert
                className={`${
                  alerts.length === 0 ? "hidden" : "flex flex-1"
                } w-auto`}
              >
                <AlertCircle className="h-4 w-4 !top-auto" />
                <AlertTitle hidden></AlertTitle>
                {alerts.map((alert, index) => (
                  <AlertDescription key={index} className="text-xs">
                    {alert}{" "}
                  </AlertDescription>
                ))}
              </Alert>
            </div>

            <ScrollArea className="w-full border-0 rounded-none">
              {loading ? (
                <div className="flex flex-col space-y-1">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <SidebarMenuSkeleton key={index} />
                  ))}
                </div>
              ) : filteredPatients.length === 0 ? (
                <div className="flex items-center justify-center min-h-20">
                  <Inbox />
                </div>
              ) : (
                <Accordion
                  type="single"
                  collapsible
                  className="px-2 grid grid-cols-1 md:grid-cols-2 gap-1.5"
                >
                  {filteredPatients.map((bed, index) => {
                    const matchingPatient = bedPatients[bed.patient_id];
                    return (
                      <AccordionItem
                        key={index}
                        value={`${index}`}
                        className="border-b-0"
                      >
                        <AccordionTrigger className="py-0 border-0 hover:no-underline gap-x-2 pr-2">
                          <div className="flex w-full flex-1 flex-row rounded-md bg-border h-24 sm:h-12 overflow-hidden">
                            {startOfDay(bed.admission_at).toDateString() ===
                            startOfDay(new Date()).toDateString() ? (
                              <div className="bg-green-400 w-[4px] h-full"></div>
                            ) : (
                              <div className="bg-yellow-500/90 w-[4px] h-full"></div>
                            )}

                            <div className="flex flex-1 flex-col sm:flex-row flex-wrap h-full">
                              <div className="relative flex flex-1 h-1/2 sm:h-full items-center gap-2 p-2">
                                <span
                                  className={`text-lg flex flex-row gap-2 items-center bg-background justify-center font-bold rounded-md px-2 py-1 ${
                                    bed.dischargeMarked ? "text-red-600" : ""
                                  }`}
                                >
                                  {bed.dischargeMarked ? (
                                    <ClipboardX className="w-5 h-5" />
                                  ) : (
                                    <BedSingle className="w-5 h-5" />
                                  )}
                                  {bed.bedId}
                                </span>

                                <div className="px-2 h-auto flex flex-col justify-start items-start">
                                  <p className="text-sm font-normal">
                                    <Link
                                      href={"#"}
                                      role="button"
                                      onClick={() =>
                                        openModal({
                                          patientId: bed.patient_id,
                                        })
                                      }
                                      className={`py-1 text-sm h-full`}
                                    >
                                      <p
                                        className={`underline text-muted-foreground text-sm`}
                                      >
                                        {bed.patient_id}
                                      </p>
                                    </Link>
                                  </p>
                                  <p className="text-sm line-clamp-1">
                                    {matchingPatient.name}
                                  </p>
                                </div>
                              </div>
                              <div className="relative flex flex-1 h-1/2 sm:h-full items-center gap-x-2 p-2">
                                <BedManagementMenu
                                  patient={matchingPatient}
                                  bed={bed}
                                  disabled={bed.dischargeMarked}
                                />
                                <Button
                                  variant="default"
                                  className="p-0 border-0 rounded-md h-full aspect-square"
                                  asChild
                                >
                                  <Link
                                    href={"#"}
                                    role="button"
                                    onClick={() =>
                                      openModal({
                                        patientId: bed.patient_id,
                                      })
                                    }
                                  >
                                    <History />
                                  </Link>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="bg-blue-700 hover:bg-blue-900 text-white hover:text-white flex flex-1 rounded-md h-full p-0 px-2 border-0 disabled:invisible"
                                  asChild
                                >
                                  <Link
                                    href={{
                                      pathname: "prescribe/prescribeForm",
                                      query: {
                                        patientId: bed.patient_id,
                                      },
                                    }}
                                  >
                                    <ClipboardPlusIcon className="size-4 sm:size-5" />
                                  </Link>
                                </Button>
                              </div>
                            </div>

                            {startOfDay(bed.discharge_at).toDateString() ===
                            startOfDay(new Date()).toDateString() ? (
                              <div className="bg-red-500 w-[4px] h-full"></div>
                            ) : (
                              <div className="bg-yellow-500/90 w-[4px] h-full"></div>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="w-auto bg-muted p-2 mt-1 rounded-md">
                          <div className="flex flex-row gap-x-4">
                            <div className="flex flex-col items-start space-y-1">
                              <h4 className="text-sm font-semibold">
                                Id : {bed.patient_id}
                              </h4>
                              <h4 className="text-sm font-semibold">
                                Name : {matchingPatient.name}
                              </h4>
                              <h4 className="text-sm font-semibold">
                                Gender : {matchingPatient.gender}
                              </h4>
                              <h4 className="text-sm font-semibold">
                                Age : {matchingPatient.age}
                              </h4>
                              <p className="flex text-sm items-center gap-2">
                                <PhoneIcon size={16} className="text-primary" />{" "}
                                {matchingPatient.mobile}
                              </p>
                            </div>
                            <div className="flex flex-col items-start space-y-1">
                              <p className="flex bg-blue-600/10 text-blue-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-t-sm">
                                <PencilLineIcon size={16} />{" "}
                                {bed.admission_by.name}
                              </p>
                              <p className="!mt-0 flex bg-green-500/10 text-green-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-b-sm">
                                <ClipboardPlusIcon size={16} />{" "}
                                {bed.admission_for.name}
                              </p>
                              <p className="flex bg-green-500/10 text-green-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-t-sm">
                                <CalendarPlusIcon size={16} />{" "}
                                {bed.admission_at &&
                                  format(
                                    bed.admission_at,
                                    "dd-MM-yyyy hh:mm aa"
                                  )}
                              </p>
                              <p className="!mt-0 bg-red-500/10 text-red-600 flex text-sm items-center gap-2 px-2 py-1 w-full rounded-b-sm">
                                <CalendarMinusIcon size={16} />{" "}
                                {bed.discharge_at &&
                                  format(
                                    bed.discharge_at,
                                    "dd-MM-yyyy hh:mm aa"
                                  )}
                              </p>
                            </div>
                          </div>
                          {bed.dischargeMarked ? (
                            <div className="bg-red-500/10 mt-2 w-full rounded-md text-red-600 flex flex-row gap-4 px-3 py-1 items-center">
                              <LogOut className="w-5 h-5" /> Discharged by{" "}
                              {bed?.discharged_by?.name}
                            </div>
                          ) : (
                            <></>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </ScrollArea>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default CurrentBedPatients;
