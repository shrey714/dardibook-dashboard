"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { CirclePlus, Download, FileText, SaveIcon } from "lucide-react";
import MedicineRow from "@/components/Settings/MedicineInfo/MedicineRow";
import uniqid from "uniqid";
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
import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Medicine {
  medicineName: string;
  type: string;
  id: string;
  instruction: string;
  searchableString: string;
  active: boolean;
}
export interface FilterCriteria {
  searchTerm: string;
  medicineTypes: string[];
  activeStatus: "all" | "active" | "inactive";
  hasInstructions: "all" | "with" | "without";
  sortBy: "name" | "type" | "recent";
  sortOrder: "asc" | "desc";
}

interface Medicine_Types {
  value: string;
  isDefault: boolean;
}

import { useAuth, useOrganization } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { db } from "@/firebase/firebaseConfig";
import {
  downloadCSV,
  exportMedicinesToCSV,
  generateSampleMedicinesCSV,
} from "@/lib/csv-utils";
import {
  AdvancedFilters,
  applyMedicineFilters,
} from "@/components/Settings/MedicineInfo/MedicineFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { BulkOperations } from "@/components/Settings/MedicineInfo/BulkOperations";
import MedicineImportCSV from "@/components/Settings/MedicineInfo/MedicineImportCSV";

export default function SettingsMedicineInfoPage() {
  const { orgId } = useAuth();
  const { organization, isLoaded } = useOrganization();
  const [medicines, setmedicines] = useState<Medicine[] | null>(null);
  const [addLoader, setAddLoader] = useState(false);

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
        const diseaseDataRef = collection(db, "doctor", orgId, "medicinesData");
        const snapshot = await getDocs(diseaseDataRef);

        if (snapshot.empty) {
          setmedicines([]);
        }
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setmedicines(data as Medicine[]);
      }
    };
    fetchmedicine();
  }, [orgId]);
  // --------------Edit Medicine Data-----------
  const [medicineEditModel, setMedicineEditModel] = useState<boolean>(false);
  const [editForMedicineId, setEditForMedicineId] = useState<string>("");

  const options =
    isLoaded &&
    organization &&
    Array.isArray(organization.publicMetadata.medicine_types)
      ? (organization.publicMetadata.medicine_types as Medicine_Types[])
      : [];
  const defaultType = options.find((t) => t.isDefault)?.value ?? "";
  // -------------Export / Import diseases--------
  // CSV Export functionality
  const handleExportCSV = () => {
    if (!medicines || medicines.length === 0) {
      toast.error("No medicines to export", {
        position: "bottom-right",
      });
      return;
    }

    try {
      const csvContent = exportMedicinesToCSV(medicines);
      const filename = `medicines-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      downloadCSV(csvContent, filename);

      toast.success(`Exported ${medicines.length} medicines to CSV`, {
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export medicines", {
        position: "bottom-right",
      });
    }
  };

  // Download sample CSV
  const handleDownloadSample = () => {
    try {
      const sampleContent = generateSampleMedicinesCSV();
      downloadCSV(sampleContent, "sample-medicines.csv");

      toast.success("Sample CSV downloaded", {
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Sample download error:", error);
      toast.error("Failed to download sample", {
        position: "bottom-right",
      });
    }
  };

  // -------------Advance filtering and searching-----------
  const [filters, setFilters] = useState<FilterCriteria>({
    searchTerm: "",
    medicineTypes: [],
    activeStatus: "all" as "all" | "active" | "inactive",
    hasInstructions: "all" as "all" | "with" | "without",
    sortBy: "name" as "name" | "type" | "recent",
    sortOrder: "asc" as "asc" | "desc",
  });

  const filteredMedicines = medicines
    ? applyMedicineFilters(medicines, filters)
    : [];

  // -------------Bulk Edits----------------
  const [selectedMedicines, setSelectedMedicines] = useState<Set<string>>(
    new Set()
  );

  // Bulk status change handler
  const handleBulkStatusChange = async (
    medicineIds: string[],
    active: boolean
  ) => {
    if (!orgId) return;

    const promises = medicineIds.map(async (id) => {
      await updateDoc(doc(db, "doctor", orgId, "medicinesData", id), {
        active,
      });
    });
    await Promise.all(promises).then(() => {
      setmedicines((prev) =>
        prev
          ? prev.map((m) => (medicineIds.includes(m.id) ? { ...m, active } : m))
          : []
      );
    });
  };

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
        <Card className="2xl:sticky top-20 w-full h-min mx-auto max-w-4xl 2xl:mx-0 2xl:max-w-xl">
          <CardHeader>
            <CardTitle className="font-medium">Add new medicine</CardTitle>
            <CardDescription>
              Add a new medicine with type and optional instructions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitHandler} autoComplete="off">
              <fieldset
                disabled={addLoader}
                className="w-full rounded-lg grid grid-cols-6 gap-4"
              >
                {/* Medicine Name */}
                <div className="col-span-6 sm:col-span-3 2xl:col-span-6 space-y-2">
                  <Label htmlFor="medicineName">Medicine Name</Label>
                  <Input
                    id="medicineName"
                    name="medicineName"
                    placeholder="Medicine name.."
                    required
                  />
                </div>

                {/* Medicine Type */}
                <div className="col-span-6 sm:col-span-3 2xl:col-span-6 space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" defaultValue={defaultType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-96">
                      {options.map((type, index) => (
                        <SelectItem key={index} value={type.value}>
                          {type.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Instruction */}
                <div className="col-span-6 space-y-2">
                  <Label htmlFor="instruction">Instruction</Label>
                  <Input
                    id="instruction"
                    name="instruction"
                    placeholder="Instruction.."
                  />
                </div>

                {/* Submit */}
                <Separator className="w-full col-span-6" />
                <div className="flex col-span-6 w-full items-center justify-end">
                  <Button
                    tabIndex={0}
                    role="button"
                    type="submit"
                    icon={CirclePlus}
                    iconPlacement="right"
                    effect={"ringHover"}
                    loading={addLoader}
                    loadingText="Adding"
                  >
                    Add
                  </Button>
                </div>
              </fieldset>
            </form>
          </CardContent>
        </Card>

        <div className="flex flex-col mt-2 sm:mt-5 2xl:mt-0 mx-auto 2xl:mx-0 max-w-4xl gap-2 w-full">
          {/* CSV Import/Export Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="font-medium">Medicine Management</CardTitle>
              <CardDescription>
                Import and export medicine data using CSV files
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleExportCSV();
                }}
                disabled={!medicines || medicines.length === 0}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                <p className="hidden sm:block">Export CSV</p>
              </Button>
              <MedicineImportCSV
                medicines={medicines}
                setmedicines={setmedicines}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadSample}
                className="gap-2 mr-0 ml-auto"
              >
                <FileText className="h-4 w-4" />
                <p className="hidden sm:block">Download Sample</p>
              </Button>
            </CardContent>
          </Card>

          {/* Advanced Filters */}
          <AdvancedFilters
            medicines={medicines || []}
            filters={filters}
            onFiltersChange={setFilters}
          />

          {/* Bulk Operations */}
          {medicines && medicines.length > 0 && (
            <BulkOperations
              medicines={filteredMedicines}
              selectedMedicines={selectedMedicines}
              onSelectionChange={setSelectedMedicines}
              onBulkStatusChange={handleBulkStatusChange}
            />
          )}

          {/* diaplay medicine */}
          <div className="w-full bg-card flex flex-col flex-1 border rounded-md">
            {medicines === null ? (
              <div className="w-full divide-y rounded-md overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`grid grid-cols-12 gap-1 w-full p-2 sm:p-4 ${
                      i !== 0 ? "border-t" : "border-0"
                    }`}
                  >
                    <div className="col-span-1 flex justify-start items-center">
                      <Skeleton className="size-4 rounded-sm" />
                    </div>

                    <div className="col-span-3 h-auto flex flex-col justify-start items-start">
                      <Skeleton className="w-32 h-4" />
                      <Skeleton className="w-16 h-3 mt-1" />
                    </div>

                    <div className="col-span-2">
                      <Skeleton className="w-14 h-5" />
                    </div>

                    <div className="col-span-5 h-auto flex flex-col justify-start items-start">
                      <Skeleton className="w-32 h-4" />
                      <Skeleton className="w-16 h-3 mt-1" />
                    </div>

                    <div className="col-span-1 flex justify-center items-center">
                      <Skeleton className="size-9" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMedicines.length === 0 ? (
              <div className="flex flex-1 items-center justify-center text-muted-foreground min-h-72">
                No medicine data available
              </div>
            ) : (
              <>
                {filteredMedicines.map((medicine: Medicine, index: number) => {
                  return (
                    <MedicineRow
                      key={index}
                      index={index}
                      medicine={medicine}
                      setMedicineEditModel={setMedicineEditModel}
                      setEditForMedicineId={setEditForMedicineId}
                      isSelected={selectedMedicines.has(medicine.id)}
                      onSelectionChange={(selected) => {
                        const newSelection = new Set(selectedMedicines);
                        if (selected) {
                          newSelection.add(medicine.id);
                        } else {
                          newSelection.delete(medicine.id);
                        }
                        setSelectedMedicines(newSelection);
                      }}
                    />
                  );
                })}
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
  const { organization, isLoaded } = useOrganization();

  const options =
    isLoaded &&
    organization &&
    Array.isArray(organization.publicMetadata.medicine_types)
      ? (organization.publicMetadata.medicine_types as Medicine_Types[])
      : [];

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
          <DialogTitle className="font-medium">
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
            className="w-full rounded-lg grid grid-cols-6 gap-4"
          >
            <div className="col-span-6 space-y-2">
              <Label htmlFor="medicineName">Medicine Name</Label>
              <Input
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
            <div className="col-span-6 space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                name="type"
                defaultValue={
                  medicines?.find(
                    (medicine) => medicine.id === editForMedicineId
                  )?.type
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type..." />
                </SelectTrigger>
                <SelectContent className="max-h-96">
                  {options.map((type, index) => (
                    <SelectItem key={index} value={type.value}>
                      {type.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-6 space-y-2">
              <Label htmlFor="instruction">Instruction</Label>
              <Input
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
                      ? "!bg-primary !text-primary-foreground !hover:bg-primary/90"
                      : "!bg-destructive !text-destructive-foreground hover:!bg-destructive/90"
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
                type="submit"
                icon={SaveIcon}
                iconPlacement="right"
                loading={updateLoader}
                loadingText={"Updating"}
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
