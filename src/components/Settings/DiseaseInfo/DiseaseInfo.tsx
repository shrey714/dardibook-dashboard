import React, { ChangeEvent, useEffect, useState } from "react";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import DiseaseRow from "./DiseaseRow";
import uniqid from "uniqid";
import {
  addDisease,
  delDisease,
  getDiseases,
} from "@/app/services/crudDisease";
import Loader from "@/components/common/Loader";

interface Disease {
  diseaseDetail: string;
  medicines: [];
  diseaseId: string;
}

const DiseaseInfo = ({ uid }: any) => {
  const [disFromDb, setdisFromDb] = useState<any>([]);
  const [diseases, setdiseases] = useState<any>([]);
  const [searchDisease, setsearchDisease] = useState("");
  const [addLoader, setAddLoader] = useState(false);
  const [searchLoader, setsearchLoader] = useState(true);
  const [searchEnable, setSearchEnable] = useState(true);
  const [duplicate, setduplicate] = useState(false);
  const [globalClickable, setGlobalClickable] = useState(true);
  const [diseaseData, setdiseaseData] = useState<Disease>({
    diseaseDetail: "",
    medicines: [],
    diseaseId: uniqid(),
  });
  const [editdiseaseData, seteditdiseaseData] = useState<Disease>({
    diseaseDetail: "",
    medicines: [],
    diseaseId: uniqid(),
  });

  const filteredDIsease = (disease: any) => {
    return disease.filter((dname: any) =>
      dname?.diseaseDetail
        ?.toLowerCase()
        ?.includes(searchDisease?.toLowerCase())
    );
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>,
    id: any
  ) => {
    const { name, value } = e.target;
    seteditdiseaseData({ ...editdiseaseData, [name]: value });
  };

  const saveHandler = async (id: any) => {
    await addDisease(editdiseaseData, uid);
    setdisFromDb((prev: any) =>
      prev.map((item: any, i: any) => (item.id === id ? editdiseaseData : item))
    );
    setdiseases((prev: any) =>
      prev.map((item: any, i: any) => (item.id === id ? editdiseaseData : item))
    );
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setsearchDisease(value);
  };

  const submitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // add patient api
    for (let dis of diseases) {
      if (dis.diseaseDetail === diseaseData.diseaseDetail.trim()) {
        setduplicate(true);
        setTimeout(() => {
          setduplicate(false);
        }, 2000);
        return;
      }
    }
    setAddLoader(true);
    await addDisease(diseaseData, uid);
    setdiseases([...diseases, diseaseData]);
    setdisFromDb([...disFromDb, diseaseData]);
    setAddLoader(false);
    setdiseaseData({
      diseaseDetail: "",
      medicines: [],
      diseaseId: uniqid(),
    });
  };
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setdiseaseData({ ...diseaseData, [name]: value });
  };

  const deleteHandler = async (id: any) => {
    // make api call
    await delDisease(id, uid);
    setdiseases(
      diseases.filter((disease: { diseaseId: any }) => disease.diseaseId != id)
    );
  };

  const cancelHandler = (id: any) => {
    let oldDisease: any = {};
    disFromDb.forEach((x: any) => {
      if (x.id == id) oldDisease = x;
    });
    setdiseases(
      diseases.map((disease: { diseaseId: any }) =>
        disease.diseaseId == id ? oldDisease : disease
      )
    );
  };

  useEffect(() => {
    const fetchdisease = async () => {
      setsearchLoader(true);
      const data = await getDiseases(uid);
      setdisFromDb(data?.data || []);
      setdiseases(data?.data || []);
      setsearchLoader(false);
    };
    fetchdisease();
  }, [uid]);

  return (
    <div className="mt-3 md:mt-6 mx-auto max-w-4xl bg-white rounded-lg">
      <div className="px-3 py-2 md:px-8 flex justify-between items-center">
        <h3 className="text-sm sm:text-base font-semibold leading-7 text-gray-900 tracking-wide">
          Manage diseases
        </h3>
        <div className="drawer drawer-end w-auto static">
          <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label
              htmlFor="my-drawer-5"
              className="drawer-button btn btn-primary btn-sm text-sm"
            >
              <h3 className="font-semibold leading-4 text-white tracking-wide">
                Show
              </h3>
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer-5"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="menu bg-base-200 text-base-content h-svh overflow-hidden flex-col w-full md:w-[70vw] lg:w-[60vw] p-4 pt-2 relative">
              {/* Sidebar content here */}
              {/*serach bar */}

              <div className="w-full mb-2 flex justify-end md:justify-start">
                <label
                  htmlFor="my-drawer-5"
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
                  name="diseaseDetail"
                  id="diseaseDetail"
                  placeholder="Disease name.."
                  required
                  value={diseaseData.diseaseDetail}
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
                    <p className="text-center">Disease already exists</p>
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
                    id="searchDisease"
                    placeholder="Search by disease name.."
                    value={searchDisease}
                    onChange={handleFilterChange}
                    className="form-input bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10"
                    disabled={!searchEnable}
                  />
                </div>
              </div>

              {/* diaplay disease */}
              <div className="w-full flex flex-col flex-1 bg-gray-300 mt-1 p-2 pb-1 rounded-lg overflow-y-auto">
                {searchLoader ? (
                  <div className="flex flex-1 items-center justify-center">
                    <Loader
                      size="medium"
                      color="text-primary"
                      secondaryColor="text-white"
                    />
                  </div>
                ) : filteredDIsease(diseases).length === 0 ? (
                  <>
                    <div className="flex flex-1 items-center justify-center">
                      empty
                    </div>
                  </>
                ) : (
                  <>
                    {filteredDIsease(diseases).map(
                      (disease: any, index: any) => {
                        return (
                          <DiseaseRow
                            key={index}
                            index={index}
                            handleChange={handleChange}
                            disease={disease}
                            cancelHandler={cancelHandler}
                            setSearchEnable={setSearchEnable}
                            seteditdiseaseData={seteditdiseaseData}
                            editdiseaseeData={editdiseaseData}
                            saveHandler={saveHandler}
                            deleteHandler={deleteHandler}
                            globalClickable={globalClickable}
                            setGlobalClickable={setGlobalClickable}
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

export default DiseaseInfo;
