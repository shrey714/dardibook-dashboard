"use client";
import React from "react";
import Link from "next/link";
import useToken from "@/firebase/useToken";
import Loader from "@/components/common/Loader";
import { Reorder } from "framer-motion";
import { BriefcaseMedical } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useTodayPatientStore } from "@/lib/providers/todayPatientsProvider";
const Medical = () => {
  const { orgId } = useAuth();
  const { CurrentToken } = useToken(orgId || "");

  const { patientsData, loading } = useTodayPatientStore((state) => state);

  const base = 4;
  const t = (d: number) => d * base;

  return (
    <div className=" w-full lg:w-3/4 lg:ml-[12.5%] self-center py-0 flex flex-1 justify-start flex-col items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full mt-6 p-0 flex flex-row items-center">
        <span className="flex flex-1 h-[2px] bg-gradient-to-r from-transparent to-primary"></span>
        <div className=" flex items-center justify-center">
          <p className="text-primary w-auto px-3 py-1 font-medium text-base rounded-full border-primary border-[2px]">
            Medical Space
          </p>
        </div>
        <span className="flex flex-1 h-[2px] bg-gradient-to-l from-transparent to-primary"></span>
      </div>
      <div className="w-full flex flex-row">
        {loading ? (
          <div className="w-full h-52 overflow-hidden flex items-center justify-center">
            <Loader size="medium" />
          </div>
        ) : patientsData?.length === 0 || patientsData === null ? (
          <div className="w-full h-52 overflow-hidden flex items-end justify-center">
            <img className="w-full max-w-[16rem]" src="/empty.svg" alt="" />
          </div>
        ) : (
          <>
            <ul className="w-full mt-4 pb-3 relative">
              <TooltipProvider>
                <Reorder.Group
                  values={patientsData}
                  onReorder={() => {}}
                  draggable={false}
                >
                  <table className="w-full">
                    <thead>
                      <tr className="sticky top-1 z-20">
                        <th className="pb-2 text-sm sm:text-base">Token</th>
                        <th className="pb-2 text-sm sm:text-base hide-before-480 hide-between-768-and-990">
                          Id
                        </th>
                        <th className="pb-2 text-sm sm:text-base">Name</th>
                        <th className="pb-2 text-sm sm:text-base">Status</th>
                        <th className="pb-2 text-sm sm:text-base">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="rounded-lg">
                      {[...patientsData].map((item: any, key: number) => {
                        const select =
                          CurrentToken === patientsData?.length - key
                            ? true
                            : false;
                        return (
                          <Reorder.Item
                            drag={false}
                            as="tr"
                            key={item.patient_unique_Id}
                            value={item.patient_unique_Id}
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
                            <td className="transition align-top text-center font-medium text-sm sm:text-base">
                              <p
                                className={`${
                                  select ? "bg-blue-700 text-white" : ""
                                } p-1 my-1 rounded-s-full`}
                              >
                                {patientsData?.length - key}
                              </p>
                            </td>
                            <td className="transition align-top text-center font-medium text-sm sm:text-base hide-before-480 hide-between-768-and-990">
                              <p
                                className={`${
                                  select
                                    ? "bg-blue-700 text-white"
                                    : "bg-border rounded-s-full"
                                } p-1 my-1 px-4`}
                              >
                                {item.patient_unique_Id}
                              </p>
                            </td>
                            <td className="transition align-top font-medium text-center text-sm sm:text-base">
                              <p
                                className={` ${
                                  select
                                    ? "bg-blue-700 text-white"
                                    : "bg-border full-radius-between-768-and-990 full-radius-before-480"
                                } p-1 px-2 my-1 rounded-e-full mr-1`}
                              >
                                {item.first_name} {item.last_name}
                              </p>
                            </td>
                            <td className="transition align-top text-center font-medium text-sm sm:text-base">
                              <p
                                className={`m-1 rounded-full ${
                                  item.attended
                                    ? "bg-green-600 p-1 text-white"
                                    : item.old
                                    ? "bg-border p-1"
                                    : "border-2 p-[2px] border-border"
                                }`}
                              >
                                {item.attended
                                  ? "Attended"
                                  : item.old
                                  ? "Old"
                                  : "New"}
                              </p>
                            </td>
                            <td className="transition align-top text-center font-medium text-sm sm:text-base flex items-center justify-center">
                              <Tooltip delayDuration={100}>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="my-1 mr-1 h-7 border-0 sm:h-8 py-1 flex items-center justify-center bg-blue-700 hover:bg-blue-900 text-white hover:text-white rounded-[4px]"
                                    asChild
                                  >
                                    <Link
                                      href={{
                                        pathname: "medical/medicalForm",
                                        query: {
                                          patientId: item.patient_unique_Id,
                                        },
                                      }}
                                    >
                                      <BriefcaseMedical />
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p>Report</p>
                                </TooltipContent>
                              </Tooltip>
                            </td>
                          </Reorder.Item>
                        );
                      })}
                    </tbody>
                  </table>
                </Reorder.Group>
              </TooltipProvider>
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default Medical;
