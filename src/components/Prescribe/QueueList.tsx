"use client";
import React, { useEffect, useState } from "react";
import { getTodayPatients } from "@/app/services/getTodayPatients";
import { useAppSelector } from "@/redux/store";
import QueuePrescribeLoader from "./QueuePrescribeLoader";
import Link from "next/link";
import StatsHeader from "./StatsHeader";
const QueueList: React.FC = () => {
  const user = useAppSelector<any>((state) => state.auth.user);
  const [queueItems, setqueueItems] = useState<any>([]);
  const [queueLoader, setqueueLoader] = useState(false);

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
      <StatsHeader />
      <div className="w-full flex flex-row">
        {queueLoader ? (
          <QueuePrescribeLoader />
        ) : queueItems.length === 0 ? (
          <div className="w-full h-52 overflow-hidden flex items-center justify-center">
            Empty
          </div>
        ) : (
          <>
            <ul className="w-full p-1 pb-0 mt-8 bg-white flex rounded-lg flex-col shadow-[0px_0px_0px_1px_#a0aec0]">
              {queueItems.map((item: any, key: number) => (
                <li
                  key={key}
                  className="p-1 m-0 mb-1 list-none flex flex-row items-center border-2 border-[#CCC] bg-white text-[#333] rounded"
                >
                  <div className="rounded-md mx-1 aspect-square h-6 text-white text-center font-medium bg-black">
                    {queueItems.length - key}
                  </div>
                  <div className="mx-1">{item.patient_unique_Id}</div>
                  <div className="mx-1">{item.first_name}</div>
                  <div className="mx-1">{item.last_name}</div>

                  <div className="mx-1 flex flex-1"></div>
                  {item.attended ? (
                    <div className="mx-1 text-green-700 font-semibold">
                      Attended
                    </div>
                  ) : (
                    <div className="mx-1 text-green-700 font-semibold">
                      {item.old ? "Old" : "New"}
                    </div>
                  )}
                  {item.attended ? (
                    <></>
                  ) : (
                    <Link
                      href={{
                        pathname: "prescribe/prescribeForm",
                        query: { patientId: item.patient_unique_Id },
                      }}
                      className="mx-1 py-1 px-2 w-auto bg-primary text-white rounded-[4px] font-semibold text-sm"
                    >
                      Attend
                    </Link>
                  )}
                  <Link
                    href={{
                      pathname: "prescribe/patientData",
                      query: { patientId: item.patient_unique_Id },
                    }}
                    className="mx-1 py-1 px-2 w-auto bg-[#ccc] rounded-[4px] font-semibold text-sm"
                  >
                    History
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default QueueList;
