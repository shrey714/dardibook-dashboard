import getPlanById from "@/app/api/razorpay/getPlanById";
import { getSubscription } from "@/app/services/getSubscription";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";

interface Subscription {
  id: string;
  plan_id: string;
  status: string;
  created_at: number | null;
  total_count: number | null;
  paid_count: number | null;
  charge_at: number | null;
  end_at: number | null;
  short_url: string;
}

const convertTimestampToDate = (timestamp: number | null) => {
  if (timestamp === null) return "";
  return new Date(timestamp * 1000).toLocaleDateString();
};

const SubscriptionInfo = ({ subId, mainLoader }: any) => {
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<Subscription>({
    id: " ",
    plan_id: " ",
    status: " ",
    created_at: null,
    total_count: null,
    paid_count: null,
    charge_at: null,
    end_at: null,
    short_url: " ",
  });
  const [planData, setplanData] = useState<any | null>(null);

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      if (!mainLoader && subId !== "") {
        setLoader(true);
        setError(null);

        const result = await getSubscription(subId);
        if (result.error) {
          setError(result.error);
        } else {
          setSubscriptionData(result.data);
        }

        const planDetails = await getPlanById(result?.data?.plan_id);
        const parsedPlanDetails = await planDetails.json();
        setplanData(parsedPlanDetails?.item);
        console.log(parsedPlanDetails);
        setLoader(false);
      }
    };
    fetchSubscriptionInfo();
  }, [mainLoader, subId]);

  return (
    <div className="mt-3 md:mt-6 mx-auto max-w-4xl bg-white rounded-lg">
      <div className="px-3 py-2 md:px-8">
        <h3 className="text-sm sm:text-base font-semibold leading-7 text-gray-900 tracking-wide flex flex-row justify-between items-center">
          Subscription Information
          {loader || mainLoader ? (
            <div role="status">
              <svg
                aria-hidden="true"
                className="inline w-6 h-6 text-gray-300 animate-spin fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          ) : (
            <a
              href={subscriptionData?.short_url}
              className="p-[4px] rounded-full border-[2.5px] border-gray-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ArrowTopRightOnSquareIcon className="size-3 text-blue-600" />
            </a>
          )}
        </h3>
      </div>
      <div className="border-t-4 md:border-t-[6px] border-gray-300 flex flex-col-reverse md:flex-row">
        {error ? (
          <p className="flex flex-1 text-center text-sm text-error font-medium py-2 px-3 items-center justify-center">
            Pls get back later {error}
          </p>
        ) : (
          <>
            {/* subscription details */}
            <div className="py-3 px-3 md:px-8 flex flex-1 flex-col border-t-4 md:border-t-0 md:border-r-[6px] border-gray-300">
              <div className="grid grid-cols-6 gap-1 md:gap-6">
                {/* Status: */}
                <div className="col-span-6 sm:col-span-3">
                  <p className="text-xs sm:text-sm font-medium leading-3 text-gray-500">
                    Status:
                  </p>
                  <p className="form-input min-h-[2.5rem] py-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700">
                    {subscriptionData?.status}
                  </p>
                </div>
                {/* Subscription Started On: */}
                <div className="col-span-6 sm:col-span-3">
                  <p className="text-xs sm:text-sm font-medium leading-3 text-gray-500">
                    Subscription Started On:
                  </p>
                  <p className="form-input min-h-[2.5rem] py-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700">
                    {convertTimestampToDate(subscriptionData?.created_at)}
                  </p>
                </div>
                {/* Next Due Date: */}
                <div className="col-span-6 sm:col-span-3">
                  <p className="text-xs sm:text-sm font-medium leading-3 text-gray-500">
                    Next Due Date:
                  </p>
                  <p className="form-input min-h-[2.5rem] py-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700">
                    {convertTimestampToDate(subscriptionData?.charge_at)}
                  </p>
                </div>

                {/*  Final Date: */}
                <div className="col-span-6 sm:col-span-3">
                  <p className="text-xs sm:text-sm font-medium leading-3 text-gray-500">
                    Final Date:
                  </p>
                  <p className="form-input min-h-[2.5rem] py-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700">
                    {convertTimestampToDate(subscriptionData?.end_at)}
                  </p>
                </div>

                {/*  Total Cycles: */}
                <div className="col-span-6 sm:col-span-3">
                  <p className="text-xs sm:text-sm font-medium leading-3 text-gray-500">
                    Total Cycles:
                  </p>
                  <p className="form-input min-h-[2.5rem] py-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700">
                    {subscriptionData?.total_count}
                  </p>
                </div>

                {/*  Cycles Completed:: */}
                <div className="col-span-6 sm:col-span-3">
                  <p className="text-xs sm:text-sm font-medium leading-3 text-gray-500">
                    Cycles Completed:
                  </p>
                  <p className="form-input min-h-[2.5rem] py-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700">
                    {subscriptionData?.paid_count}
                  </p>
                </div>
              </div>
            </div>

            {/* plan details */}
            <div className="py-3 px-3 md:px-8 flex flex-wrap flex-row md:flex-col">
              <div className="w-full sm:min-w-40 grid grid-cols-6 gap-1 md:gap-6">
                {/* Plan name: */}
                <div className="col-span-6 sm:col-span-3 md:col-span-6">
                  <p className="text-xs sm:text-sm font-medium leading-3 text-gray-500">
                    Plan name:
                  </p>
                  <p className="form-input min-h-[2.5rem] py-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700">
                    {planData?.name}
                  </p>
                </div>
                {/* Plan description: */}
                <div className="col-span-6 sm:col-span-3 md:col-span-6">
                  <p className="text-xs sm:text-sm font-medium leading-3 text-gray-500">
                    Description:
                  </p>
                  <p className="form-input min-h-[2.5rem] py-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700">
                    {planData?.description}
                  </p>
                </div>
                {/* Plan price: */}
                <div className="col-span-6 sm:col-span-3 md:col-span-6">
                <p className="text-xs sm:text-sm font-medium leading-3 text-gray-500">
                    Price:
                  </p>
                  <p className="form-input min-h-[2.5rem] py-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700">
                    <span className="text-gray-500 text-base dark:text-gray-400 mr-1">
                      ₹
                    </span>
                    <span className="mr-2 text-lg font-extrabold">
                      {Math.floor(planData?.amount / 100) || ""}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      /month
                    </span>
                  </p>
                </div>
                {/* Plan button: */}
                {/* <div className="col-span-6 sm:col-span-1">
                  <p className="text-xs sm:text-sm font-medium leading-3 text-gray-500">
                    Plan name:
                  </p>
                  <p className="form-input min-h-[2.5rem] py-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700">
                    {planData?.name}
                  </p>
                </div> */}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SubscriptionInfo;
