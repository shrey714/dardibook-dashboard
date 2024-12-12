import React, { useState, FormEvent } from "react";
import Loader from "@/components/common/Loader";
import { Trash, Pencil, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  cancelHandler: any;
  setSearchEnable: any;
  seteditmedicineData: any;
  editmedicineData: any;
  saveHandler: any;
  index: number;
  deleteHandler: any;
  globalClickable: boolean;
  setGlobalClickable: any;
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

const MedicineRow: React.FC<DisplayMedicineProps> = ({
  handleChange,
  medicine,
  cancelHandler,
  setSearchEnable,
  seteditmedicineData,
  saveHandler,
  editmedicineData,
  index,
  deleteHandler,
  globalClickable,
  setGlobalClickable,
}) => {
  const [editable, setEditable] = useState(false);
  const [editLoader, seteditLoader] = useState(false);
  const [deleteLoader, setdeleteLoader] = useState(false);

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
        <div className="col-span-1 flex justify-center items-center">
          {index + 1}
        </div>
        <fieldset
          disabled={!editable}
          className="col-span-9 sm:grid sm:grid-cols-6 justify-center items-center flex-col sm:flex-row gap-1 sm:gap-2"
        >
          <input
            autoFocus={true}
            required
            type="text"
            id={medicine.id}
            name="medicineName"
            className="col-span-2 disabled:text-gray-500 form-input py-[4px] md:py-1 w-full rounded-md border-border text-sm leading-6 font-medium bg-background flex-1 mx-1 text-center"
            value={
              editable ? editmedicineData.medicineName : medicine.medicineName
            }
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
            value={editable ? editmedicineData.type : medicine.type}
            defaultValue={""}
            className="col-span-2 form-select border rounded-[6px] flex flex-1 py-[0px] sm:py-[5.5px] placeholder:text-gray-400 shadow-sm bg-background border-border focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm leading-6 mx-1 text-center w-full pr-3"
          >
            {medicineTypes.map((type, index) => (
              <option
                key={index}
                value={type.value}
                // selected={type.isDefault || false}
              >
                {type.label}
              </option>
            ))}
          </select>
          <input
            autoFocus={true}
            type="text"
            id={medicine.id}
            name="instruction"
            className="col-span-2 disabled:text-gray-500 form-input py-[4px] md:py-1 w-full rounded-md border-border bg-background text-sm font-medium leading-6 flex-1 mx-1 text-center"
            value={
              editable ? editmedicineData.instruction : medicine.instruction
            }
            onChange={(e) => {
              handleChange(e, medicine.id);
            }}
          />
        </fieldset>
        <div className="col-span-2 flex justify-center items-center flex-col sm:flex-row gap-1 sm:gap-2">
          <Button
            variant={"outline"}
            className={`h-8 w-auto min-w-0 ${editable ? "hidden" : ""}`}
            disabled={!globalClickable && !editable}
            onClick={() => {
              setEditable(true);
              setGlobalClickable(false);
              setSearchEnable(false);
              seteditmedicineData(medicine);
            }}
          >
            <Pencil height={15} width={15} />
          </Button>
          {/* <div className={`dropdown dropdown-end ${editable ? "hidden" : ""}`}>
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
                <Trash height={15} width={15} color="red" />
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
                      await deleteHandler(medicine.id);
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
          </div> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className={`h-8 w-auto min-w-0 ${editable ? "hidden" : ""}`}
                role="button"
                disabled={!globalClickable && !editable}
                variant={"destructive"}
              >
                {deleteLoader ? (
                  <>
                    <Loader
                      size="small"
                    />
                  </>
                ) : (
                  <Trash height={15} width={15} />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>
                Are you sure you want to delete this medicine?
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-1 gap-2 justify-center items-center mt-1">
                  <Button
                    variant={"destructive"}
                    onClick={async () => {
                      setdeleteLoader(true);
                      await deleteHandler(medicine.id);
                      setdeleteLoader(false);
                    }}
                  >
                    <a>Yes</a>
                  </Button>
                  <Button variant={"default"}>
                    <a>No</a>
                  </Button>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            className={`h-8 w-auto min-w-0 ${!editable ? "hidden" : ""}`}
            variant={"default"}
            onClick={async () => {
              seteditLoader(true);
              setGlobalClickable(true);
              await saveHandler(medicine.id);
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
                />
              </>
            ) : (
              <Check height={15} width={15} />
            )}
          </Button>

          <Button
            className={`h-8 w-auto min-w-0 ${!editable ? "hidden" : ""}`}
            variant={"destructive"}
            onClick={() => {
              cancelHandler(medicine.id);
              setEditable(false);
              setSearchEnable(true);
              setGlobalClickable(true);
            }}
          >
            <X height={15} width={15} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default MedicineRow;
