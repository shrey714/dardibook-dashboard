import React, { useState, FormEvent } from "react";
import {
  PencilSquareIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/24/solid";
import Loader from "@/components/common/Loader";

interface DisplayDiseaseProps {
  handleChange: (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>,
    id: string
  ) => void;
  disease: {
    diseaseDetail: string;
    medicines: [];
    diseaseId: string;
  };
  cancelHandler: any;
  setSearchEnable: any;
  seteditdiseaseData: any;
  editdiseaseeData: any;
  saveHandler: any;
  index: number;
  deleteHandler: any;
  globalClickable:boolean;
  setGlobalClickable:any;
}

const DiseaseRow: React.FC<DisplayDiseaseProps> = ({
  index,
  handleChange,
  disease,
  cancelHandler,
  setSearchEnable,
  seteditdiseaseData,
  saveHandler,
  editdiseaseeData,
  deleteHandler,
  globalClickable,
  setGlobalClickable
}) => {
  const [editable, setEditable] = useState(false);
  const [editLoader, seteditLoader] = useState(false);
  const [deleteLoader, setdeleteLoader] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(true);

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <form
      onSubmit={(e) => {
        submitHandler(e);
      }}
    >
      <div className="grid grid-cols-12 gap-1 w-full mb-1">
        <div className="col-span-1 h-8 md:h-auto flex justify-center items-center bg-white rounded-md">
          {index + 1}
        </div>
        <fieldset
          disabled={!editable}
          className="col-span-9 justify-center items-center"
        >

          <input
            autoFocus={true}
            required
            type="text"
            id={disease.diseaseId}
            name="diseaseDetail"
            className="col-span-6 h-8 md:h-auto w-full disabled:text-gray-500 form-input py-[4px] md:py-1 rounded-md border-gray-200 bg-white text-sm md:text-base font-semibold leading-4 text-gray-700 flex-1 mx-1 text-center"
            value={
              editable ? editdiseaseeData.diseaseDetail : disease.diseaseDetail
            }
            onChange={(e) => {
              handleChange(e, disease.diseaseId);
            }}
          />

        </fieldset>
        <div className="col-span-2 flex justify-center items-center flex-col sm:flex-row gap-1 sm:gap-2">
          <button
            className={`btn btn-square btn-sm animate-none ${
              editable ? "hidden" : ""
            }`}
            disabled={!globalClickable && !editable}
            onClick={() => {
              setEditable(true);
              setGlobalClickable(false);
              setSearchEnable(false);
              seteditdiseaseData(disease);
            }}
          >
            <PencilSquareIcon height={15} width={15} color="black" />
          </button>
          <div className={`dropdown dropdown-end ${editable ? "hidden" : ""}`}>
            <button
              tabIndex={0}
              role="button"
            disabled={!globalClickable && !editable}
              onClick={() => setIsDropdownVisible(true)}
              className="btn btn-sm animate-none btn-square"
            >
              {deleteLoader ? (
                <>
                  <Loader
                    size="small"
                    color="text-error"
                    secondaryColor="text-gray-300"
                  />
                </>
              ) : (
                <TrashIcon height={15} width={15} color="red" />
              )}
            </button>

            {isDropdownVisible && (
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 rounded-md z-[1] w-52 mt-1 p-2 shadow"
              >
                <p className="text-center text-xs sm:text-sm font-medium">
                  Are you sure you want to delete?
                </p>
                <div className="flex gap-2 justify-center items-center mt-1">
                  <button
                    className="btn btn-xs animate-none sm:btn-sm bg-red-400 text-white font-medium hover:bg-red-500"
                    onClick={async () => {
                      setIsDropdownVisible(false);
                      setdeleteLoader(true);
                      await deleteHandler(disease.diseaseId);
                      setdeleteLoader(false);
                    }}
                  >
                    <a>Yes</a>
                  </button>
                  <button
                    className="btn btn-xs animate-none sm:btn-sm bg-gray-300"
                    onClick={() => setIsDropdownVisible(false)}
                  >
                    <a>No</a>
                  </button>
                </div>
              </ul>
            )}
          </div>

          <button
            className={`btn btn-square btn-sm animate-none ${
              !editable ? "hidden" : ""
            }`}
            onClick={async () => {
              seteditLoader(true);
              setGlobalClickable(true);
              await saveHandler(disease.diseaseId);
              seteditLoader(false);
              setEditable(false);
              setSearchEnable(true);
            }}
            type="submit"
            disabled={editLoader}
          >
            {editLoader ? (
              <>
                <Loader
                  size="small"
                  color="text-primary"
                  secondaryColor="text-gray-300"
                />
              </>
            ) : (
              <CheckIcon height={15} width={15} color="black" />
            )}
          </button>

          <button
            className={`btn btn-square btn-sm animate-none ${
              !editable ? "hidden" : ""
            }`}
            onClick={() => {
              cancelHandler(disease.diseaseId);
              setEditable(false);
              setSearchEnable(true);
              setGlobalClickable(true);
            }}
          >
            <XCircleIcon height={15} width={15} color="red" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default DiseaseRow;
