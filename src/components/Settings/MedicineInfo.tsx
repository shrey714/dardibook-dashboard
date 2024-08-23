import React, { ChangeEvent, useState } from "react";
import Link from "next/link";
import { PlusIcon } from "@heroicons/react/24/solid";

const MedicineInfo = () => {
  interface Medicine {
    medicineName: string;
    type: string;
  }
  const medicineTypes = [
    { label: "Type", value: "", isDefault: true },
    { label: "Tablet", value: "TAB" },
    { label: "Capsule", value: "CAP" },
    { label: "Syrup", value: "SYRUP" },
    { label: "Drop", value: "DROP" },
    { label: "Cream", value: "CREAM" },
    { label: "Lotion", value: "LOTION" },
    { label: "Serum", value: "SERUM" },
    { label: "Soap", value: "SOAP" },
    { label: "Spray", value: "SPRAY" },
    { label: "Gel", value: "GEL" },
    { label: "Ointment", value: "OINTMENT" },
    { label: "Inhaler", value: "INHALER" },
    { label: "Injection", value: "INJECTION" },
    { label: "Powder", value: "POWDER" },
    { label: "Patch", value: "PATCH" },
    { label: "Suppository", value: "SUPPOSITORY" },
  ];

  const medicines = [
    { medicineName: "abcabcabcabcabcabcabcabcabc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
    { medicineName: "abc", type: "Tablet" },
  ];
  const [addLoader, setAddLoader] = useState(false);
  const [medicineData, setmedicineData] = useState<Medicine>({
    medicineName: "",
    type: "Type",
  });
  const submitHandler = async (e: { preventDefault: () => void }) => {
    setAddLoader(true);
    e.preventDefault();
    // add patient api
    setTimeout(() => {
      setAddLoader(false);
    }, 3000);
  };
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setmedicineData({ ...medicineData, [name]: value });
  };
  return (
    <div className="mt-3 md:mt-6 mx-auto max-w-4xl bg-white rounded-lg">
      <div className="px-3 py-2 md:px-8 flex justify-between items-center">
        <h3 className="text-sm sm:text-base font-semibold leading-7 text-gray-900 tracking-wide">
          Medicine Info
        </h3>
        <div className="drawer drawer-end w-auto">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn btn-primary"
            >
              Open drawer
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4 relative">
              {/* Sidebar content here */}
              {/*serach bar */}
              
              <div className="relative w-full">
                <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="searchQuery"
                  placeholder="Search by ID, Name, or Mobile"
                  // value={searchQuery}
                  // onChange={handleFilterChange}
                  className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                />
              </div>
              {/* diaplay medicine */}
              <div className="w-full h-[calc(100vh-6rem)] bg-gray-300 mt-4 rounded-lg overflow-y-auto">
                <div className="flex items-center w-full sticky top-0 bg-gray-300 font-bold py-2">
                  <p className="w-full text-center text-wrap flex-1">
                    Medicine Name
                  </p>
                  <p className="w-full text-center text-wrap flex-1">Type</p>
                </div>
                {medicines.map((medicine) => {
                  return (
                    <div className="flex items-center w-full">
                      <p className="w-full text-center text-wrap flex-1">
                        {medicine.medicineName}
                      </p>
                      <p className="w-full text-center text-wrap flex-1">
                        {medicine.type}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <form
        className="border-t-4 md:border-t-[6px] border-gray-300 px-3 py-2 md:px-8 flex flex-col md:items-center md:flex-row gap-3 md:gap-8"
        onSubmit={submitHandler}
      >
        {/* <form> */}
        <label
          className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
          htmlFor="medicineName"
        >
          Medicine Name
        </label>
        <input
          className="form-input min-h-[2.5rem] py-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700"
          onChange={(e) => {
            handleInputChange(e);
          }}
          name="medicineName"
          id="medicineName"
          value={medicineData.medicineName}
        />
        <label className="text-xs sm:text-sm font-medium leading-3 text-gray-500">
          Type
        </label>
        <select
          value={medicineData.type}
          name="type"
          onChange={(e) => {
            handleInputChange(e);
          }}
          className="form-select border-0 rounded-[6px] flex flex-1 py-1 text-gray-900 placeholder:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          {medicineTypes.map((type, index) => (
            <option
              key={index}
              value={type.value}
              selected={type.isDefault || false}
            >
              {type.label}
            </option>
          ))}
        </select>
        <button className="btn btn-square btn-sm m-auto" type="submit">
          {addLoader ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <PlusIcon width={20} height={20} />
          )}
        </button>
        {/* </form> */}
      </form>
    </div>
  );
};

export default MedicineInfo;
