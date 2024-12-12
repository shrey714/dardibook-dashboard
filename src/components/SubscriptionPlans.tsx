import React, { useEffect, useState } from "react";
import getplans from "../app/services/razorpay/getplans";
interface SubscriptionPlansProps {
  message?: string | undefined;
}
import { useRouter } from "next/navigation";
import { CircleAlert } from "lucide-react";
import LogOutBTtn from "./common/LogOutBTtn";
import SubscriptionDialogBtn from "./common/SubscriptionDialogBtn";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ message }) => {
  const router = useRouter();
  const [loading, setloading] = useState(true);
  const [allplans, setallplans] = useState<any[]>([]);
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setloading(true);
        const plans = await getplans();
        const parsedPlans = await plans.json();
        setallplans(parsedPlans?.items);
        setloading(false);
      } catch (error) {
        console.log(error);
        setloading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <>
      <div className="text-gray font-medium flex-row flex items-center justify-between">
        <span className="flex flex-row gap-1">
          <CircleAlert className="size-5" /> {message ? message : ""}
        </span>
        <LogOutBTtn size={"sm"} variant={"destructive"} />
      </div>
      <div className="text-gray font-medium flex-row flex items-center justify-between">
        <span className="flex flex-row gap-1">
          <CircleAlert className="size-5" /> Get your subscription information :
        </span>
        <SubscriptionDialogBtn size={"sm"} variant={"secondary"} />
      </div>
      {loading ? (
        <div className="flex flex-1 flex-row p-6 justify-around">
          <div className="flex flex-col w-full items-center">
            <Skeleton className="h-8 w-1/4 mb-4"></Skeleton>
            <Skeleton className="h-6 w-3/4"></Skeleton>
            <Skeleton className="my-8 h-9 w-1/3"></Skeleton>

            <div className="mb-8 space-y-4 w-1/2 self-start">
              <Skeleton className="h-6"></Skeleton>
              <Skeleton className="h-6"></Skeleton>
            </div>

            <Skeleton className="h-8 w-full"></Skeleton>
          </div>
        </div>
      ) : (
        <div className="flex md:flex-row flex-wrap justify-around gap-2">
          {allplans.map((plan, key) => (
            <div
              key={key}
              className="flex flex-1 flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white"
            >
              <h3 className="mb-4 text-2xl font-semibold">
                {plan?.item?.name}
              </h3>
              <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400">
                {plan?.item?.description}
              </p>
              <div className="flex justify-center items-baseline my-8">
                <span className="text-gray-500 text-2xl dark:text-gray-400 mr-1">
                  ₹
                </span>
                <span className="mr-2 text-3xl font-extrabold">
                  {Math.floor(plan.item.amount / 100)}
                </span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <ul role="list" className="mb-8 space-y-4 text-left">
                <li className="flex items-center space-x-3">
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>Individual configuration</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg
                    className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span>No setup, or hidden fees</span>
                </li>
              </ul>
              <Button
                onClick={() => {
                  router.push(`/subscription/subscribe?planId=${plan?.id}`);
                }}
                className="btn btn-sm text-sm"
              >
                Explore
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SubscriptionPlans;
