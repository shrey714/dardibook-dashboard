import React, { ChangeEvent, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import DiseaseRow from "./DiseaseRow";
import uniqid from "uniqid";
import {
  addDisease,
  delDisease,
  getDiseases,
} from "@/app/services/crudDisease";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
    console.log(id);
    const { name, value } = e.target;
    seteditdiseaseData({ ...editdiseaseData, [name]: value });
  };

  const saveHandler = async (id: any) => {
    await addDisease(editdiseaseData, uid);
    setdisFromDb((prev: any) =>
      prev.map((item: any) => (item.id === id ? editdiseaseData : item))
    );
    setdiseases((prev: any) =>
      prev.map((item: any) => (item.id === id ? editdiseaseData : item))
    );
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setsearchDisease(value);
  };

  const submitHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    // add patient api
    for (const dis of diseases) {
      if (dis.diseaseDetail === diseaseData.diseaseDetail.trim()) {
        toast.error("Disease already exists!", {
          duration: 2000,
          position: "top-right",
        });
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
    <div className="mx-auto max-w-4xl bg-gradient-to-b from-muted/50 to-muted border-2 rounded-lg">
      <div className="px-3 py-2 md:px-8 flex justify-between items-center">
        <h3 className="text-sm sm:text-base font-medium leading-7 tracking-wide">
          Manage diseases
        </h3>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open</Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col w-full md:w-[70vw] lg:w-[60vw] p-3 gap-0">
            <SheetHeader>
              <SheetTitle>Manage diseases</SheetTitle>
              <SheetDescription hidden>DESC</SheetDescription>
            </SheetHeader>

            <form
              className="px-1 mb-2 py-1 flex flex-col md:items-center md:flex-row gap-1 w-full bg-secondary rounded-lg mt-2"
              onSubmit={submitHandler}
            >
              <input
                className="form-input w-full block bg-background rounded-md border-0 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={(e) => {
                  handleInputChange(e);
                }}
                name="diseaseDetail"
                id="diseaseDetail"
                placeholder="Disease name.."
                required
                value={diseaseData.diseaseDetail}
              />
              <Button
                tabIndex={0}
                role="button"
                variant={"outline"}
                className="m-auto text-sm"
                type="submit"
                disabled={addLoader}
              >
                {addLoader ? (
                  <Loader size="small" />
                ) : (
                  <Plus width={20} height={20} />
                )}
              </Button>
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
                  className="form-input bg-secondary border border-border text-sm rounded-lg block w-full pl-10"
                  disabled={!searchEnable}
                />
              </div>
            </div>

            {/* diaplay disease */}
            <div className="w-full flex flex-col flex-1 bg-secondary mt-1 p-2 pb-1 rounded-lg overflow-y-auto">
              {searchLoader ? (
                <div className="flex flex-1 items-center justify-center">
                  <Loader size="medium" />
                </div>
              ) : filteredDIsease(diseases).length === 0 ? (
                <>
                  <div className="flex flex-1 items-center justify-center">
                    empty
                  </div>
                </>
              ) : (
                <>
                  {filteredDIsease(diseases).map((disease: any, index: any) => {
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
                  })}
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default DiseaseInfo;
