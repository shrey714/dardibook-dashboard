"use client";
import React, { useEffect, useState } from "react";
import { useToken } from "@/firebase/TokenStore";
import Link from "next/link";
import Loader from "../common/Loader";
import { useOrganization } from "@clerk/nextjs";
import { AnimatePresence, Reorder } from "framer-motion";
import { format, getTime, startOfDay } from "date-fns";
import { UserReOrderMenu } from "@/components/Appointment/UserReOrderMenu";
import { useTodayPatientStore } from "@/lib/providers/todayPatientsProvider";
import { usePatientHistoryModalStore } from "@/lib/stores/patientHistoryModalStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BedSingle,
  BedSingleIcon,
  ClipboardCheck,
  ClipboardCheckIcon,
  ClipboardPlusIcon,
  EllipsisVertical,
  History,
  ListFilter,
  PencilLineIcon,
  UserRoundPlus,
  UserRoundPlusIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TodayPatientsFilter {
  registerd_for?: string;
  registerd_by?: string;
  selectedFilter?: string;
}

const filterOptions = [
  {
    value: "Registered",
    icon: <UserRoundPlus className="h-6 w-6" />,
    classname:
      "hover:text-blue-600 data-[state=on]:border-blue-600 data-[state=on]:bg-blue-600/10 data-[state=on]:text-blue-600",
  },
  {
    value: "Prescribed",
    icon: <ClipboardCheck className="h-6 w-6" />,
    classname:
      "hover:text-green-600 data-[state=on]:border-green-600 data-[state=on]:bg-green-600/10 data-[state=on]:text-green-600",
  },
  {
    value: "Bed",
    icon: <BedSingle className="h-6 w-6" />,
    classname: "hover:text-accent-foreground data-[state=on]:border-primary",
  },
];

const QueueList: React.FC = () => {
  const { openModal } = usePatientHistoryModalStore();
  const { CurrentToken, doctorId } = useToken();
  const { todayPatients, loading } = useTodayPatientStore((state) => state);
  const [filters, setFilters] = useState<TodayPatientsFilter>();
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  useEffect(() => {
    setFilters((prevFilter) => ({
      ...prevFilter,
      registerd_for: doctorId ?? undefined,
    }));
  }, [doctorId]);
  const { memberships } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
      role: ["org:doctor", "org:clinic_head", "org:assistant_doctor"],
    },
  });

  const filteredPatients = todayPatients.filter((patient) => {
    if (filters?.selectedFilter) {
      const filterConditions: Record<string, boolean> = {
        Registered: !patient.inBed && !patient.prescribed,
        Prescribed: patient.prescribed && !patient.inBed,
        Bed: patient.inBed,
      };

      if (!filterConditions[filters.selectedFilter]) return false;
    }

    if (
      filters?.registerd_by &&
      patient.registerd_by.id !== filters.registerd_by
    ) {
      return false;
    }

    if (
      filters?.registerd_for &&
      patient.registerd_for.id !== filters.registerd_for
    ) {
      return false;
    }

    return true;
  });

  const base = 4;
  const t = (d: number) => d * base;
  return (
    <div
      className={`max-w-6xl ${
        isDesktop ? "!mt-2" : "!mt-0"
      } w-full h-full overflow-x-hidden overflow-y-hidden gap-x-4 gap-y-2 flex flex-col 2xl:flex-row flex-wrap`}
    >
      {isDesktop ? (
        <div className="px-2 pb-2 pt-0.5 min-w-64 h-min flex flex-wrap gap-2 border-b 2xl:border-b-0 2xl:border-r items-center 2xl:items-stretch flex-row 2xl:flex-col">
          <div className="flex flex-1 flex-row gap-x-1">
            <span className="bg-green-500/10 flex h-auto px-2 rounded-md aspect-square items-center justify-center">
              <ClipboardPlusIcon size={20} className="text-green-500" />
            </span>
            <Select
              value={filters?.registerd_for}
              name="registerd_for"
              onValueChange={(val) => {
                setFilters((prev) => ({ ...prev, registerd_for: val }));
              }}
            >
              <SelectTrigger
                id="registerd_for"
                className={`w-full md:max-w-md lg:col-span-2 disabled:text-primary shadow-sm rounded-md border-border bg-transparent form-input py-1 pl-2 sm:text-sm sm:leading-6
                  ${filters?.registerd_for === doctorId && "text-green-500"}`}
              >
                <SelectValue placeholder="Registerd for" />
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
          </div>

          <div className="flex flex-1 flex-row gap-x-1">
            <span className="bg-blue-600/10 flex h-auto px-2 rounded-md aspect-square items-center justify-center">
              <PencilLineIcon size={20} className="text-blue-600" />
            </span>
            <Select
              value={filters?.registerd_by}
              name="registerd_by"
              onValueChange={(val) => {
                setFilters((prev) => ({ ...prev, registerd_by: val }));
              }}
            >
              <SelectTrigger
                id="registerd_by"
                className="w-full md:max-w-md lg:col-span-2 disabled:text-primary shadow-sm rounded-md border-border bg-transparent form-input py-1 pl-2 sm:text-sm sm:leading-6"
              >
                <SelectValue placeholder="Registerd by" />
              </SelectTrigger>
              <SelectContent>
                {memberships &&
                  memberships.data?.map((member, index) =>
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
          </div>

          <ToggleGroup
            className="flex flex-row 2xl:flex-col items-start gap-2"
            type="single"
            value={filters?.selectedFilter}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, selectedFilter: value }))
            }
          >
            {filterOptions.map(({ value, icon, classname }) => (
              <ToggleGroupItem
                key={value}
                value={value}
                aria-label={value}
                className={cn(
                  "flex h-auto text-muted-foreground flex-row items-center justify-between border border-muted bg-popover px-4 py-2 rounded-full hover:bg-accent",
                  filters?.selectedFilter === value && classname
                )}
              >
                {icon} {value}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <div className="flex flex-1 flex-row gap-x-1 items-end justify-end">
            <Button
              onClick={() => {
                setFilters({
                  registerd_for: "",
                  registerd_by: "",
                  selectedFilter: "",
                });
              }}
              className="h-auto py-0 pl-0"
              variant={"link"}
            >
              clear
            </Button>
          </div>
        </div>
      ) : (
        <Drawer autoFocus>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className={`self-end py-2 px-3 ${
                filters &&
                Object.values(filters).some(Boolean) &&
                "border-green-600 text-green-400 shadow-[inset_0px_-3.5px_0px_0px_#16a34a]"
              }`}
            >
              <ListFilter />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Filter patients</DrawerTitle>
                <DrawerDescription>
                  Filter patients based on their status.
                </DrawerDescription>
              </DrawerHeader>

              <div className="px-2 pb-2 min-w-64 h-min flex flex-wrap gap-2 items-stretch flex-col">
                <div className="flex flex-1 flex-row gap-x-1">
                  <span className="bg-green-500/10 flex h-auto px-2 rounded-md aspect-square items-center justify-center">
                    <ClipboardPlusIcon size={20} className="text-green-500" />
                  </span>
                  <Select
                    value={filters?.registerd_for}
                    name="registerd_for"
                    onValueChange={(val) => {
                      setFilters((prev) => ({ ...prev, registerd_for: val }));
                    }}
                  >
                    <SelectTrigger
                      id="registerd_for"
                      className={`w-full md:max-w-md lg:col-span-2 disabled:text-primary shadow-sm rounded-md border-border bg-transparent form-input py-1 pl-2 sm:text-sm sm:leading-6 ${
                        filters?.registerd_for === doctorId && "text-green-500"
                      }`}
                    >
                      <SelectValue placeholder="Registerd for" />
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
                </div>

                <div className="flex flex-1 flex-row gap-x-1">
                  <span className="bg-blue-600/10 flex h-auto px-2 rounded-md aspect-square items-center justify-center">
                    <PencilLineIcon size={20} className="text-blue-600" />
                  </span>
                  <Select
                    value={filters?.registerd_by}
                    name="registerd_by"
                    onValueChange={(val) => {
                      setFilters((prev) => ({ ...prev, registerd_by: val }));
                    }}
                  >
                    <SelectTrigger
                      id="registerd_by"
                      className="w-full md:max-w-md lg:col-span-2 disabled:text-primary shadow-sm rounded-md border-border bg-transparent form-input py-1 pl-2 sm:text-sm sm:leading-6"
                    >
                      <SelectValue placeholder="Registerd by" />
                    </SelectTrigger>
                    <SelectContent>
                      {memberships &&
                        memberships.data?.map((member, index) =>
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
                </div>

                <ToggleGroup
                  className="flex flex-row 2xl:flex-col items-start gap-2"
                  type="single"
                  value={filters?.selectedFilter}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, selectedFilter: value }))
                  }
                >
                  {filterOptions.map(({ value, icon, classname }) => (
                    <ToggleGroupItem
                      key={value}
                      value={value}
                      aria-label={value}
                      className={cn(
                        "flex h-auto text-muted-foreground flex-row items-center justify-between border border-muted bg-popover px-4 py-2 rounded-full hover:bg-accent",
                        filters?.selectedFilter === value && classname
                      )}
                    >
                      {icon} {value}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>

                <div className="flex flex-1 flex-row gap-x-1 items-end justify-end">
                  <Button
                    onClick={() => {
                      setFilters({
                        registerd_for: "",
                        registerd_by: "",
                        selectedFilter: "",
                      });
                    }}
                    className="h-auto py-0 pl-0"
                    variant={"link"}
                  >
                    clear
                  </Button>
                </div>
              </div>

              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      <ScrollArea className="h-full flex flex-1">
        {loading ? (
          <div className="w-full h-48 overflow-hidden flex items-center justify-center">
            <Loader size="medium" />
          </div>
        ) : filteredPatients?.length === 0 || filteredPatients === null ? (
          <div className="w-full h-52 overflow-hidden flex items-center justify-center">
            <img className="w-full max-w-[16rem]" src="/empty.svg" alt="" />
          </div>
        ) : (
          <>
            <ul className="w-full h-full px-2 pb-14">
              <TooltipProvider>
                <Reorder.Group
                  values={filteredPatients}
                  onReorder={() => {}}
                  draggable={false}
                >
                  <AnimatePresence initial={false}>
                    <table className="w-full">
                      <tbody className="rounded-lg">
                        {/* [...filteredPatients, ...Array(20).fill(filteredPatients[0])] */}
                        {filteredPatients.map((item, key: number) => {
                          const select =
                            CurrentToken === filteredPatients?.length - key
                              ? true
                              : false;
                          const patient_matching_reg_date_time =
                            item.registered_date_time.find(
                              (date_time) =>
                                getTime(startOfDay(date_time)) ===
                                getTime(startOfDay(new Date()))
                            ) ?? 0;
                          return (
                            <Reorder.Item
                              drag={false}
                              as="tr"
                              key={item.patient_id}
                              value={item.patient_id}
                              initial={{ height: 0, opacity: 0 }}
                              animate={{
                                height: "auto",
                                opacity: 1,
                                transition: {
                                  type: "spring",
                                  bounce: 0.3,
                                  opacity: { delay: t(0.025) },
                                },
                              }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: t(0.15),
                                type: "spring",
                                bounce: 0,
                                opacity: { duration: t(0.03) },
                              }}
                              className="relative m-0 overflow-hidden"
                            >
                              <td className="text-center font-medium text-sm sm:text-base relative">
                                <div
                                  className={`${
                                    select ? "bg-blue-700 text-white" : ""
                                  } p-1 rounded-s-full flex items-center px-3`}
                                >
                                  {filteredPatients?.length - key}
                                  <p className="text-xs ml-2">
                                    (
                                    {format(
                                      new Date(patient_matching_reg_date_time),
                                      "hh:mm a"
                                    )}
                                    )
                                  </p>
                                </div>
                              </td>
                              <td className="text-center font-medium text-sm sm:text-base hide-before-480 hide-between-768-and-990">
                                <Link
                                  href={"#"}
                                  role="button"
                                  onClick={() =>
                                    openModal({
                                      patientId: item.patient_id,
                                    })
                                  }
                                >
                                  <p
                                    className={`underline ${
                                      select
                                        ? "bg-blue-700 text-white"
                                        : "bg-border rounded-s-full"
                                    } p-1 px-4`}
                                  >
                                    {item.patient_id}
                                  </p>
                                </Link>
                              </td>
                              <td className="font-medium text-center text-sm sm:text-base">
                                <p
                                  className={` ${
                                    select
                                      ? "bg-blue-700 text-white"
                                      : "bg-border full-radius-between-768-and-990 full-radius-before-480"
                                  } p-1 px-4 rounded-e-full lg:rounded-none mr-1 lg:mr-0 line-clamp-1`}
                                >
                                  {item.name}
                                </p>
                              </td>
                              <td className="font-medium text-center text-sm sm:text-base hidden lg:block">
                                <p
                                  className={` ${
                                    select
                                      ? "bg-blue-700 text-white"
                                      : "bg-border"
                                  } my-1 mr-1 p-1 px-4 rounded-e-full`}
                                >
                                  {item.mobile}
                                </p>
                              </td>
                              <td className="font-medium text-center text-sm sm:text-base">
                                <p
                                  className={`my-1 border-2 mr-1 py-1 px-4 rounded-full text-center flex items-center justify-center ${
                                    item.inBed
                                      ? "border-primary"
                                      : item.prescribed
                                      ? "bg-green-500/10 border-green-500 text-green-500"
                                      : "bg-blue-500/10 border-blue-500 text-blue-500"
                                  }`}
                                >
                                  {item.inBed ? (
                                    <BedSingleIcon className="size-4 sm:size-5" />
                                  ) : item.prescribed ? (
                                    <ClipboardCheckIcon className="size-4 sm:size-5" />
                                  ) : (
                                    <UserRoundPlusIcon className="size-4 sm:size-5" />
                                  )}
                                </p>
                              </td>
                              <td className="text-center table-cell">
                                <div className="flex flex-row gap-x-1">
                                  {isDesktop ? (
                                    <>
                                      <UserReOrderMenu
                                        customClassName="disabled:invisible"
                                        patient={item}
                                        matchingDate={new Date()}
                                        disabled={item.prescribed || item.inBed}
                                      />

                                      <Tooltip delayDuration={100}>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted border rounded-full"
                                            asChild
                                          >
                                            <Link
                                              href={"#"}
                                              role="button"
                                              onClick={() =>
                                                openModal({
                                                  patientId: item.patient_id,
                                                })
                                              }
                                            >
                                              <History />
                                            </Link>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">
                                          <p>History</p>
                                        </TooltipContent>
                                      </Tooltip>

                                      <Tooltip delayDuration={100}>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="outline"
                                            disabled={
                                              item.prescribed || item.inBed
                                            }
                                            className="bg-blue-700 hover:bg-blue-900 text-white hover:text-white flex h-8 w-8 p-0 border-0 rounded-full disabled:invisible"
                                            asChild={!item.prescribed}
                                          >
                                            <Link
                                              href={{
                                                pathname:
                                                  "prescribe/prescribeForm",
                                                query: {
                                                  patientId: item.patient_id,
                                                },
                                              }}
                                            >
                                              <ClipboardPlusIcon className="size-4 sm:size-5" />
                                            </Link>
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                          <p>Prescribe</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </>
                                  ) : (
                                    <DropdownMenu>
                                      <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full">
                                        <EllipsisVertical className="size-4 sm:size-5" />
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent className="w-56 space-y-1">
                                        <DropdownMenuItem asChild>
                                          <UserReOrderMenu
                                            customClassName="w-full rounded-md border-0 justify-start pl-3"
                                            patient={item}
                                            matchingDate={new Date()}
                                            disabled={
                                              item.prescribed || item.inBed
                                            }
                                            insideText="Schedule"
                                          />
                                        </DropdownMenuItem>

                                        <DropdownMenuItem asChild>
                                          <Button
                                            variant="ghost"
                                            className="flex h-8 w-full p-0 data-[state=open]:bg-muted justify-start pl-3 rounded-md"
                                            asChild
                                          >
                                            <Link
                                              href={"#"}
                                              role="button"
                                              onClick={() =>
                                                openModal({
                                                  patientId: item.patient_id,
                                                })
                                              }
                                            >
                                              <History /> History
                                            </Link>
                                          </Button>
                                        </DropdownMenuItem>

                                        <DropdownMenuItem asChild>
                                          <Button
                                            variant="ghost"
                                            disabled={
                                              item.prescribed || item.inBed
                                            }
                                            className="bg-blue-700 hover:bg-blue-900 text-white hover:text-white h-8 w-full p-0 pl-3 justify-start rounded-md"
                                            asChild={!item.prescribed}
                                          >
                                            <Link
                                              className="flex flex-1 flex-row gap-x-2"
                                              href={{
                                                pathname:
                                                  "prescribe/prescribeForm",
                                                query: {
                                                  patientId: item.patient_id,
                                                },
                                              }}
                                            >
                                              <ClipboardPlusIcon className="size-4 sm:size-5" />{" "}
                                              Prescribe
                                            </Link>
                                          </Button>
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  )}
                                </div>
                              </td>
                            </Reorder.Item>
                          );
                        })}
                      </tbody>
                    </table>
                  </AnimatePresence>
                </Reorder.Group>
              </TooltipProvider>
            </ul>
          </>
        )}
      </ScrollArea>
    </div>
  );
};

export default QueueList;
