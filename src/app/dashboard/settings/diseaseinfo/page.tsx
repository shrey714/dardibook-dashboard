"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  CirclePlus,
  Download,
  FileText,
  InboxIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
import DiseaseRow from "@/components/Settings/DiseaseInfo/DiseaseRow";
import uniqid from "uniqid";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/Settings/DiseaseInfo/MedicineMultipleSelector";
import { Separator } from "@/components/ui/separator";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  downloadCSV,
  exportDiseasesToCSV,
  generateSampleCSV,
} from "@/lib/csv-utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AdvancedFilters,
  applyDiseaseFilters,
} from "@/components/Settings/DiseaseInfo/DiseaseFilters";
import DiseaseImportCSV from "@/components/Settings/DiseaseInfo/DiseaseImportCSV";
import { BulkOperations } from "@/components/Settings/DiseaseInfo/BulkOperations";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export interface Disease {
  diseaseDetail: string;
  medicines: string[];
  diseaseId: string;
  searchableString: string;
}

export interface FilterCriteria {
  searchTerm: string;
  medicineCountMin: number | null;
  medicineCountMax: number | null;
  specificMedicines: string[];
  sortBy: "name" | "medicineCount";
  sortOrder: "asc" | "desc";
}

export default function SettingsDiseaseInfoPage() {
  const { orgId } = useAuth();

  const [diseases, setdiseases] = useState<Disease[] | null>(null);
  const [addMedicinesData, setAddMedicinesData] = useState<string[]>([]);
  const [addLoader, setAddLoader] = useState(false);
  // --------------new disease form handeler-----------
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newDiseaseDetail = form.diseaseDetail.value.trim() as string;
    const newDisease: Disease = {
      diseaseDetail: newDiseaseDetail.trim(),
      medicines: addMedicinesData,
      diseaseId: uniqid(),
      searchableString: newDiseaseDetail.toLowerCase().trim(),
    };

    for (const dis of diseases ?? []) {
      if (
        dis.diseaseDetail.toLowerCase() ===
        newDiseaseDetail.toLowerCase().trim()
      ) {
        toast.error("Disease already exists!", {
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
            doc(db, "doctor", orgId, "diseaseData", newDisease.diseaseId),
            newDisease
          ).then(
            () => {
              setAddLoader(false);
              form.reset();
              setAddMedicinesData([]);
              setdiseases([...(diseases ?? []), newDisease]);
            },
            () => {
              setAddLoader(false);
            }
          );
        },
        {
          loading: "Adding...",
          success: "New Disease Added",
          error: "Failed to add new disease",
        },
        {
          position: "bottom-right",
        }
      );
    }
  };

  useEffect(() => {
    const fetchdisease = async () => {
      if (orgId) {
        const diseaseDataRef = collection(db, "doctor", orgId, "diseaseData");
        const snapshot = await getDocs(diseaseDataRef);

        if (snapshot.empty) {
          setdiseases([]);
        }
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setdiseases(data as Disease[]);
      }
    };
    fetchdisease();
  }, [orgId]);
  // --------------Edit Disease Data-----------
  const [diseaseEditModel, setDiseaseEditModel] = useState<boolean>(false);
  const [editForDiseaseId, setEditForDiseaseId] = useState<string>("");

  // -------------Export / Import diseases--------
  const handleExportCSV = (diseasesToExport: Disease[] | null) => {
    if (!diseasesToExport || diseasesToExport.length === 0) {
      toast.error("No diseases to export", {
        position: "bottom-right",
      });
      return;
    }

    try {
      const csvContent = exportDiseasesToCSV(diseasesToExport);
      const filename = `diseases-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      downloadCSV(csvContent, filename);

      toast.success(`Exported ${diseasesToExport.length} diseases to CSV`, {
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export diseases", {
        position: "bottom-right",
      });
    }
  };

  const handleDownloadSample = () => {
    try {
      const sampleContent = generateSampleCSV();
      downloadCSV(sampleContent, "sample-diseases.csv");

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
    medicineCountMin: null,
    medicineCountMax: null,
    specificMedicines: [],
    sortBy: "name",
    sortOrder: "asc",
  });
  const filteredDiseases = diseases
    ? applyDiseaseFilters(diseases, filters)
    : [];

  // -------------Bulk Edits----------------
  const [selectedDiseases, setSelectedDiseases] = useState<Set<string>>(
    new Set()
  );

  const handleBulkDelete = async (diseaseIds: string[]) => {
    if (!orgId) return;

    const promises = diseaseIds.map(async (id) => {
      await deleteDoc(doc(db, "doctor", orgId, "diseaseData", id));
    });

    await Promise.all(promises).then(() => {
      setdiseases((prev) =>
        prev ? prev.filter((d) => !diseaseIds.includes(d.diseaseId)) : []
      );
    });
  };

  return (
    <>
      <EditDiseaseDataModel
        diseaseEditModel={diseaseEditModel}
        setDiseaseEditModel={setDiseaseEditModel}
        editForDiseaseId={editForDiseaseId}
        diseases={diseases}
        setdiseases={setdiseases}
      />
      <div className="w-full py-2 sm:py-5 px-2 md:px-5 2xl:flex 2xl:flex-row 2xl:gap-5 2xl:justify-center">
        <Card className="2xl:sticky top-20 w-full h-min mx-auto max-w-4xl 2xl:mx-0 2xl:max-w-xl">
          <CardHeader>
            <CardTitle className="font-medium">Add new disease</CardTitle>
            <CardDescription>
              Add a disease and associate relevant medicines for quick access.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitHandler} autoComplete="off">
              <fieldset
                disabled={addLoader}
                className="w-full rounded-lg grid grid-cols-6 gap-4"
              >
                <div className="col-span-6 sm:col-span-3 2xl:col-span-6 space-y-2">
                  <Label htmlFor="diseaseDetail">Disease Name</Label>
                  <Input
                    name="diseaseDetail"
                    id="diseaseDetail"
                    placeholder="Disease Name.."
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3 2xl:col-span-6 space-y-2">
                  <Label htmlFor="medicines">Medicines</Label>
                  <MultipleSelector
                    value={addMedicinesData.map((medicine) => ({
                      label: medicine,
                      value: medicine,
                    }))}
                    onChange={(option) => {
                      setAddMedicinesData(
                        option.map((medicine) => medicine.value)
                      );
                    }}
                    onSearch={async (value) => {
                      const querySnapshot = await getDocs(
                        query(
                          collection(
                            db,
                            "doctor",
                            orgId || "",
                            "medicinesData"
                          ),
                          where("active", "!=", false),
                          where("searchableString", ">=", value.toLowerCase()),
                          where(
                            "searchableString",
                            "<=",
                            value.toLowerCase() + "\uf8ff"
                          )
                        )
                      );

                      return querySnapshot.docs.map((doc) => ({
                        label: doc.data().medicineName,
                        value: doc.data().id,
                      }));
                    }}
                    inputProps={{
                      name: "medicines",
                      id: "medicines",
                    }}
                    commandProps={{
                      className:
                        "w-full rounded-md text-sm font-normal min-h-9",
                    }}
                    // defaultOptions={OPTIONS}
                    placeholder="Search Medicines.."
                    className={`min-h-9`}
                    badgeClassName="text-sm"
                    loadingIndicator={
                      <p className="py-2 text-center text-base text-muted-foreground">
                        loading...
                      </p>
                    }
                    emptyIndicator={
                      <p className="w-full text-center text-base text-muted-foreground">
                        no medicines found.
                      </p>
                    }
                  />
                </div>

                <Separator className="w-full col-span-6" />
                <div className="flex col-span-6 w-full items-center justify-end">
                  <Button
                    tabIndex={0}
                    role="button"
                    type="submit"
                    effect={"ringHover"}
                    icon={CirclePlus}
                    iconPlacement="right"
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
              <CardTitle className="font-medium">Disease Management</CardTitle>
              <CardDescription>
                Import and export disease data using CSV files
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleExportCSV(diseases);
                }}
                disabled={!diseases || diseases.length === 0}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                <p className="hidden sm:block">Export CSV</p>
              </Button>
              <DiseaseImportCSV diseases={diseases} setdiseases={setdiseases} />
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

          {/* search/filter disease */}
          <AdvancedFilters
            diseases={diseases || []}
            filters={filters}
            onFiltersChange={setFilters}
          />

          {/* Bulk Operations */}
          {diseases && diseases.length > 0 && (
            <BulkOperations
              diseases={filteredDiseases}
              selectedDiseases={selectedDiseases}
              onSelectionChange={setSelectedDiseases}
              onBulkDelete={handleBulkDelete}
            />
          )}

          {/* diaplay disease */}
          <div className="w-full flex flex-col flex-1 bg-card border rounded-md">
            {diseases === null ? (
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

                    <div className="col-span-7 w-full text-sm h-min flex flex-wrap gap-2">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Skeleton key={index} className="w-24 h-7" />
                      ))}
                    </div>

                    <div className="col-span-1 flex justify-center items-center">
                      <Skeleton className="size-9" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredDiseases.length === 0 ? (
              <>
                <div className="flex flex-1 items-center justify-center text-muted-foreground min-h-72 gap-2 flex-col">
                  <InboxIcon />
                  No disease data available
                </div>
              </>
            ) : (
              <>
                {filteredDiseases.map((disease: Disease, index: number) => {
                  return (
                    <DiseaseRow
                      key={index}
                      index={index}
                      disease={disease}
                      setDiseaseEditModel={setDiseaseEditModel}
                      setEditForDiseaseId={setEditForDiseaseId}
                      isSelected={selectedDiseases.has(disease.diseaseId)}
                      onSelectionChange={(selected) => {
                        const newSelection = new Set(selectedDiseases);
                        if (selected) {
                          newSelection.add(disease.diseaseId);
                        } else {
                          newSelection.delete(disease.diseaseId);
                        }
                        setSelectedDiseases(newSelection);
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

interface DisplayEditDiseaseProps {
  diseaseEditModel: boolean;
  setDiseaseEditModel: React.Dispatch<React.SetStateAction<boolean>>;
  editForDiseaseId: string;
  diseases: Disease[] | null;
  setdiseases: React.Dispatch<React.SetStateAction<Disease[] | null>>;
}

const EditDiseaseDataModel: React.FC<DisplayEditDiseaseProps> = ({
  diseaseEditModel,
  setDiseaseEditModel,
  editForDiseaseId,
  diseases,
  setdiseases,
}) => {
  const { orgId } = useAuth();
  const [updateMedicinesData, setUpdateMedicinesData] = useState<string[]>([]);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);

  useEffect(() => {
    setUpdateMedicinesData(
      diseases?.find((disease) => disease.diseaseId === editForDiseaseId)
        ?.medicines ?? []
    );
  }, [diseases, editForDiseaseId]);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newDiseaseDetail = form.diseaseDetail.value.trim() as string;
    const newDisease: Disease = {
      diseaseDetail: newDiseaseDetail,
      medicines: updateMedicinesData,
      diseaseId: editForDiseaseId,
      searchableString: newDiseaseDetail.toLowerCase(),
    };
    for (const dis of diseases as Disease[]) {
      if (
        dis.diseaseDetail.toLowerCase() === newDiseaseDetail.toLowerCase() &&
        dis.diseaseId !== editForDiseaseId
      ) {
        toast.error("Disease already exists!", {
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
            doc(db, "doctor", orgId, "diseaseData", editForDiseaseId),
            newDisease
          ).then(
            () => {
              setUpdateLoader(false);
              setdiseases(
                (diseases ?? []).map((disease) =>
                  disease.diseaseId === editForDiseaseId ? newDisease : disease
                )
              );
              setDiseaseEditModel(false);
            },
            () => {
              setUpdateLoader(false);
            }
          );
        },
        {
          loading: "Updating...",
          success: "Disease updated",
          error: "Failed to update disease",
        },
        {
          position: "bottom-right",
        }
      );
    }
  };

  const deleteDisease = async () => {
    if (orgId) {
      setDeleteLoader(true);
      toast.promise(
        async () => {
          await deleteDoc(
            doc(db, "doctor", orgId, "diseaseData", editForDiseaseId)
          ).then(
            () => {
              setDeleteLoader(false);
              setdiseases(
                (diseases ?? []).filter(
                  (disease) => disease.diseaseId !== editForDiseaseId
                )
              );
              setDiseaseEditModel(false);
            },
            () => {
              setDeleteLoader(false);
            }
          );
        },
        {
          loading: "Deleting...",
          success: "Disease deleted",
          error: "Failed to delete disease",
        },
        {
          position: "bottom-right",
        }
      );
    }
  };

  return (
    <Dialog open={diseaseEditModel} onOpenChange={setDiseaseEditModel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-medium">
            {
              diseases?.find(
                (disease) => disease.diseaseId === editForDiseaseId
              )?.diseaseDetail
            }
          </DialogTitle>
          <DialogDescription>{editForDiseaseId}</DialogDescription>
        </DialogHeader>

        <form onSubmit={submitHandler} autoComplete="off">
          <fieldset
            disabled={updateLoader || deleteLoader}
            className="w-full rounded-lg grid grid-cols-6 gap-4"
          >
            <div className="col-span-6 space-y-2">
              <Label htmlFor="diseaseDetail">Disease Name</Label>
              <Input
                name="diseaseDetail"
                id="diseaseDetail"
                placeholder="Disease Name.."
                defaultValue={
                  diseases?.find(
                    (disease) => disease.diseaseId === editForDiseaseId
                  )?.diseaseDetail
                }
                required
              />
            </div>
            <div className="col-span-6 space-y-2">
              <Label htmlFor="medicines">Medicines</Label>
              <MultipleSelector
                value={updateMedicinesData.map((medicine) => ({
                  label: medicine,
                  value: medicine,
                }))}
                onChange={(option) => {
                  setUpdateMedicinesData(
                    option.map((medicine) => medicine.value)
                  );
                }}
                onSearch={async (value) => {
                  const querySnapshot = await getDocs(
                    query(
                      collection(db, "doctor", orgId || "", "medicinesData"),
                      where("active", "!=", false),
                      where("searchableString", ">=", value.toLowerCase()),
                      where(
                        "searchableString",
                        "<=",
                        value.toLowerCase() + "\uf8ff"
                      )
                    )
                  );

                  return querySnapshot.docs.map((doc) => ({
                    label: doc.data().medicineName,
                    value: doc.data().id,
                  }));
                }}
                inputProps={{
                  name: "medicines",
                  id: "medicines",
                }}
                commandProps={{
                  className: "w-full rounded-md text-sm font-normal min-h-9",
                }}
                // defaultOptions={OPTIONS}
                placeholder="Search Medicines.."
                className={`min-h-9`}
                badgeClassName="text-sm"
                loadingIndicator={
                  <p className="py-2 text-center text-base text-muted-foreground">
                    loading...
                  </p>
                }
                emptyIndicator={
                  <p className="w-full text-center text-base text-muted-foreground">
                    no medicines found.
                  </p>
                }
              />
            </div>

            <Separator className="w-full col-span-6" />
            <div className="flex col-span-6 w-full items-center justify-between">
              <Button
                role="button"
                variant={"destructive"}
                type="button"
                onClick={deleteDisease}
                icon={Trash2Icon}
                iconPlacement="right"
                loading={deleteLoader}
                loadingText={"Deleting"}
              >
                Delete
              </Button>
              <Button
                tabIndex={0}
                role="button"
                variant={"outline"}
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
