import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import uniqid from "uniqid";
import { addMedicine, delMedicines, getMedicines } from "@/app/services/crudMedicine";
import { useAppSelector } from "@/redux/store";

interface Medicine {
  medicineName: string;
  type: string;
  id: string;
  instruction: string;
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

interface DisplayMedicineProps {
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => void;
  medicine: {
    medicineName: string;
    type: string;
    id: string;
    instruction: string;
  };
  deleteHandler: any;
  cancelHandler: any;
  setSearchEnable: any;
  seteditmedicineData:any;
  editmedicineData:any;
  saveHandler:any;
}

const DisplayMedicine: React.FC<DisplayMedicineProps> = ({
  handleChange,
  medicine,
  deleteHandler,
  cancelHandler,
  setSearchEnable,
  seteditmedicineData,
  saveHandler,
  editmedicineData
}) => {
  const [editable, setEditable] = useState(false);
  const [loader, setloader] = useState(false);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={(e) => {
        submitHandler(e);
      }}
    >
      <div className="grid grid-cols-12 gap-1 w-full my-1">
        <div className="col-span-1 flex justify-center items-center">
          {medicine.id}
        </div>
        <fieldset
          disabled={!editable}
          className="col-span-9 grid grid-cols-6 justify-center items-center"
        >
          <input
            autoFocus={true}
            required
            type="text"
            id={medicine.id}
            name="medicineName"
            className="col-span-6 md:col-span-2 disabled:text-gray-500 form-input py-[4px] md:py-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700 flex-1 mx-1 text-center"
            value={editable?editmedicineData.medicineName:medicine.medicineName}
            onChange={(e) => {
              handleChange(e, medicine.id);
            }}
          />
          <select
            name="type"
            id={medicine.id}
            onChange={(e) => {
              handleChange(e, medicine.id);
            }}
            value={editable?editmedicineData.type:medicine.type}
            className="col-span-6 md:col-span-2 form-select border-0 rounded-[6px] flex flex-1 py-[0px] md:py-[5.5px] text-gray-900 placeholder:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mx-1 text-center w-full pr-3"
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
          <input
            autoFocus={true}
            required
            type="text"
            id={medicine.id}
            name="instruction"
            className="col-span-6 md:col-span-2 disabled:text-gray-500 form-input py-[4px] md:py-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700 flex-1 mx-1 text-center"
            value={editable?editmedicineData.instruction:medicine.instruction}
            onChange={(e) => {
              handleChange(e, medicine.id);
            }}
          />

        </fieldset>
        <div className="col-span-2 flex justify-center items-center flex-col md:flex-row gap-1">
          <button
            className={`btn btn-square btn-sm m-auto ${
              editable ? "hidden" : ""
            }`}
            onClick={() => {
              setEditable(true);
              setSearchEnable(false);
              seteditmedicineData(medicine)
            }}
          >
            <PencilSquareIcon height={15} width={15} color="black" />
          </button>
          <button
            className={`btn btn-square btn-sm m-auto ${
              editable ? "hidden" : ""
            }`}
            onClick={() => {
              deleteHandler(medicine.id);
            }}
          >
            <TrashIcon height={15} width={15} color="red" />
          </button>
          <button
            className={`btn btn-square btn-sm m-auto ${
              !editable ? "hidden" : ""
            }`}
            onClick={() => {
              saveHandler(medicine.id);
              setEditable(false);
              setSearchEnable(true);
            }}
          >
            {loader ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
              </>
            ) : (
              <BookmarkIcon height={15} width={15} color="black" />
            )}
          </button>
          <button
            className={`btn btn-square btn-sm m-auto ${
              !editable ? "hidden" : ""
            }`}
            onClick={() => {
              cancelHandler(medicine.id);
              setEditable(false);
              setSearchEnable(true);
            }}
          >
            <XCircleIcon height={15} width={15} color="red" />
          </button>
        </div>
      </div>
    </form>
  );
};

const MedicineInfo = ({uid}:any) => {
  // from backend
  const mockedMedicines: any[] = [
    {
      id: "1",
      medicineName: "abcabcabcabcabcabcabcabcabc",
      type: "TAB",
      instruction: "kajnfkna",
    },
    {
      id: "2",
      medicineName: "dolo",
      type: "TAB",
      instruction: "vdthsegjkenvfknskrvjnksejnrvkjsnvrkjndx,jvnkxnrg",
    },
    { id: "3", medicineName: "grilinctus", type: "TAB", instruction: "skfjnl" },
    { id: "4", medicineName: "moxikindcv", type: "TAB", instruction: "skfjnl" },
    {
      id: "5",
      medicineName: "amoxiciline",
      type: "TAB",
      instruction: "skfjnl",
    },
    { id: "6", medicineName: "charas", type: "SYRUP", instruction: "skfjnl" },
    { id: "7", medicineName: "ganja", type: "SYRUP", instruction: "skfjnl" },
    { id: "8", medicineName: "vodka", type: "SYRUP", instruction: "skfjnl" },
    { id: "9", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "10", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "11", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "12", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "13", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "14", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "15", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "16", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "17", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "18", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "19", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "20", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "21", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "22", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "23", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "24", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "25", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "26", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "27", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "28", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "29", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "30", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "31", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "32", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
    { id: "33", medicineName: "abc", type: "TAB", instruction: "skfjnl" },
  ];
  const [medFromDb, setmedFromDb] = useState<any>([]);
  const [medicines, setmedicines] = useState<any>([]);
  const [searchMedicine, setsearchMedicine] = useState("");
  const [addLoader, setAddLoader] = useState(false);
  const [searchLoader, setsearchLoader] = useState(true);
  const [searchEnable, setSearchEnable] = useState(true);
  const [medicineData, setmedicineData] = useState<Medicine>({
    medicineName: "",
    type: "Type",
    instruction: "",
    id: uniqid.time(),
  });
  const [editmedicineData, seteditmedicineData] = useState<Medicine>({
    medicineName: "",
    type: "Type",
    instruction: "",
    id: uniqid.time()
  });

  const filteredMedicine = (medicines: any) => {
    return medicines.filter((mname: any) =>
      mname?.medicineName?.includes(searchMedicine)
    );
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
    id: any
  ) => {
    const { name, value } = e.target;
    seteditmedicineData({ ...editmedicineData, [name]: value })
  };

  const saveHandler = async (
    id: any
  ) => {
    // api call
    const data = await addMedicine(editmedicineData,uid);

    setmedFromDb((prev: any) =>
      prev.map((item: any, i: any) =>
        item.id === id ? editmedicineData : item
      )
    );
    console.log(data)
    setmedicines((prev: any) =>
      prev.map((item: any, i: any) =>
        item.id === id ? editmedicineData : item
      )
    );
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setsearchMedicine(value);
  };

  const submitHandler = async (e: { preventDefault: () => void }) => {
    setAddLoader(true);
    e.preventDefault();
    // add patient api
    const data = await addMedicine(medicineData,uid);
    console.log(data);
    setmedicines([...medicines,medicineData]);
    setmedFromDb([...medFromDb,medicineData]);
    setTimeout(() => {
      setAddLoader(false);
      setmedicineData({
        medicineName: "",
        type: "Type",
        id: uniqid.time(),
        instruction: "",
      });
    }, 3000);
  };
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setmedicineData({ ...medicineData, [name]: value });
  };

  const deleteHandler = async(id: any) => {
    // make api call
    await delMedicines(id,uid);
    setmedicines(
      medicines.filter((medicine: { id: any }) => medicine.id != id)
    );
  };

  const cancelHandler = (id: any) => {
    let oldMedicine: any = {};
    medFromDb.forEach((x: any) => {
      if (x.id == id) oldMedicine = x;
    });
    console.log(oldMedicine);
    setmedicines(
      medicines.map((medicine: { id: any }) =>
        medicine.id == id ? oldMedicine : medicine
      )
    );
  };

  const fetchmedicine = async ()=>{
    console.log("hello")
    setsearchLoader(true);
    const data = await getMedicines(uid);
    setmedFromDb(data.data);
      setmedicines(data.data);
    console.log(data);
  }

  useEffect(() => {
    fetchmedicine();
    setTimeout(() => {
      
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
            <div className="menu bg-base-200 text-base-content min-h-full w-full sm:w-[60vw] p-4 relative">
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
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    id="searchQuery"
                    placeholder="Search by ID, Name, or Mobile"
                    value={searchMedicine}
                    onChange={handleFilterChange}
                    className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
                    disabled={!searchEnable}
                  />
                  <label
              htmlFor="my-drawer-4"
              className="drawer-button btn bg-red-500 btn-sm text-sm"
            >
              Close
            </label>
                </div>
              </div>
              <form
                className=" px-3 py-2 md:px-8 flex flex-col md:items-center md:flex-row gap-1"
                onSubmit={submitHandler}
              >
                {/* <form> */}
                {/* <label
          className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
          htmlFor="medicineName"
        >
          Medicine Name
        </label> */}
                <input
                  className="form-input min-h-[2.5rem] py-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700"
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  name="medicineName"
                  id="medicineName"
                  value={medicineData.medicineName}
                />
                {/* <label className="text-xs sm:text-sm font-medium leading-3 text-gray-500">
          Type
        </label> */}
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
                {/* <label
          className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
          htmlFor="medicineName"
        >
          Medicine Name
        </label> */}
                <input
                  className="form-input min-h-[2.5rem] py-2 mt-1 w-full rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700"
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  name="instruction"
                  id="instruction"
                  value={medicineData.instruction}
                />
                <button className="btn btn-square btn-sm m-auto bg-blue-500" type="submit">
                  {addLoader ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <PlusIcon width={20} height={20} color="white"/>
                  )}
                </button>
                {/* </form> */}
              </form>
              {/* diaplay medicine */}
              <div
                className={`w-full h-[calc(100vh-4rem-87.2px)] bg-gray-300 mt-4 rounded-lg overflow-y-auto ${
                  searchLoader || false
                    ? "flex justify-center items-center"
                    : ""
                }`}
              >
                {searchLoader ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : false ? (
                  <p>errormsg</p>
                ) : (
                  <>
                    <div className="mt-4">
                      {filteredMedicine(medicines).map(
                        (medicine: any, index: any) => {
                          return (
                            <DisplayMedicine
                              handleChange={handleChange}
                              medicine={medicine}
                              deleteHandler={deleteHandler}
                              cancelHandler={cancelHandler}
                              setSearchEnable={setSearchEnable}
                              seteditmedicineData={seteditmedicineData}
                              editmedicineData={editmedicineData}
                              saveHandler={saveHandler}
                            />
                          );
                        }
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineInfo;
