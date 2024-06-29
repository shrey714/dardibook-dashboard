import React from "react";
const RightBox = ({
  thisPlanDetails,
  handleSubscription,
  subscriptionFields,
}: any) => {
  return (
    <>
      <div className="flex flex-col ">
        <h3 className="mb-4 text-2xl font-semibold">
          {thisPlanDetails?.item.name}
        </h3>
        <p className="font-light text-gray-500 dark:text-gray-400">
          {thisPlanDetails?.item.description}
        </p>
        <div className="flex justify-center items-baseline my-8">
          <span className="text-gray-500 text-2xl dark:text-gray-400 mr-1">
            ₹
          </span>
          <span className="mr-2 text-3xl font-extrabold">
            {Math.floor(thisPlanDetails?.item.amount / 100)}
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
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
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
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span>No setup, or hidden fees</span>
          </li>
        </ul>
        <button
          onClick={() => {
            handleSubscription();
          }}
          className="btn btn-sm text-base"
        >
          Get started
        </button>
      </div>
    </>
  );
};

export default RightBox;
