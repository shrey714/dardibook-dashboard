import React, { useEffect, useState } from "react";
import { getTodayPatients } from "@/app/services/getTodayPatients";
import { useAppSelector } from "@/redux/store";
import QueueLoader from "./QueueLoader";
const ReOrderingList: React.FC = () => {
  const user = useAppSelector<any>((state) => state.auth.user);
  const [queueItems, setqueueItems] = useState<any>([]);
  const [queueLoader, setqueueLoader] = useState(false);

  useEffect(() => {
    const getTodayPatientQueue = async () => {
      if (user) {
        setqueueLoader(true);
        const patientQueueData = await getTodayPatients(user.uid);
        if (patientQueueData.data) {
          // console.log(patientQueueData.data);
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
      <div className="max-h-[80vh] overflow-y-auto overflow-x-hidden flex flex-row">
        {queueLoader ? (
          <QueueLoader />
        ) : queueItems.length === 0 ? (
          <div className="w-full h-52 overflow-hidden flex items-center justify-center">
            Empty
          </div>
        ) : (
          <>
            <ul>
              {queueItems.map((item: any, key: number) => (
                <li
                  key={key}
                  className="p-1 m-0 mb-1 list-none flex flex-row items-center border-2 border-transparent text-[#333] rounded"
                >
                  <div className="rounded-md mx-1 aspect-square h-6 text-white text-center font-medium bg-black">
                    {key}
                  </div>
                </li>
              ))}
            </ul>
            <ul className="w-full">
              {queueItems.map((item: any, key: number) => (
                <li
                  key={key}
                  className="p-1 m-0 mb-1 list-none flex flex-row items-center gap-2 border-2 border-[#CCC] text-[#333] rounded bg-[#fff]"
                >
                  <div className="mx-1">{item.patient_unique_Id}</div>
                  <div className="mx-1">{item.first_name}</div>
                  <div className="mx-1">{item.last_name}</div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default ReOrderingList;
