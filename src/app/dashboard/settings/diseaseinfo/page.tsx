"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { CirclePlus } from "lucide-react";
import DiseaseRow from "@/components/Settings/DiseaseInfo/DiseaseRow";
import uniqid from "uniqid";
import { getDiseases } from "@/app/services/crudDisease";
import Loader from "@/components/common/Loader";
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

interface Disease {
  diseaseDetail: string;
  medicines: string[];
  diseaseId: string;
  searchableString: string;
}

export default function SettingsDiseaseInfoPage() {
  const { orgId } = useAuth();

  const [diseases, setdiseases] = useState<Disease[] | null>(null);
  const [searchDisease, setsearchDisease] = useState("");
  const [addMedicinesData, setAddMedicinesData] = useState<string[]>([]);
  const [addLoader, setAddLoader] = useState(false);
  // --------------disease filter--------------
  const filteredDIsease = (disease: any) => {
    return disease
      .sort((a: Disease, b: Disease) =>
        a.diseaseDetail.localeCompare(b.diseaseDetail)
      )
      .filter((dname: any) =>
        dname?.diseaseDetail
          ?.toLowerCase()
          ?.includes(searchDisease?.toLowerCase())
      );
  };
  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setsearchDisease(value);
  };
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
        const data = await getDiseases(orgId);
        if (data?.data) {
          setdiseases(data?.data);
        } else {
          setdiseases(null);
        }
      }
    };
    fetchdisease();
  }, [orgId]);
  // --------------Edit Disease Data-----------
  const [diseaseEditModel, setDiseaseEditModel] = useState<boolean>(false);
  const [editForDiseaseId, setEditForDiseaseId] = useState<string>("");
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
        <Card className="bg-sidebar/70 w-full shadow-none border h-min mx-auto max-w-4xl 2xl:mx-0 2xl:max-w-xl">
          <CardHeader className="border-b p-4">
            <CardTitle className="font-normal text-muted-foreground">
              Add new disease
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
                    htmlFor="diseaseDetail"
                    className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                  >
                    Disease Name
                  </label>
                  <input
                    className="h-min mt-1 form-input w-full block bg-background rounded-md border-border py-1.5 shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    name="diseaseDetail"
                    id="diseaseDetail"
                    placeholder="Disease Name.."
                    required
                  />
                </div>
                <div className="col-span-6 sm:col-span-3 2xl:col-span-6">
                  <label
                    htmlFor="medicines"
                    className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
                  >
                    Medicines
                  </label>
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
                        "w-full rounded-md bg-background text-sm font-normal h-min border mt-1 shadow-sm",
                    }}
                    // defaultOptions={OPTIONS}
                    placeholder="Add Medicines.."
                    className={`border-none h-min`}
                    badgeClassName="text-sm p-0"
                    loadingIndicator={
                      <p className="py-1 text-center text-base text-muted-foreground">
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
          {/* search disease */}
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
                id="searchDisease"
                placeholder="Search by disease name.."
                value={searchDisease}
                onChange={handleFilterChange}
                className="form-input bg-transparent border border-border text-sm rounded-lg block w-full pl-10"
              />
            </div>
          </div>

          {/* diaplay disease */}
          <div className="w-full flex flex-col flex-1 bg-sidebar/70 border rounded-md">
            {diseases === null ? (
              <div className="flex flex-1 items-center justify-center min-h-72 w-full">
                <Loader size="medium" />
              </div>
            ) : filteredDIsease(diseases).length === 0 ? (
              <>
                <div className="flex flex-1 items-center justify-center text-muted-foreground min-h-72">
                  No disease data available
                </div>
              </>
            ) : (
              <>
                {filteredDIsease(diseases).map((disease: any, index: any) => {
                  return (
                    <DiseaseRow
                      key={index}
                      index={index}
                      disease={disease}
                      setDiseaseEditModel={setDiseaseEditModel}
                      setEditForDiseaseId={setEditForDiseaseId}
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
    setUpdateLoader(true);
    if (orgId) {
      toast.promise(
        async () => {
          await deleteDoc(
            doc(db, "doctor", orgId, "diseaseData", editForDiseaseId)
          ).then(
            () => {
              setUpdateLoader(false);
              setdiseases(
                (diseases ?? []).filter(
                  (disease) => disease.diseaseId !== editForDiseaseId
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
          <DialogTitle>
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
            disabled={updateLoader}
            className="w-full rounded-lg grid grid-cols-6 gap-1 md:gap-4"
          >
            <div className="col-span-6">
              <label
                htmlFor="diseaseDetail"
                className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
              >
                Disease Name
              </label>
              <input
                className="h-min mt-1 form-input w-full block bg-background rounded-md border-border py-1.5 shadow-sm placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
            <div className="col-span-6">
              <label
                htmlFor="medicines"
                className="text-xs sm:text-sm font-medium leading-3 text-gray-500"
              >
                Medicines
              </label>
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
                  className:
                    "w-full rounded-md bg-background text-sm font-normal h-min border mt-1 shadow-sm",
                }}
                // defaultOptions={OPTIONS}
                placeholder="Add Medicines.."
                className={`border-none h-min`}
                badgeClassName="text-sm p-0"
                loadingIndicator={
                  <p className="py-1 text-center text-base text-muted-foreground">
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
                className="text-sm gap-2 px-6"
                type="button"
                onClick={deleteDisease}
              >
                Delete
              </Button>
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
