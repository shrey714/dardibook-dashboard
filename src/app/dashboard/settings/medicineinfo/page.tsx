"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { CirclePlus } from "lucide-react";
import MedicineRow from "@/components/Settings/MedicineInfo/MedicineRow";
import uniqid from "uniqid";
import { getMedicines } from "@/app/services/crudMedicine";
import Loader from "@/components/common/Loader";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Medicine {
  medicineName: string;
  type: string;
  id: string;
  instruction: string;
  searchableString: string;
  active: boolean;
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
import { useAuth } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { db } from "@/firebase/firebaseConfig";

export default function SettingsMedicineInfoPage() {
  const { orgId } = useAuth();
  const [medicines, setmedicines] = useState<Medicine[] | null>(null);
  const [searchMedicine, setsearchMedicine] = useState("");
  const [addLoader, setAddLoader] = useState(false);
  // --------------medicine filter--------------
  const filteredMedicine = (medicines: any) => {
    return medicines
      .sort((a: Medicine, b: Medicine) =>
        a.medicineName.localeCompare(b.medicineName)
      )
      .filter((mname: any) =>
        mname?.medicineName
          ?.toLowerCase()
          ?.includes(searchMedicine?.toLowerCase())
      );
  };
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setsearchMedicine(value);
  };
  // --------------new medicine form handeler-----------
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newMedicine: Medicine = {
      medicineName: form.medicineName.value,
      type: form.type.value,
      id: uniqid(),
      instruction: form.instruction.value,
      searchableString: form.medicineName.value.toLowerCase(),
      active: true,
    };

    for (const med of medicines ?? []) {
      if (
        med.medicineName.toLowerCase() + med.type ===
        form.medicineName.value.toLowerCase().trim() + form.type.value
      ) {
        toast.error("Medicine already exists!", {
          duration: 2000,
          position: "bottom-right",
        });
        return;
      }
    }

    setAddLoader(true);
    if (orgId) {
      toast.promise(
        async () => {
          await setDoc(
            doc(db, "doctor", orgId, "medicinesData", newMedicine.id),
            newMedicine
          ).then(
            () => {
              setAddLoader(false);
              form.reset();
              setmedicines([...(medicines ?? []), newMedicine]);
            },
            () => {
              setAddLoader(false);
            }
          );
        },
        {
          loading: "Adding...",
          success: "New Medicine Added",
          error: "Failed to add new medicine",
        },
        {
          position: "bottom-right",
        }
      );
    }
  };

  useEffect(() => {
    const fetchmedicine = async () => {
      if (orgId) {
        const data = await getMedicines(orgId);
        if (data?.data) {
          setmedicines(data?.data);
        } else {
          setmedicines(null);
        }
      }
    };
    fetchmedicine();
  }, [orgId]);
  // --------------Edit Medicine Data-----------
  const [medicineEditModel, setMedicineEditModel] = useState<boolean>(false);
  const [editForMedicineId, setEditForMedicineId] = useState<string>("");
  return (
    <>
      <EditMedicineDataModel
        medicineEditModel={medicineEditModel}
        setMedicineEditModel={setMedicineEditModel}
        editForMedicineId={editForMedicineId}
        medicines={medicines}
        setmedicines={setmedicines}
      />
      <div className="w-full py-2 sm:py-5 px-2 md:px-5 2xl:flex 2xl:flex-row 2xl:gap-5 2xl:justify-center">
        <Card className="bg-sidebar/70 w-full shadow-none border h-min mx-auto max-w-4xl 2xl:mx-0 2xl:max-w-xl">
          <CardHeader className="border-b p-4">
            <CardTitle className="font-normal text-muted-foreground">
              Add new medicine
            </CardTitle>
            <CardDescription hidden></CardDescription>
          </CardHeader>
          <CardContent className="py-4 px-3 md:px-8">
            <form onSubmit={submitHandler} autoComplete="off">
              <fieldset
                disabled={addLoader}
                className="w-full rounded-lg grid grid-cols-6 gap-1 md:gap-4"
              >
                <div className="col-span-6 sm:col-span-3 2xl:col-span-6">
                  <label
                    htmlFor="medicineName"
                    className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                  >
                    Medicine Name
                  </label>
                  <input
                    className="h-min mt-1 form-input w-full block bg-background rounded-md border-border py-1.5 shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    name="medicineName"
                    id="medicineName"
                    placeholder="Medicine name.."
                    required
                  />
                </div>

                <div className="col-span-6 sm:col-span-3 2xl:col-span-6">
                  <label
                    htmlFor="type"
                    className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                  >
                    Type
                  </label>
                  <select
                    name="type"
                    id="type"
                    defaultValue={""}
                    className="h-min mt-1 form-select w-full border-border rounded-md py-1.5 placeholder:text-gray-400 shadow-sm bg-background focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    {medicineTypes.map((type, index) => (
                      <option key={index} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-6">
                  <label
                    htmlFor="instruction"
                    className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                  >
                    Instruction
                  </label>
                  <input
                    className="h-min mt-1 form-input w-full block bg-background rounded-md border-border py-1.5 shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    name="instruction"
                    id="instruction"
                    placeholder="Instruction.."
                  />
                </div>

                <Separator className="w-full col-span-6" />
                <div className="flex col-span-6 w-full items-center justify-end">
                  <Button
                    tabIndex={0}
                    role="button"
                    variant={"outline"}
                    className="text-sm gap-2 px-6"
                    type="submit"
                  >
                    <CirclePlus width={20} height={20} /> Add
                  </Button>
                </div>
              </fieldset>
            </form>
          </CardContent>
        </Card>

        <div className="flex flex-col mt-2 sm:mt-5 2xl:mt-0 mx-auto 2xl:mx-0 max-w-4xl gap-2 w-full">
          <div className="relative w-full md:w-3/4">
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
                className="form-input bg-transparent border border-border text-sm rounded-lg block w-full pl-10"
              />
            </div>
          </div>

          {/* diaplay medicine */}
          <div className="w-full flex flex-col flex-1 bg-sidebar/70 border rounded-md">
            {medicines === null ? (
              <div className="flex flex-1 items-center justify-center min-h-72 w-full">
                <Loader size="medium" />
              </div>
            ) : filteredMedicine(medicines).length === 0 ? (
              <div className="flex flex-1 items-center justify-center text-muted-foreground min-h-72">
                No medicine data available
              </div>
            ) : (
              <>
                {filteredMedicine(medicines).map(
                  (medicine: any, index: any) => {
                    return (
                      <MedicineRow
                        key={index}
                        index={index}
                        medicine={medicine}
                        setMedicineEditModel={setMedicineEditModel}
                        setEditForMedicineId={setEditForMedicineId}
                      />
                    );
                  }
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

interface EditMedicineDataModel {
  medicineEditModel: boolean;
  setMedicineEditModel: React.Dispatch<React.SetStateAction<boolean>>;
  editForMedicineId: string;
  medicines: Medicine[] | null;
  setmedicines: React.Dispatch<React.SetStateAction<Medicine[] | null>>;
}

const EditMedicineDataModel: React.FC<EditMedicineDataModel> = ({
  medicineEditModel,
  setMedicineEditModel,
  editForMedicineId,
  medicines,
  setmedicines,
}) => {
  const { orgId } = useAuth();
  const [updateLoader, setUpdateLoader] = useState(false);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newMedicine: Medicine = {
      medicineName: form.medicineName.value,
      type: form.type.value,
      id: editForMedicineId,
      instruction: form.instruction.value,
      searchableString: form.medicineName.value.toLowerCase(),
      active: medicines?.find((medicine) => medicine.id === editForMedicineId)
        ?.active
        ? true
        : false,
    };

    for (const med of medicines ?? []) {
      if (
        med.medicineName.toLowerCase() + med.type ===
          form.medicineName.value.toLowerCase().trim() + form.type.value &&
        med.id !== editForMedicineId
      ) {
        toast.error("Medicine already exists!", {
          duration: 2000,
          position: "bottom-right",
        });
        return;
      }
    }

    setUpdateLoader(true);
    if (orgId) {
      toast.promise(
        async () => {
          await setDoc(
            doc(db, "doctor", orgId, "medicinesData", editForMedicineId),
            newMedicine
          ).then(
            () => {
              setUpdateLoader(false);
              setmedicines(
                (medicines ?? []).map((medicine) =>
                  medicine.id === editForMedicineId ? newMedicine : medicine
                )
              );
              setMedicineEditModel(false);
            },
            () => {
              setUpdateLoader(false);
            }
          );
        },
        {
          loading: "Updating...",
          success: "Medicine updated",
          error: "Failed to update medicine",
        },
        {
          position: "bottom-right",
        }
      );
    }
  };

  const changeMedicineStatus = async (status: boolean) => {
    setUpdateLoader(true);
    if (orgId) {
      toast.promise(
        async () => {
          await updateDoc(
            doc(db, "doctor", orgId, "medicinesData", editForMedicineId),
            { active: status }
          ).then(
            () => {
              setUpdateLoader(false);
              setmedicines(
                (medicines ?? []).filter(
                  (medicine) => medicine.id !== editForMedicineId
                )
              );
              setmedicines(
                (medicines ?? []).map((medicine) =>
                  medicine.id === editForMedicineId
                    ? { ...medicine, active: status }
                    : medicine
                )
              );
            },
            () => {
              setUpdateLoader(false);
            }
          );
        },
        {
          loading: "Updating...",
          success: "Medicine status updated",
          error: "Failed to update medicine status",
        },
        {
          position: "bottom-right",
        }
      );
    }
  };

  return (
    <Dialog open={medicineEditModel} onOpenChange={setMedicineEditModel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {
              medicines?.find((medicine) => medicine.id === editForMedicineId)
                ?.medicineName
            }
          </DialogTitle>
          <DialogDescription>{editForMedicineId}</DialogDescription>
        </DialogHeader>

        <form onSubmit={submitHandler} autoComplete="off">
          <fieldset
            disabled={updateLoader}
            className="w-full rounded-lg grid grid-cols-6 gap-1 md:gap-4"
          >
            <div className="col-span-6">
              <label
                htmlFor="medicineName"
                className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
              >
                Medicine Name
              </label>
              <input
                className="h-min mt-1 form-input w-full block bg-background rounded-md border-border py-1.5 shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                name="medicineName"
                id="medicineName"
                placeholder="Medicine Name.."
                defaultValue={
                  medicines?.find(
                    (medicine) => medicine.id === editForMedicineId
                  )?.medicineName
                }
                required
              />
            </div>
            <div className="col-span-6">
              <label
                htmlFor="type"
                className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
              >
                Type
              </label>
              <select
                name="type"
                id="type"
                defaultValue={
                  medicines?.find(
                    (medicine) => medicine.id === editForMedicineId
                  )?.type
                }
                className="h-min mt-1 form-select w-full border-border rounded-md py-1.5 placeholder:text-gray-400 shadow-sm bg-background focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                {medicineTypes.map((type, index) => (
                  <option key={index} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-6">
              <label
                htmlFor="instruction"
                className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
              >
                Instruction
              </label>
              <input
                className="h-min mt-1 form-input w-full block bg-background rounded-md border-border py-1.5 shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                name="instruction"
                id="instruction"
                placeholder="Instruction..."
                defaultValue={
                  medicines?.find(
                    (medicine) => medicine.id === editForMedicineId
                  )?.instruction
                }
              />
            </div>

            <Separator className="w-full col-span-6" />
            <div className="flex col-span-6 w-full items-center justify-between">
              <Select
                onValueChange={(value) => {
                  changeMedicineStatus(value === "active" ? true : false);
                }}
                value={
                  medicines?.find(
                    (medicine) => medicine.id === editForMedicineId
                  )?.active ?? true === true
                    ? "active"
                    : "inactive"
                }
              >
                <SelectTrigger
                  className={`w-min px-4 gap-2 border-0 shadow-sm ${
                    medicines?.find(
                      (medicine) => medicine.id === editForMedicineId
                    )?.active ?? true
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-destructive text-destructive-foreground hover:bg-destructive/90 "
                  }`}
                >
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">InActive</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <Button
                tabIndex={0}
                role="button"
                variant={"outline"}
                className="text-sm gap-2 px-6"
                type="submit"
              >
                Update
              </Button>
            </div>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
};
