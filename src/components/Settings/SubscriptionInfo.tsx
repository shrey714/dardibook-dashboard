import getPlanById from "@/app/services/razorpay/getPlanById";
import { getSubscription } from "@/app/services/getSubscription";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";
import Loader from "../common/Loader";

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
        setLoader(false);
      }
    };
    fetchSubscriptionInfo();
  }, [mainLoader, subId]);

  return (
    <div className="mt-3 md:mt-6 mx-auto max-w-4xl bg-white rounded-lg">
      <div className="px-3 py-2 md:px-8 flex flex-row justify-between items-center">
        <h3 className="text-sm sm:text-base font-semibold leading-7 text-gray-900 tracking-wide">
          Subscription Information <span className="text-sm text-gray-500" >(mm/dd/yyyy)</span>
        </h3>
        {loader || mainLoader ? (
          <span className="relative">
            <Loader
              size="medium"
              color="text-primary"
              secondaryColor="text-gray-300"
            />
          </span>
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
