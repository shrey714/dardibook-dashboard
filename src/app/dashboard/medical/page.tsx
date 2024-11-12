"use client";
import React, { useEffect, useState } from "react";
import { getTodayPatients } from "@/app/services/getTodayPatients";
import { useAppSelector } from "@/redux/store";
import Link from "next/link";
import useToken from "@/firebase/useToken";
import Loader from "@/components/common/Loader";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Reorder } from "framer-motion";
const Medical = () => {
  const user = useAppSelector<any>((state) => state.auth.user);
  const [queueItems, setqueueItems] = useState<any>([]);
  const [queueLoader, setqueueLoader] = useState(true);
  const [realUpdateLoader, setrealUpdateLoader] = useState(false);
  const { CurrentToken } = useToken(user?.uid);

  // =========================================
  // useEffect(() => {
  //   const getTodayPatientQueue = async () => {
  //     if (user) {
  //       setqueueLoader(true);
  //       const patientQueueData = await getTodayPatients(user.uid);
  //       if (patientQueueData.data) {
  //         //   console.log(patientQueueData.data);
  //         setqueueItems(patientQueueData.data);
  //       } else {
  //         setqueueItems([]);
  //       }
  //       setqueueLoader(false);
  //     } else {
  //       setqueueLoader(false);
  //     }
  //   };
  //   getTodayPatientQueue();
  // }, [user]);
  // =============================================
  useEffect(() => {
    let unsubscribe: () => void;

    const getTodayPatientQueue = () => {
      if (user) {
        const q = query(collection(db, "doctor", user.uid, "patients"));

        setqueueLoader(true); //enable after
        unsubscribe = onSnapshot(q, async (snapshot) => {
          setrealUpdateLoader(true);
          const patientQueueData = await getTodayPatients(user.uid);
          if (patientQueueData.data) {
            setqueueItems(patientQueueData.data);
          } else {
            setqueueItems([]);
          }
          setTimeout(() => {
            setrealUpdateLoader(false);
          }, 1000);
          setqueueLoader(false);
        });
      } else {
        setqueueLoader(false);
      }
    };

    getTodayPatientQueue();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);
  // =============================================
  let base = 4;
  let t = (d: number) => d * base;

  return (
    <div className=" w-full lg:w-3/4 lg:ml-[12.5%] self-center py-0 flex flex-1 justify-start flex-col items-center px-4 sm:px-6 lg:px-8">
      <div className="w-full mt-6 p-0 flex flex-row items-center">
        <span className="flex flex-1 h-[2px] bg-gradient-to-r from-transparent via-primary to-gray-800"></span>
        <div className=" flex items-center justify-center">
          <p className="text-gray-800 w-auto px-3 py-1 font-semibold text-base bg-gray-300 rounded-full border-gray-800 border-[2px]">
            Medical Space
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
          <div className="w-full h-52 overflow-hidden flex items-end justify-center">
            <img className="w-full max-w-[16rem]" src="/empty.svg" alt="" />
          </div>
        ) : (
          <>
            <ul className="w-full mt-4 pb-3 relative">
              <svg
                className={`w-4 h-4 absolute -top-6 right-3 transform -rotate-180 ${
                  realUpdateLoader
                    ? "animate-spin text-primary"
                    : "text-gray-800"
                }`}
                focusable="false"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.65 8.35l-2.79 2.79c-.32.32-.1.86.35.86H18c0 3.31-2.69 6-6 6-.79 0-1.56-.15-2.25-.44-.36-.15-.77-.04-1.04.23-.51.51-.33 1.37.34 1.64.91.37 1.91.57 2.95.57 4.42 0 8-3.58 8-8h1.79c.45 0 .67-.54.35-.85l-2.79-2.79c-.19-.2-.51-.2-.7-.01zM6 12c0-3.31 2.69-6 6-6 .79 0 1.56.15 2.25.44.36.15.77.04 1.04-.23.51-.51.33-1.37-.34-1.64C14.04 4.2 13.04 4 12 4c-4.42 0-8 3.58-8 8H2.21c-.45 0-.67.54-.35.85l2.79 2.79c.2.2.51.2.71 0l2.79-2.79c.31-.31.09-.85-.36-.85H6z"></path>
              </svg>

              <Reorder.Group
                values={queueItems}
                onReorder={setqueueItems}
                draggable={false}
              >
                <table className="w-full">
                  <thead>
                    <tr className="sticky top-1 z-20">
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
                    {[...queueItems].map((item: any, key: number) => {
                      const select =
                        CurrentToken === queueItems.length - key ? true : false;
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
                                select
                                  ? "bg-primary text-white"
                                  : " text-gray-800"
                              } p-1 my-1 rounded-s-full`}
                            >
                              {queueItems.length - key}
                            </p>
                          </td>
                          <td className="transition align-top text-center font-medium text-sm sm:text-base hide-before-480 hide-between-768-and-990">
                            <p
                              className={`${
                                select
                                  ? "bg-primary text-white"
                                  : "bg-white text-gray-800 rounded-s-full"
                              } p-1 my-1 px-4`}
                            >
                              {item.patient_unique_Id}
                            </p>
                          </td>
                          <td className="transition align-top font-medium text-center text-sm sm:text-base">
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
                          <td className="transition align-top text-center font-medium text-sm sm:text-base">
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
                          <td className="transition align-top text-center font-medium text-sm sm:text-base flex flex-row flex-col-below-990">
                            <Link
                              href={{
                                pathname: "medical/medicalForm",
                                query: { patientId: item.patient_unique_Id },
                              }}
                              className="mx-1 py-1 px-2 w-full m-1 bg-primary text-white rounded-[4px] shadow-sm font-semibold text-sm sm:text-base"
                            >
                              Report
                            </Link>
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
    </div>
  );
};

export default Medical;
