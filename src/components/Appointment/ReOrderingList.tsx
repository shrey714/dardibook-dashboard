import React, { useState } from "react";
import useToken from "@/firebase/useToken";
import Link from "next/link";
import Loader from "../common/Loader";
import { useAuth, useOrganization } from "@clerk/nextjs";
import { Reorder } from "framer-motion";
import { format, getTime, startOfDay } from "date-fns";
import { UserReOrderMenu } from "./UserReOrderMenu";
import { useTodayPatientStore } from "@/lib/providers/todayPatientsProvider";
import { usePatientHistoryModalStore } from "@/lib/stores/patientHistoryModalStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BedSingle,
  BedSingleIcon,
  BriefcaseMedicalIcon,
  ClipboardCheck,
  ClipboardCheckIcon,
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
} from "../ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

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

const ReOrderingList: React.FC = () => {
  const { openModal } = usePatientHistoryModalStore();
  const { orgId } = useAuth();
  const { CurrentToken } = useToken(orgId || "");
  const { todayPatients, loading } = useTodayPatientStore((state) => state);
  const [filters, setFilters] = useState<TodayPatientsFilter>();

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
        Prescribed: patient.prescribed,
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
    <div className="max-w-6xl -mt-1 md:-mt-2 w-full h-full overflow-x-hidden overflow-y-hidden gap-x-5 gap-y-2 flex flex-col 2xl:flex-row flex-wrap">
      <div className="px-2 pb-2 min-w-64 h-min border-b 2xl:border-b-0 2xl:border-r flex flex-row flex-wrap items-center 2xl:items-stretch 2xl:flex-col gap-2">
        <div className="flex flex-1 flex-row gap-x-1">
          <span className="bg-green-500/10 flex h-auto px-2 rounded-md aspect-square items-center justify-center">
            <BriefcaseMedicalIcon size={20} className="text-green-500" />
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
              className="w-full md:max-w-md lg:col-span-2 disabled:text-primary shadow-sm rounded-md border-border bg-transparent form-input py-1 pl-2 sm:text-sm sm:leading-6"
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
                        {member.publicUserData.firstName}{" "}
                        {member.publicUserData.lastName}
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
                      {member.publicUserData.firstName}{" "}
                      {member.publicUserData.lastName}
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
              <Reorder.Group
                values={filteredPatients}
                onReorder={() => {}}
                draggable={false}
              >
                <table className="w-full">
                  <tbody className="rounded-lg">
                    {filteredPatients.map((item, key: number) => {
                      const select =
                        CurrentToken === todayPatients?.length - key
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
                          key={key}
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
                              {todayPatients?.length - key}
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
                              } p-1 px-4 rounded-e-full lg:rounded-none mr-1 lg:mr-0`}
                            >
                              {item.name}
                            </p>
                          </td>
                          <td className="font-medium text-center text-sm sm:text-base hidden lg:block">
                            <p
                              className={` ${
                                select ? "bg-blue-700 text-white" : "bg-border"
                              } my-1 mr-1 p-1 px-4 rounded-e-full`}
                            >
                              {item.mobile}
                            </p>
                          </td>
                          <td className="font-medium text-center text-sm sm:text-base">
                            <p
                              className={`my-1 border-2 mr-1 py-1 px-4 rounded-full text-center flex items-center justify-center ${
                                item.prescribed
                                  ? "bg-green-500/10 border-green-500 text-green-500"
                                  : item.inBed
                                  ? "border-primary"
                                  : "bg-blue-500/10 border-blue-500 text-blue-500"
                              }`}
                            >
                              {item.prescribed ? (
                                <ClipboardCheckIcon size={20} />
                              ) : item.inBed ? (
                                <BedSingleIcon size={20} />
                              ) : (
                                <UserRoundPlusIcon size={20} />
                              )}
                            </p>
                          </td>
                          <td className="text-center font-medium text-sm sm:text-base">
                            <UserReOrderMenu
                              patient={item}
                              matchingDate={new Date()}
                              disabled={item.prescribed || item.inBed}
                            />
                          </td>
                        </Reorder.Item>
                      );
                    })}
                  </tbody>
                </table>
              </Reorder.Group>
            </ul>
          </>
        )}
      </ScrollArea>
    </div>
  );
};

export default ReOrderingList;
