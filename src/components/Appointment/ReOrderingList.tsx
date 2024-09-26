import React, { useEffect, useState } from "react";
import { getTodayPatients } from "@/app/services/getTodayPatients";
import { useAppSelector } from "@/redux/store";
import useToken from "@/firebase/useToken";
import Link from "next/link";
import Loader from "../common/Loader";
import { motion } from "framer-motion";

const ReOrderingList: React.FC = () => {
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
           <div className="w-full h-48 overflow-hidden flex items-center justify-center">
           <Loader size="medium" color="text-primary" secondaryColor="text-white" />
         </div>
        ) : queueItems.length === 0 ? (
          <div className="w-full h-52 overflow-hidden flex items-center justify-center">
            <img className="w-full max-w-[16rem]" src="/empty.svg" alt="" />
          </div>
        ) : (
          <>
            <ul className="w-full">
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
                    <th className="pb-2 hidden lg:block text-sm sm:text-base text-gray-800">
                      Contact
                    </th>
                    <th className="pb-2 text-sm sm:text-base text-gray-800">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="rounded-lg">
                  {queueItems.map((item: any, key: number) => {
                    const select =
                      CurrentToken === queueItems.length - key ? true : false;
                    return (
                      <tr key={key} className={`m-0 overflow-hidden`}>
                        <td className="text-center font-medium text-sm sm:text-base">
                          <p
                            className={`${
                              select
                                ? "bg-primary text-white"
                                : " text-gray-800"
                            } p-1 rounded-s-full`}
                          >
                            {queueItems.length - key}
                          </p>
                        </td>
                        <td className="text-center font-medium text-sm sm:text-base hide-before-480 hide-between-768-and-990">
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
                                ? "bg-primary text-white"
                                : "bg-white text-gray-800 full-radius-between-768-and-990 full-radius-before-480"
                            } p-1 px-4 rounded-e-full lg:rounded-none mr-1 lg:mr-0`}
                          >
                            {item.first_name} {item.last_name}
                          </p>
                        </td>
                        <td className="font-medium text-center text-sm sm:text-base hidden lg:block">
                          <p
                            className={` ${
                              select
                                ? "bg-primary text-white"
                                : "bg-white text-gray-800"
                            } my-1 mr-1 p-1 px-4 rounded-e-full`}
                          >
                            {item?.mobile_number}
                          </p>
                        </td>
                        <td className="text-center font-medium text-sm sm:text-base">
                          <p
                            className={`m-1 rounded-full ${
                              item.attended
                                ? "bg-green-600 p-1 text-white"
                                : item.old
                                ? "bg-white p-1 text-gray-800"
                                : "border-2  p-[2px] border-gray-800 text-gray-800"
                            }`}
                          >
                            {item.attended
                              ? "Attended"
                              : item.old
                              ? "Old"
                              : "New"}
                          </p>
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

export default ReOrderingList;