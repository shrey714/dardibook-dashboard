import React from "react";

const LeftBox = ({ subscriptionFields, setsubscriptionFields }: any) => {
  return (
    <div className="flex flex-1 flex-col">
      <div className="my-3 flex flex-col">
        <span className="label-text text-white text-left mb-2">
          Select range (*months)
        </span>
        <input
          type="range"
          min={1}
          max="12"
          className="range range-primary"
          step="1"
          value={subscriptionFields.total_count}
          onChange={(e) => {
            setsubscriptionFields({
              ...subscriptionFields,
              total_count: e.currentTarget.value,
            });
          }}
        />
        <div className="flex w-full justify-between px-2 text-sm mt-2">
          {[1, 6, 12].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-row mb-2">
        <div className="form-control">
          <label className="cursor-pointer label gap-3">
            <input
              type="checkbox"
                checked={subscriptionFields.customer_notify}
              onChange={(e) => {
                setsubscriptionFields({
                  ...subscriptionFields,
                  customer_notify: e.currentTarget.checked ? 1 : 0,
                });
              }}
              className="checkbox checkbox-secondary"
            />
            <span className="label-text text-white">
              Get notified about payments
            </span>
          </label>
        </div>
      </div>
      <p className=" text-gray-500 font-medium text-sm text-left mb-2">
        * Your subscription will start immediately after you complete your
        payment.
        <br />* According to your inputs, your subscription will end after 6
        months.
      </p>
      <div className="mb-2 flex flex-col md:self-start">
        <div className="collapse collapse-arrow border-base-300 border">
          <input type="checkbox" className="min-h-4 h-full" />
          <div className="collapse-title gap-5 text-sm font-medium p-2 min-h-4 no-after-absolute flex flex-row items-center justify-between px-4">
            Avail an offer by entering the offer ID
          </div>
          <div className="collapse-content">
            <input
              type="text"
              placeholder="Offer ID"
              className="input input-bordered input-primary w-full text-black max-w-full h-9 "
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftBox;
