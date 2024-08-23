import React, { ChangeEvent, useEffect, useState } from "react";
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

  // from backend
  const mockedMedicines: any[] = [
    { id: "1", medicineName: "abcabcabcabcabcabcabcabcabc", type: "Tablet" },
    { id: "2", medicineName: "dolo", type: "Tablet" },
    { id: "3", medicineName: "grilinctus", type: "Tablet" },
    { id: "4", medicineName: "moxikindcv", type: "Tablet" },
    { id: "5", medicineName: "amoxiciline", type: "Tablet" },
    { id: "6", medicineName: "charas", type: "Syrup" },
    { id: "7", medicineName: "ganja", type: "Syrup" },
    { id: "8", medicineName: "vodka", type: "Syrup" },
    { id: "9", medicineName: "abc", type: "Tablet" },
    { id: "10", medicineName: "abc", type: "Tablet" },
    { id: "11", medicineName: "abc", type: "Tablet" },
    { id: "12", medicineName: "abc", type: "Tablet" },
    { id: "13", medicineName: "abc", type: "Tablet" },
    { id: "14", medicineName: "abc", type: "Tablet" },
    { id: "15", medicineName: "abc", type: "Tablet" },
    { id: "16", medicineName: "abc", type: "Tablet" },
    { id: "17", medicineName: "abc", type: "Tablet" },
    { id: "18", medicineName: "abc", type: "Tablet" },
    { id: "19", medicineName: "abc", type: "Tablet" },
    { id: "20", medicineName: "abc", type: "Tablet" },
    { id: "21", medicineName: "abc", type: "Tablet" },
    { id: "22", medicineName: "abc", type: "Tablet" },
    { id: "23", medicineName: "abc", type: "Tablet" },
    { id: "24", medicineName: "abc", type: "Tablet" },
    { id: "25", medicineName: "abc", type: "Tablet" },
    { id: "26", medicineName: "abc", type: "Tablet" },
    { id: "27", medicineName: "abc", type: "Tablet" },
    { id: "28", medicineName: "abc", type: "Tablet" },
    { id: "29", medicineName: "abc", type: "Tablet" },
    { id: "30", medicineName: "abc", type: "Tablet" },
    { id: "31", medicineName: "abc", type: "Tablet" },
    { id: "32", medicineName: "abc", type: "Tablet" },
    { id: "33", medicineName: "abc", type: "Tablet" },
  ];
  const [medFromDb, setmedFromDb] = useState<any>([]);
  const [medicines, setmedicines] = useState<any>([]);
  const [seachMedicine, setseachMedicine] = useState("");
  const [addLoader, setAddLoader] = useState(false);
  const [searchLoader, setsearchLoader] = useState(true);
  const [editable, setEditable] = useState(false);
  const [saveLoader, setSaveLoader] = useState(false);
  const [medicineData, setmedicineData] = useState<Medicine>({
    medicineName: "",
    type: "Type",
  });

  const filteredMedicine = (medicines: any) => {
    return medicines.filter((mname: any) =>
      mname.medicineName.includes(seachMedicine)
    );
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setseachMedicine(value);
  };

  const submitHandler = async (e: { preventDefault: () => void }) => {
    setAddLoader(true);
    e.preventDefault();
    // add patient api
    setTimeout(() => {
      setAddLoader(false);
      setmedicineData({
        medicineName: "",
        type: "Type",
      })
    }, 3000);
  };
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setmedicineData({ ...medicineData, [name]: value });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
    index: any
  ) => {
    const { name, value } = e.target;
    console.log(name, value, medicines, index);
    setmedicines((prev: any) =>
      prev.map((item: any, i: any) =>
        i === index ? { ...item, [name]: value } : item
      )
    );
  };

  const saveEditHandler = ()=>{
    if(editable){
      //make save api call
      setSaveLoader(true);
      setTimeout(()=>{
        setSaveLoader(false)
        setEditable(false);
      },3000) 
    }
    else{
      setEditable(true);
    }
  }

  useEffect(() => {
    setsearchLoader(true);
    setTimeout(() => {
      setmedFromDb(mockedMedicines);
      setmedicines(mockedMedicines);
      setsearchLoader(false);
    }, 3000);
  }, []);

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
              className="drawer-button btn btn-primary btn-sm text-sm"
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
            <div className="menu bg-base-200 text-base-content min-h-full w-50 sm:w-80 p-4 relative">
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
                <div className="flex items-center">
                  <input
                    type="text"
                    id="searchQuery"
                    placeholder="Search by ID, Name, or Mobile"
                    value={seachMedicine}
                    onChange={handleFilterChange}
                    className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                    disabled={editable}
                  />
                  <button
                    type="button"
                    className="btn btn-sm mx-1 btn-primary"
                    onClick={saveEditHandler}
                  >
                    {editable ? saveLoader?(<span className="loading loading-spinner loading-sm"></span>):"save" : "Edit"}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-sm mx-1 ${
                      editable ? "block" : "hidden"
                    } btn-error`}
                    onClick={() => {
                      setmedicines(medFromDb);
                      setEditable(false);
                    }}
                  >
                    cancel
                  </button>
                </div>
              </div>
              {/* diaplay medicine */}
              <div
                className={`w-full h-[calc(100vh-3rem-41.6px)] bg-gray-300 mt-4 rounded-lg  ${
                  searchLoader || false ? "flex justify-center items-center" : ""
                }`}
              >
                {searchLoader ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : false?(<p>errormsg</p>):(
                  <>
                    <form>
                      <div className="flex items-center w-full top-0 bg-gray-300 font-bold py-2 rounded-lg">
                        <p className="text-center break-words overflow-hidden flex-1 px-2">
                          Medicine
                        </p>
                        <p className="text-center break-words overflow-hidden flex-1 px-2">
                          Type
                        </p>
                      </div>
                      <fieldset
                        disabled={!editable}
                        className="h-[calc(100vh-6rem-41.6px)] overflow-y-auto"
                      >
                        {filteredMedicine(medicines).map(
                          (medicine: any, index: any) => {
                            return (
                              <div className="grid grid-cols-3 gap-1 w-full my-1">
                                <input
                                  autoFocus={true}
                                  required
                                  type="text"
                                  id={medicine.id}
                                  name="medicineName"
                                  className="col-span-2 disabled:text-gray-500 form-input py-[8.4px] md:py-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700 flex-1 mx-1 text-center"
                                  value={medicine.medicineName}
                                  onChange={(e) => {
                                    handleChange(e, index);
                                  }}
                                />
                                <select
                                  name="type"
                                  id={medicine.id}
                                  onChange={(e) => {
                                    handleChange(e, index);
                                  }}
                                  value={medicine.type}
                                  className="col-span-1 form-select border-0 rounded-[6px] flex flex-1 py-[6px] text-gray-900 placeholder:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mx-1 text-center"
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
                              </div>
                            );
                          }
                        )}
                      </fieldset>
                    </form>
                  </>
                )}
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
