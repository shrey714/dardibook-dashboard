import React, { ChangeEvent, useEffect, useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import MedicineRow from "./MedicineRow";
import uniqid from "uniqid";
import {
  addMedicine,
  delMedicines,
  getMedicines,
} from "@/app/services/crudMedicine";
import Loader from "@/components/common/Loader";

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

const MedicineInfo = ({ uid }: any) => {
  const [medFromDb, setmedFromDb] = useState<any>([]);
  const [medicines, setmedicines] = useState<any>([]);
  const [searchMedicine, setsearchMedicine] = useState("");
  const [addLoader, setAddLoader] = useState(false);
  const [searchLoader, setsearchLoader] = useState(true);
  const [searchEnable, setSearchEnable] = useState(true);
  const [duplicate, setduplicate] = useState(false);
  const [medicineData, setmedicineData] = useState<Medicine>({
    medicineName: "",
    type: "Type",
    instruction: "",
    id: uniqid(),
  });
  const [editmedicineData, seteditmedicineData] = useState<Medicine>({
    medicineName: "",
    type: "Type",
    instruction: "",
    id: uniqid(),
  });

  const filteredMedicine = (medicines: any) => {
    return medicines.filter((mname: any) =>
      mname?.medicineName
        ?.toLowerCase()
        ?.includes(searchMedicine?.toLowerCase())
    );
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
    id: any
  ) => {
    const { name, value } = e.target;
    seteditmedicineData({ ...editmedicineData, [name]: value });
  };

  const saveHandler = async (id: any) => {
    await addMedicine(editmedicineData, uid);
    setmedFromDb((prev: any) =>
      prev.map((item: any, i: any) =>
        item.id === id ? editmedicineData : item
      )
    );
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
    e.preventDefault();
    // add patient api
    for (let med of medicines) {
      if (
        med.medicineName + med.type ===
        medicineData.medicineName.trim() + medicineData.type
      ) {
        setduplicate(true);
        setTimeout(() => {
          setduplicate(false);
        }, 2000);
        return;
      }
    }
    setAddLoader(true);
    await addMedicine(medicineData, uid);
    setmedicines([...medicines, medicineData]);
    setmedFromDb([...medFromDb, medicineData]);
    setAddLoader(false);
    setmedicineData({
      medicineName: "",
      type: "Type",
      id: uniqid(),
      instruction: "",
    });
  };
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setmedicineData({ ...medicineData, [name]: value });
  };

  const deleteHandler = async (id: any) => {
    // make api call
    await delMedicines(id, uid);
    setmedicines(
      medicines.filter((medicine: { id: any }) => medicine.id != id)
    );
  };

  const cancelHandler = (id: any) => {
    let oldMedicine: any = {};
    medFromDb.forEach((x: any) => {
      if (x.id == id) oldMedicine = x;
    });
    setmedicines(
      medicines.map((medicine: { id: any }) =>
        medicine.id == id ? oldMedicine : medicine
      )
    );
  };

  useEffect(() => {
    const fetchmedicine = async () => {
      setsearchLoader(true);
      const data = await getMedicines(uid);
      setmedFromDb(data?.data || []);
      setmedicines(data?.data || []);
      setsearchLoader(false);
    };
    fetchmedicine();
  }, [uid]);

  return (
    <div className="mt-3 md:mt-6 mx-auto max-w-4xl bg-white rounded-lg">
      <div className="px-3 py-2 md:px-8 flex justify-between items-center">
        <h3 className="text-sm sm:text-base font-semibold leading-7 text-gray-900 tracking-wide">
          Manage medicines
        </h3>
        <div className="drawer drawer-end w-auto">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label
              htmlFor="my-drawer-4"
              className="drawer-button btn btn-primary btn-sm text-sm"
            >
              <h3 className="font-semibold leading-4 text-white tracking-wide">
                Show
              </h3>
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-4"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="menu bg-base-200 text-base-content h-svh overflow-hidden flex-col w-full md:w-[70vw] lg:w-[60vw] p-4 pt-2 relative">
              {/* Sidebar content here */}
              {/*serach bar */}

              <div className="w-full mb-2 flex justify-end md:justify-start">
                <label
                  htmlFor="my-drawer-4"
                  className="drawer-button btn animate-none btn-circle btn-sm bg-gray-300"
                >
                  <XMarkIcon height={18} width={18} color="red" />
                </label>
              </div>

              <form
                className="px-1 mb-2 py-1 flex flex-col md:items-center md:flex-row gap-1 w-full bg-gray-300 rounded-lg"
                onSubmit={submitHandler}
              >
                <input
                  className="form-input w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  name="medicineName"
                  id="medicineName"
                  placeholder="Medicine name.."
                  required
                  value={medicineData.medicineName}
                />
                <select
                  value={medicineData.type}
                  name="type"
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  className="form-select border-0 rounded-[6px] flex flex-1 py-1.5 text-gray-900 placeholder:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                  className="form-input w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => {
                    handleInputChange(e);
                  }}
                  name="instruction"
                  id="instruction"
                  placeholder="Instruction.."
                  value={medicineData.instruction}
                />
                <div className="dropdown dropdown-end dropdown-open w-fit m-auto">
                  <button
                    tabIndex={0}
                    role="button"
                    className="btn-square animate-none m-auto bg-primary border-0 btn btn-primary btn-sm text-sm"
                    type="submit"
                    disabled={addLoader}
                  >
                    {addLoader ? (
                      <Loader
                        size="small"
                        color="text-primary"
                        secondaryColor="text-gray-300"
                      />
                    ) : (
                      <PlusIcon width={20} height={20} color="white" />
                    )}
                  </button>
                  <div
                    tabIndex={0}
                    className={`dropdown-content rounded-md mt-1 flex flex-col items-center justify-center bg-red-400 text-white font-medium z-[1] w-max py-[6px] px-1 shadow ${
                      duplicate ? "block" : "hidden"
                    }`}
                  >
                    <p className="text-center">Medicine already exists</p>
                  </div>
                </div>
              </form>

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
                    id="searchMedicine"
                    placeholder="Search by medicine name.."
                    value={searchMedicine}
                    onChange={handleFilterChange}
                    className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10"
                    disabled={!searchEnable}
                  />
                </div>
              </div>

              {/* diaplay medicine */}
              <div className="w-full flex flex-col flex-1 bg-gray-300 mt-1 p-2 pb-1 rounded-lg overflow-y-auto">
                {searchLoader ? (
                  <div className="flex flex-1 items-center justify-center">
                    <Loader
                      size="medium"
                      color="text-primary"
                      secondaryColor="text-white"
                    />
                  </div>
                ) : filteredMedicine(medicines).length === 0 ? (
                  <>
                    <div className="flex flex-1 items-center justify-center">
                      empty
                    </div>
                  </>
                ) : (
                  <>
                    {filteredMedicine(medicines).map(
                      (medicine: any, index: any) => {
                        return (
                          <MedicineRow
                            key={index}
                            index={index}
                            handleChange={handleChange}
                            medicine={medicine}
                            cancelHandler={cancelHandler}
                            setSearchEnable={setSearchEnable}
                            seteditmedicineData={seteditmedicineData}
                            editmedicineData={editmedicineData}
                            saveHandler={saveHandler}
                            deleteHandler={deleteHandler}
                          />
                        );
                      }
                    )}
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
