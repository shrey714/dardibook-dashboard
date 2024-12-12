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
import { RefreshCw } from "lucide-react";
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
        <span className="flex flex-1 h-[2px] bg-gradient-to-r from-transparent to-primary"></span>
        <div className=" flex items-center justify-center">
          <p className="text-primary w-auto px-3 py-1 font-medium text-base rounded-full border-primary border-[2px]">
            Medical Space
          </p>
        </div>
        <span className="flex flex-1 h-[2px] bg-gradient-to-l from-transparent to-primary"></span>
      </div>
      <div className="w-full flex flex-row">
        {queueLoader ? (
          <div className="w-full h-52 overflow-hidden flex items-center justify-center">
            <Loader
              size="medium"
            />
          </div>
        ) : queueItems.length === 0 ? (
          <div className="w-full h-52 overflow-hidden flex items-end justify-center">
            <img className="w-full max-w-[16rem]" src="/empty.svg" alt="" />
          </div>
        ) : (
          <>
            <ul className="w-full mt-4 pb-3 relative">
            <RefreshCw
                className={`w-4 h-4 text-primary absolute -top-6 right-3 ${
                  realUpdateLoader ? "animate-spin" : ""
                }`}
              />

              <Reorder.Group
                values={queueItems}
                onReorder={setqueueItems}
                draggable={false}
              >
                <table className="w-full">
                  <thead>
                    <tr className="sticky top-1 z-20">
                      <th className="pb-2 text-sm sm:text-base">
                        Token
                      </th>
                      <th className="pb-2 text-sm sm:text-base hide-before-480 hide-between-768-and-990">
                        Id
                      </th>
                      <th className="pb-2 text-sm sm:text-base">
                        Name
                      </th>
                      <th className="pb-2 text-sm sm:text-base">
                        Status
                      </th>
                      <th className="pb-2 text-sm sm:text-base">
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
                                  : ""
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
                              className="mx-1 py-1 px-2 w-full text-black bg-white m-1 bg-primary rounded-[4px] shadow-sm font-semibold text-sm sm:text-base"
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
