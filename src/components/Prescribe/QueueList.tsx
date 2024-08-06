"use client";
import React, { useEffect, useState } from "react";
import { getTodayPatients } from "@/app/services/getTodayPatients";
import { useAppSelector } from "@/redux/store";
import Link from "next/link";
import StatsHeader from "./StatsHeader";
import useToken from "@/firebase/useToken";
import Loader from "../common/Loader";
const QueueList: React.FC = () => {
  const user = useAppSelector<any>((state) => state.auth.user);
  const [queueItems, setqueueItems] = useState<any>([]);
  const [queueLoader, setqueueLoader] = useState(false);
  const { CurrentToken } = useToken(user?.uid);
  useEffect(() => {
    const getTodayPatientQueue = async () => {
      if (user) {
        setqueueLoader(true);
        const patientQueueData = await getTodayPatients(user.uid);
        if (patientQueueData.data) {
          //   console.log(patientQueueData.data);
          setqueueItems(patientQueueData.data);
        } else {
          setqueueItems([]);
        }
        setqueueLoader(false);
      } else {
        setqueueLoader(false);
      }
    };
    getTodayPatientQueue();
  }, [user]);

  return (
    <>
      <StatsHeader
        registrations={queueItems.length}
        attended={
          queueItems?.filter((item: any) => item.attended === true).length
        }
      />
      <div className="w-full mt-8 p-0 flex flex-row items-center">
        <span className="flex flex-1 h-[2px] bg-gradient-to-r from-transparent via-primary to-gray-800"></span>
        <div className=" flex items-center justify-center">
          <p className="text-gray-800 w-auto px-3 py-1 font-semibold text-base bg-gray-300 rounded-full border-gray-800 border-[2px]">
            Doctor&apos;s Space
          </p>
        </div>
        <span className="flex flex-1 h-[2px] bg-gradient-to-l from-transparent via-primary to-gray-800"></span>
      </div>
      <div className="w-full flex flex-row">
        {queueLoader ? (
          <div className="w-full h-52 overflow-hidden flex items-center justify-center">
            <Loader
              size="medium"
              color="text-primary"
              secondaryColor="text-white"
            />
          </div>
        ) : queueItems.length === 0 ? (
          <div className="w-full h-52 overflow-hidden flex items-center justify-center">
            Empty
          </div>
        ) : (
          <>
            <ul className="w-full mt-4">
              <table className="w-full">
                <thead>
                  <tr className="sticky top-0 bg-gray-300">
                    <th className="pb-2 text-sm sm:text-base text-gray-800">
                      Token
                    </th>
                    <th className="pb-2 text-sm sm:text-base text-gray-800 hide-before-480 hide-between-768-and-990">
                      Id
                    </th>
                    <th className="pb-2 text-sm sm:text-base text-gray-800">
                      Name
                    </th>
                    <th className="pb-2 text-sm sm:text-base text-gray-800">
                      Status
                    </th>
                    <th className="pb-2 text-sm sm:text-base text-gray-800">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="rounded-lg">
                  {queueItems.map((item: any, key: number) => {
                    const select =
                      CurrentToken === queueItems.length - key ? true : false;
                    return (
                      <tr key={key} className="m-0 overflow-hidden">
                        <td className="align-top text-center font-medium text-sm sm:text-base">
                          <p
                            className={`${
                              select
                                ? "bg-primary text-white"
                                : " text-gray-800"
                            } p-1 my-1 rounded-s-full`}
                          >
                            {queueItems.length - key}
                          </p>
                        </td>
                        <td className="align-top text-center font-medium text-sm sm:text-base hide-before-480 hide-between-768-and-990">
                          <Link
                            href={{
                              pathname: "history/patientHistory",
                              query: { patientId: item.patient_unique_Id },
                            }}
                          >
                            <p
                              className={`underline ${
                                select
                                  ? "bg-primary text-white"
                                  : "bg-white text-gray-800 rounded-s-full"
                              } p-1 my-1 px-4`}
                            >
                              {item.patient_unique_Id}
                            </p>
                          </Link>
                        </td>
                        <td className="align-top font-medium text-center text-sm sm:text-base">
                          <p
                            className={` ${
                              select
                                ? "bg-primary text-white"
                                : "bg-white text-gray-800 full-radius-between-768-and-990 full-radius-before-480"
                            } p-1 px-2 my-1 rounded-e-full mr-1`}
                          >
                            {item.first_name} {item.last_name}
                          </p>
                        </td>
                        <td className="align-top text-center font-medium text-sm sm:text-base">
                          <p
                            className={`m-1 rounded-full ${
                              item.attended
                                ? "bg-green-600 p-1 text-white"
                                : item.old
                                ? "bg-white p-1 text-gray-800"
                                : "border-2 p-[2px] border-gray-800 text-gray-800"
                            }`}
                          >
                            {item.attended
                              ? "Attended"
                              : item.old
                              ? "Old"
                              : "New"}
                          </p>
                        </td>
                        <td className="align-top text-center font-medium text-sm sm:text-base flex flex-row flex-col-below-990">
                          <Link
                            href={{
                              pathname: item.attended
                                ? "history/patientHistory"
                                : "prescribe/patientData",
                              query: { patientId: item.patient_unique_Id },
                            }}
                            className="mx-1 py-1 px-2 w-full m-1 text-gray-800 bg-white shadow-[0px_0px_0px_1px_#a0aec0] rounded-[4px] font-semibold text-sm sm:text-base"
                          >
                            History
                          </Link>
                          {!item.attended && (
                            <Link
                              href={{
                                pathname: "prescribe/prescribeForm",
                                query: { patientId: item.patient_unique_Id },
                              }}
                              className="mx-1 py-1 px-2 w-full m-1 bg-primary text-white rounded-[4px] font-semibold text-sm sm:text-base"
                            >
                              Attend
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default QueueList;
