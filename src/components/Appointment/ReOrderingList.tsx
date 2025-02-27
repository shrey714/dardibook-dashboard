import React, { useEffect } from "react";
// import { getTodayPatients } from "@/app/services/getTodayPatients";
import useToken from "@/firebase/useToken";
import Link from "next/link";
import Loader from "../common/Loader";
import { useAuth } from "@clerk/nextjs";
import { Reorder } from "framer-motion";
import { format } from "date-fns";
import { UserReOrderMenu } from "./UserReOrderMenu";
import { useTodayPatientStore } from "@/lib/providers/todayPatientsProvider";

const ReOrderingList: React.FC = () => {
  const { isLoaded, orgId } = useAuth();
  const { CurrentToken } = useToken(orgId || "");

  const { patientsData, loading, getTodayPatients } = useTodayPatientStore(
    (state) => state
  );

  useEffect(() => {
    if (orgId && isLoaded) {
      getTodayPatients(orgId);
    }
  }, [getTodayPatients, isLoaded, orgId]);

  const base = 4;
  const t = (d: number) => d * base;
  return (
    <>
      <div className="max-h-[80vh] overflow-y-auto overflow-x-hidden flex flex-row">
        {loading ? (
          <div className="w-full h-48 overflow-hidden flex items-center justify-center">
            <Loader size="medium" />
          </div>
        ) : patientsData?.length === 0 || patientsData === null ? (
          <div className="w-full h-52 overflow-hidden flex items-center justify-center">
            <img className="w-full max-w-[16rem]" src="/empty.svg" alt="" />
          </div>
        ) : (
          <>
            <ul className="w-full">
              <Reorder.Group
                values={patientsData}
                onReorder={() => {}}
                draggable={false}
              >
                <table className="w-full">
                  <thead>
                    <tr className="sticky top-0 bg-background">
                      <th className="pb-2 text-sm sm:text-base">Token</th>
                      <th className="pb-2 text-sm sm:text-base hide-before-480 hide-between-768-and-990">
                        Id
                      </th>
                      <th className="pb-2 text-sm sm:text-base">Name</th>
                      <th className="pb-2 hidden lg:block text-sm sm:text-base">
                        Contact
                      </th>
                      <th className="pb-2 text-sm sm:text-base">Status</th>
                      <th className="pb-2"></th>
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
                          <td className="text-center font-medium text-sm sm:text-base relative">
                            <div
                              className={`${
                                select ? "bg-blue-700 text-white" : ""
                              } p-1 rounded-s-full flex items-center px-3`}
                            >
                              {patientsData?.length - key}
                              <p className="text-xs ml-2">
                                (
                                {format(new Date(item.last_visited), "hh:mm a")}
                                )
                              </p>
                            </div>
                          </td>
                          <td className="text-center font-medium text-sm sm:text-base hide-before-480 hide-between-768-and-990">
                            <Link
                              href={{
                                pathname: "history/patientHistory",
                                query: {
                                  patientId: item.patient_unique_Id,
                                },
                              }}
                            >
                              <p
                                className={`underline ${
                                  select
                                    ? "bg-blue-700 text-white"
                                    : "bg-border rounded-s-full"
                                } p-1 px-4`}
                              >
                                {item.patient_unique_Id}
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
                              {item.first_name} {item.last_name}
                            </p>
                          </td>
                          <td className="font-medium text-center text-sm sm:text-base hidden lg:block">
                            <p
                              className={` ${
                                select ? "bg-blue-700 text-white" : "bg-border"
                              } my-1 mr-1 p-1 px-4 rounded-e-full`}
                            >
                              {item?.mobile_number}
                            </p>
                          </td>
                          <td className="text-center font-medium text-sm sm:text-base">
                            <p
                              className={`m-1 mr-2 rounded-full ${
                                item.attended
                                  ? "bg-green-600 p-1 text-white"
                                  : item.old
                                  ? "bg-border p-1"
                                  : "border-2  p-[2px] border-border"
                              }`}
                            >
                              {item.attended
                                ? "Attended"
                                : item.old
                                ? "Old"
                                : "New"}
                            </p>
                          </td>
                          <td className="text-center font-medium text-sm sm:text-base">
                            <UserReOrderMenu
                              item={item}
                              disabled={item.attended}
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
      </div>
    </>
  );
};

export default ReOrderingList;
