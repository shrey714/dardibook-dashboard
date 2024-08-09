import React, { useState } from "react";

const ReceiptForm: React.FC<any> = ({ receiptInfo, setReceiptInfo }: any) => {
  const handleInputChange = (
    index: number,
    field: "title" | "amount",
    value: string
  ) => {
    const updatedParticulars = [...receiptInfo.particulars];
    updatedParticulars[index] = {
      ...updatedParticulars[index],
      [field]: value,
    };

    setReceiptInfo({
      ...receiptInfo,
      particulars: updatedParticulars,
      totalAmount: calculateTotalAmount(updatedParticulars),
    });
  };

  // Add a new entry to the particulars array
  const addParticular = () => {
    setReceiptInfo({
      ...receiptInfo,
      particulars: [...receiptInfo.particulars, { title: "", amount: "" }],
    });
  };

  // Remove a particular entry
  const removeParticular = (index: number) => {
    const updatedParticulars = receiptInfo.particulars.filter(
      (_: any, i: number) => i !== index
    );
    setReceiptInfo({
      ...receiptInfo,
      particulars: updatedParticulars,
      totalAmount: calculateTotalAmount(updatedParticulars),
    });
  };

  // Calculate total amount from the particulars array
  const calculateTotalAmount = (particulars: { amount: string }[]) => {
    return particulars
      .reduce((total, particular) => {
        const amount = parseFloat(particular.amount) || 0;
        return total + amount;
      }, 0)
      .toFixed(2); // Adjust to fixed decimal places if needed
  };

  return (
    <div className="mt-4 sm:mt-6 col-span-full bg-white p-4 px-8 rounded-lg">
      <label className="block text-lg font-semibold leading-7 text-gray-900">
        Receipt Details
      </label>

      {receiptInfo.particulars.map((particular: any, index: number) => (
        <div
          key={index}
          className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 text-right"
        >
          <div className="sm:col-span-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="text"
              required
              name={`title-${index}`}
              id={`title-${index}`}
              autoComplete="off"
              placeholder="Title*"
              className="form-input block font-medium w-full flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              value={particular.title}
              onChange={(e) =>
                handleInputChange(index, "title", e.target.value)
              }
            />
          </div>
          <div className="sm:col-span-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md mt-2 sm:mt-0">
            <input
              type="text"
              name={`amount-${index}`}
              id={`amount-${index}`}
              autoComplete="off"
              placeholder="Amount"
              className="form-input block w-full flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              value={particular.amount}
              onChange={(e) =>
                handleInputChange(index, "amount", e.target.value)
              }
            />
          </div>
          <button
            type="button"
            onClick={() => removeParticular(index)}
            className="text-red-500 ml-4 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addParticular}
        className="mt-4 bg-gray-300 text-gray-900 font-medium py-2 text-sm px-4 rounded"
      >
        Add More
      </button>

      <div className="mt-4 text-right text-gray-900">
        <strong>Total Amount: </strong>
        {receiptInfo.totalAmount}
      </div>
    </div>
  );
};

export default ReceiptForm;
