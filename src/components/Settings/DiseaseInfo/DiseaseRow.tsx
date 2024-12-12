import React, { useState, FormEvent } from "react";
import { Trash, Pencil, X, Check } from "lucide-react";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  globalClickable: boolean;
  setGlobalClickable: any;
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
        <div className="col-span-1 h-8 md:h-auto flex justify-center items-center">
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
            className="col-span-6 h-8 md:h-auto w-full disabled:text-gray-500 form-input py-[4px] md:py-1 rounded-md border-border bg-background text-sm md:text-base font-normal leading-4 flex-1 mx-1"
            value={
              editable ? editdiseaseeData.diseaseDetail : disease.diseaseDetail
            }
            onChange={(e) => {
              handleChange(e, disease.diseaseId);
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
              seteditdiseaseData(disease);
            }}
          >
            <Pencil height={15} width={15} />
          </Button>

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
                Are you sure you want to delete this disease?
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-1 gap-2 justify-center items-center mt-1">
                  <Button
                    variant={"destructive"}
                    onClick={async () => {
                      setdeleteLoader(true);
                      await deleteHandler(disease.diseaseId);
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
              cancelHandler(disease.diseaseId);
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

export default DiseaseRow;
