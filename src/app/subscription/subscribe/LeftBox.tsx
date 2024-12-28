import React, { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const LeftBox = ({
  subscriptionFields,
  setsubscriptionFields,
  mobileNumber,
  setmobileNumber,
  isValid,
  setIsValid,
}: any) => {
  const handleMobileNumberChange = (e: { target: { value: string } }) => {
    const value = e.target.value;
    setmobileNumber(value);
  };
  useEffect(() => {
    const regex = /^\d{10}$/;
    setIsValid(regex.test(mobileNumber));
  }, [mobileNumber, setIsValid]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="mt-3 flex flex-col relative">
        <label
          htmlFor="steps-range"
          className="block text-sm font-medium text-left mb-2"
        >
          Select range (*months)
        </label>
        <input
          id="steps-range"
          type="range"
          min="1"
          max="12"
          value={subscriptionFields.total_count}
          onChange={(e) => {
            setsubscriptionFields({
              ...subscriptionFields,
              total_count: e.currentTarget.value,
            });
          }}
          step="1"
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-400 dark:bg-gray-700"
        />
        <div className="flex justify-between mt-2 pl-2">
          <span className="text-sm text-gray-700  dark:text-gray-400">1</span>
          <span className="text-sm hidden md:block text-gray-700 dark:text-gray-400">
            2
          </span>
          <span className="text-sm hidden md:block text-gray-700 dark:text-gray-400">
            3
          </span>
          <span className="text-sm hidden md:block text-gray-700 dark:text-gray-400">
            4
          </span>
          <span className="text-sm hidden md:block text-gray-700 dark:text-gray-400">
            5
          </span>
          <span className="text-sm hidden md:block text-gray-700 dark:text-gray-400">
            6
          </span>
          <span className="text-sm hidden md:block text-gray-700 dark:text-gray-400">
            7
          </span>
          <span className="text-sm hidden md:block text-gray-700 dark:text-gray-400">
            8
          </span>
          <span className="text-sm hidden md:block text-gray-700 dark:text-gray-400">
            9
          </span>
          <span className="text-sm hidden md:block text-gray-700 dark:text-gray-400">
            10
          </span>
          <span className="text-sm hidden md:block text-gray-700 dark:text-gray-400">
            11
          </span>
          <span className="text-sm text-gray-700  dark:text-gray-400">12</span>
        </div>
      </div>

      <div className="flex flex-row mb-2">
        <div className="form-control">
          <div className="py-2">
            <label
              htmlFor="mobile_number_sub"
              className="label-text flex gap-1 text-sm font-medium mb-2"
            >
              Mobile number<p className="text-red-500">*</p>
            </label>
            <div
              className={`flex sm:max-w-md border-2 rounded-lg overflow-hidden ${
                isValid ? "border-green-600" : "border-red-500"
              }`}
            >
              <input
                required
                type="tel"
                name="mobile_number_sub"
                id="mobile_number_sub"
                autoComplete="given-name"
                value={mobileNumber || ""}
                onChange={handleMobileNumberChange}
                maxLength={10}
                className={`form-input bg-secondary w-full ring-0 border-0 outline-none max-w-full h-9 text-sm sm:text-md sm:leading-6 `}
                placeholder="Enter your mobile number"
              />
            </div>
            <p className="font-medium text-sm text-left mt-2">
              * Mobile number linked to your google account. pls provide if not
              available. You will receive payment related information here.
            </p>
          </div>

          <label className="cursor-pointer justify-start flex flex-row gap-2">
            <input
              type="checkbox"
              checked={subscriptionFields.customer_notify}
              onChange={(e) => {
                setsubscriptionFields({
                  ...subscriptionFields,
                  customer_notify: e.currentTarget.checked ? 1 : 1, //temp on always
                });
              }}
              className="checkbox border border-gray-200"
            />
            <span className="label-text text-sm font-medium">
              Get notified about payments
            </span>
          </label>
        </div>
      </div>
      <p className=" ont-medium text-sm text-left mb-2">
        * Your subscription will start immediately after you complete your
        payment.
        <br />* According to your inputs, your subscription will end after
        <span className="inline underline mx-1">
          {` ${subscriptionFields.total_count} `}
        </span>
        months.
      </p>
      <div className="flex flex-col md:self-start">
        <Accordion
          type="single"
          collapsible
          className="border-2 border-gray-400 dark:border-gray-400 px-4 rounded-md"
        >
          <AccordionItem value="item-1" className="border-0">
            <AccordionTrigger className="text-sm font-medium">
              Avail an offer by entering the offerID
            </AccordionTrigger>
            <AccordionContent>
              <input
                disabled
                type="text"
                placeholder="Offer ID"
                className={`form-input bg-secondary w-full rounded border-2 focus:ring-0 max-w-full h-9 text-sm sm:text-md sm:leading-6 `}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default LeftBox;
