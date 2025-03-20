"use client";
import React, { useCallback } from "react";
import Link from "next/link";
import ReOrderingList from "@/components/Appointment/ReOrderingList";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, UserPlus } from "lucide-react";
import AsyncCreatableSelect from "react-select/async-creatable";
import { and, collection, getDocs, or, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function TShirtsPage() {
  const { orgId } = useAuth();
  const router = useRouter();

  const loadOptions = useCallback(
    async (inputValue: string) => {
      if (!inputValue || inputValue.length < 2) {
        return [];
      }

      if (orgId) {
        try {
          // Firestore query to get medicine suggestions
          const diseaseRef = collection(db, "doctor", orgId, "patients");

          const q = query(
            diseaseRef,
            or(
              and(
                where("name", ">=", inputValue.toLowerCase()),
                where("name", "<=", inputValue.toLowerCase() + "\uf8ff")
              ),
              and(
                where("patient_id", ">=", inputValue.toLowerCase()),
                where("patient_id", "<=", inputValue.toLowerCase() + "\uf8ff")
              ),
              and(
                where("mobile", ">=", inputValue.toLowerCase()),
                where("mobile", "<=", inputValue.toLowerCase() + "\uf8ff")
              )
            )
          );
          const querySnapshot = await getDocs(q);

          const fetchedSuggestions = querySnapshot.docs.map(
            (
              doc
            ): {
              label: string;
              value: string;
              patient_id: string;
              mobile: string;
            } => ({
              label: doc.data().name as string,
              value: doc.data().patient_id as string,
              patient_id: doc.data().patient_id as string,
              mobile: doc.data().mobile as string,
            })
          );

          return fetchedSuggestions;
        } catch (error) {
          console.error("Search error:", error);
          return [];
        }
      } else {
        return [];
      }
    },
    [orgId]
  );

  return (
    <div className="flex flex-1 flex-row relative h-full w-full overflow-hidden">
      <div className="px-4 sm:px-6 lg:px-8 self-center pb-12 pt-5 flex flex-1 flex-col gap-8 items-center relative h-full overflow-y-auto">
        <AsyncCreatableSelect
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
            Option: (patient) => {
              return (
                <div
                  {...patient.innerProps}
                  className={`grid cursor-pointer group relative grid-cols-7 gap-1 w-[calc(100%-16px)] rounded-r-full md:w-[calc(100%-24px)] py-1 px-4 md:py-2 ${
                    patient.isFocused ? "bg-primary-foreground" : ""
                  }`}
                >
                  <span
                    className={`w-1 bg-blue-500 h-3/4 self-center rounded-r-full absolute left-0 ${
                      patient.isSelected || patient.isFocused
                        ? "visible"
                        : "invisible"
                    }`}
                  ></span>

                  <div className="col-span-3 h-auto flex flex-col justify-start items-start">
                    <p className="text-sm font-normal">{patient.data.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {patient.data.patient_id}
                    </p>
                  </div>

                  <div className="col-span-3 h-min py-[0px] sm:py-[5.5px] px-2 font-normal text-sm leading-6 w-full">
                    {patient.data.mobile}
                  </div>

                  <div className="col-span-1 flex justify-center items-center">
                    <ArrowUpRight height={15} width={15} />
                  </div>
                </div>
              );
            },
          }}
          onChange={(val) => {
            router.push(
              `appointment/appointmentForm?patientId=${val?.patient_id}`
            );
          }}
          isClearable={true}
          menuIsOpen={true}
          inputValue="shrey"
          isValidNewOption={() => false}
          allowCreateWhileLoading={false}
          loadOptions={loadOptions}
          cacheOptions
          defaultOptions
          placeholder="Register patient by id/name/number..."
          className="max-w-2xl w-full mx-auto"
          classNames={{
            control: (state) =>
              `!rounded-full !shadow-sm !border-2 !bg-muted/50 !py-1.5 ${
                state.isFocused ? "!border-blue-500" : "!border-border"
              } `,
            placeholder: (state) => "!px-4",
            singleValue: (state) => "!text-primary !px-4",
            input: (state) => "!text-primary !px-4",
            menu: (state) => "!bg-muted !border-none !rounded-lg !shadow-md",
            menuList: (state) => "!py-1 md:!py-2",
          }}
        />

        <div className="max-w-4xl w-full p-0 flex flex-row items-center">
          <span className="flex flex-1 h-[2px] bg-gradient-to-r from-transparent to-primary"></span>
          <div className=" flex items-center justify-center">
            <p className="w-auto px-3 py-1 font-medium text-base rounded-full border-primary border-[2px]">
              Today&apos;s Queue
            </p>
          </div>
          <span className="flex flex-1 h-[2px] bg-gradient-to-l from-transparent to-primary"></span>
        </div>
        <div className="max-w-4xl p-0 -mt-4">
          <ReOrderingList />
        </div>

        <Button
          className="px-0 w-3/4 lg:w-80 bg-blue-600 border-0 shadow-lg hover:bg-blue-600/80 z-10
        absolute bottom-6 justify-self-center rounded-full left-0 right-0 text-white font-semibold tracking-wide"
          variant={"link"}
          asChild
        >
          <Link href={"appointment/appointmentForm"}>
            <UserPlus /> ADD NEW PATIENT
          </Link>
        </Button>
      </div>

      {/* <div className="h-full relative">
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
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <SidebarTrigger3 className="border" />
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Bed</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <ScheduleSidebar />
            <BedSidebar />
          </SidebarProvider3>
        </SidebarProvider2>
      </div> */}
    </div>
  );
}
