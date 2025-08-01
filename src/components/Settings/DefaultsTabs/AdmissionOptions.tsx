"use client";

import React, { FormEvent, useEffect, useState } from "react";
import {
  AlertTriangle,
  Bed,
  CirclePlus,
  InboxIcon,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
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

import { useAuth, useOrganization } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { updateBedDefaults } from "@/app/dashboard/settings/defaults/_actions";
import { useBedsStore } from "@/lib/stores/useBedsStore";
import { Skeleton } from "@/components/ui/skeleton";
import CreatableSelect from "react-select/creatable";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BedInfo } from "@/types/FormTypes";

export const AdmissionOptions = () => {
  const { orgId } = useAuth();
  const { organization, isLoaded } = useOrganization();
  const [clerkBeds, setClerkBeds] = useState<BedInfo[]>([]);
  const [addLoader, setAddLoader] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [bedEditModel, setBedEditModel] = useState<boolean>(false);
  const [editForBedId, setEditForBedId] = useState<string>("");
  const { beds, loading } = useBedsStore((state) => state);

  useEffect(() => {
    if (isLoaded && organization && organization.publicMetadata.beds) {
      setClerkBeds(organization.publicMetadata.beds as BedInfo[]);
    } else {
      setClerkBeds([]);
    }
  }, [isLoaded, orgId, organization]);

  // --------------add new receipt type-----------
  const AddNewBed = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!organization) return;

    const form = e.target as HTMLFormElement;
    const newBed: BedInfo = {
      bed_id: form.bed_id.value.trim(),
      ward: form.ward.value.trim(),
    };

    if (
      clerkBeds.find(
        (bed) =>
          bed.bed_id.toLowerCase() === form.bed_id.value.trim().toLowerCase()
      )
    ) {
      toast.error(
        `Bed with id ${form.bed_id.value.trim().toLowerCase()} already exists`
      );
      return;
    }

    setAddLoader(true);
    toast.promise(
      async () => {
        await updateBedDefaults(clerkBeds.concat(newBed)).then(
          () => {
            organization.reload();
            setAddLoader(false);
            form.reset();
          },
          (error) => {
            console.error("Operation failed. Please try again : ", error);
            setAddLoader(false);
          }
        );
      },
      {
        loading: "Adding new bed...",
        success: "Bed added successfully",
        error: "Error adding bed",
      },
      {
        position: "bottom-right",
      }
    );
  };
  // --------------update receipt-----------
  const UpdateBed = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!organization) return;

    const form = e.target as HTMLFormElement;
    const existingbed: BedInfo = {
      bed_id: editForBedId,
      ward: form.ward.value.trim(),
    };

    setUpdateLoader(true);
    toast.promise(
      async () => {
        await updateBedDefaults(
          clerkBeds.map((clerkBed) =>
            clerkBed.bed_id === editForBedId ? existingbed : clerkBed
          )
        ).then(
          () => {
            organization.reload();
            setUpdateLoader(false);
            setBedEditModel(false);
          },
          (error) => {
            console.error("Operation failed. Please try again : ", error);
            setUpdateLoader(false);
          }
        );
      },
      {
        loading: "Updating bed...",
        success: "Bed updated successfully",
        error: "Error updating bed",
      },
      {
        position: "bottom-right",
      }
    );
  };
  // --------------delete receipt-----------
  const DeleteBed = async () => {
    setDeleteLoader(true);
    if (!organization) return;
    toast.promise(
      async () => {
        await updateBedDefaults(
          clerkBeds.filter((clerkBed) => clerkBed.bed_id !== editForBedId)
        ).then(
          () => {
            organization.reload();
            setDeleteLoader(false);
            setBedEditModel(false);
          },
          (error) => {
            console.error("Operation failed. Please try again : ", error);
            setDeleteLoader(false);
          }
        );
      },
      {
        loading: "Removing bed...",
        success: "Receipt type removed successfully",
        error: "Error removing bed",
      },
      {
        position: "bottom-right",
      }
    );
  };

  const getStatusColor = (status: string) => {
    return status === "occupied"
      ? "bg-red-500/20 text-red-600 hover:text-accent-foreground hover:bg-red-500/40"
      : "bg-green-500/20 text-green-600 hover:text-accent-foreground hover:bg-green-500/40";
  };

  const getBedStatus = (bed_id: string) => {
    const assignedPatient = beds.find((bed) => bed.bedId === bed_id);
    return assignedPatient ? "occupied" : "available";
  };

  const groupBedsByWard = clerkBeds.reduce<Record<string, BedInfo[]>>(
    (acc, bed) => {
      if (!acc[bed.ward]) {
        acc[bed.ward] = [];
      }
      acc[bed.ward].push(bed);
      return acc;
    },
    {}
  );

  return (
    <>
      <Dialog open={bedEditModel} onOpenChange={setBedEditModel}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-medium">Edit Bed</DialogTitle>
            <DialogDescription>
              Modify details for{" "}
              {
                clerkBeds?.find((clerkBed) => clerkBed.bed_id === editForBedId)
                  ?.bed_id
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={UpdateBed} autoComplete="off">
            <fieldset
              disabled={updateLoader || deleteLoader}
              className="w-full rounded-lg space-y-4"
            >
              <div className="w-full space-y-2">
                <Label htmlFor="ward">Ward</Label>

                <CreatableSelect
                  name="ward"
                  id="ward"
                  className="h-min w-full block bg-transparent"
                  backspaceRemovesValue={true}
                  defaultValue={{
                    label: clerkBeds?.find(
                      (clerkBed) => clerkBed.bed_id === editForBedId
                    )?.ward,
                    value: clerkBeds?.find(
                      (clerkBed) => clerkBed.bed_id === editForBedId
                    )?.ward,
                  }}
                  options={[
                    ...new Set(clerkBeds.map((clerkBed) => clerkBed.ward)),
                  ]
                    .sort()
                    .map((val) => ({
                      label: val,
                      value: val,
                    }))}
                  placeholder="e.g., General"
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  isClearable
                  required
                  classNames={{
                    control: (state) =>
                      `!shadow-sm !transition-all !duration-900 !rounded-md !h-9 !min-h-9 !bg-transparent dark:!bg-input/30 ${
                        state.isFocused
                          ? "!border-ring !ring-ring/50 !ring-[3px]"
                          : "!border-border"
                      }`,
                    placeholder: () =>
                      "!truncate !text-sm sm:!text-base !px-4 !text-muted-foreground",
                    singleValue: () => "!text-primary !px-4",
                    input: () => "!text-inherit !px-4",
                    menu: () =>
                      `!border-border !overflow-hidden !shadow-md !text-black !w-full !bg-popover !border !text-primary`,
                    menuList: () => "!py-1 md:!py-2",
                    option: (state) =>
                      `bg-background p-2 border-0 text-base hover:cursor-pointer ${
                        state.isFocused && !state.isSelected
                          ? "!bg-secondary"
                          : ""
                      } ${state.isSelected ? "" : "hover:!bg-secondary"}`,
                  }}
                />
              </div>

              <Separator className="w-full" />
              <div className="flex w-full items-center justify-between">
                <Button
                  role="button"
                  variant={"destructive"}
                  type="button"
                  disabled={!!beds.find((bed) => bed.bedId === editForBedId)}
                  onClick={DeleteBed}
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

              {!!beds.find((bed) => bed.bedId === editForBedId) ? (
                <div className="space-y-3 w-full">
                  <div className="p-3 bg-yellow-500/20 rounded-lg border border-yellow-800 flex flex-row gap-3 items-start">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600" />
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-yellow-600 leading-tight">
                        Warning: Bed Occupied
                      </p>
                      <p className="text-sm text-yellow-600 leading-none">
                        This bed is currently assigned to a patient.
                      </p>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      <strong>Reason:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>
                        This bed is either occupied or scheduled for a patient.
                      </li>
                      <li>Please make the bed available before deletion.</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 w-full">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> The bed is currently unoccupied and
                    can be safely deleted. This action cannot be undone.
                  </p>
                </div>
              )}
            </fieldset>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="border-b-0 rounded-b-none w-full h-min mx-auto">
        <CardHeader>
          <CardTitle className="font-medium">Add New Bed</CardTitle>
          <CardDescription>
            Add, edit and remove beds with ward assignments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={AddNewBed} autoComplete="off">
            <fieldset
              disabled={addLoader}
              className="w-full rounded-lg grid grid-cols-6 gap-4"
            >
              <div className="col-span-6 sm:col-span-3 space-y-2">
                <Label htmlFor="bed_id">Bed Number/ID</Label>
                <Input
                  name="bed_id"
                  id="bed_id"
                  placeholder="e.g., Bed 01"
                  required
                  pattern=".*\S.*"
                  title="Should not empty"
                />
              </div>

              <div className="col-span-6 sm:col-span-3 space-y-2">
                <Label htmlFor="ward">Ward</Label>
                <CreatableSelect
                  name="ward"
                  id="ward"
                  className="h-min w-full block bg-transparent"
                  backspaceRemovesValue={true}
                  options={[
                    ...new Set(clerkBeds.map((clerkBed) => clerkBed.ward)),
                  ]
                    .sort()
                    .map((val) => ({
                      label: val,
                      value: val,
                    }))}
                  placeholder="e.g., General"
                  components={{
                    IndicatorSeparator: () => null,
                  }}
                  isClearable
                  required
                  autoFocus={false}
                  classNames={{
                    control: (state) =>
                      `!shadow-sm !transition-all !duration-900 !rounded-md !h-9 !min-h-9 !bg-transparent dark:!bg-input/30 ${
                        state.isFocused
                          ? "!border-ring !ring-ring/50 !ring-[3px]"
                          : "!border-border"
                      }`,
                    placeholder: () =>
                      "!truncate !text-sm sm:!text-base !px-4 !text-muted-foreground",
                    singleValue: () => "!text-primary !px-4",
                    input: () => "!text-inherit !px-4",
                    menu: () =>
                      `!border-border !overflow-hidden !shadow-md !text-black !w-full !bg-popover !border !text-primary`,
                    menuList: () => "!py-1 md:!py-2",
                    option: (state) =>
                      `bg-background p-2 border-0 text-base hover:cursor-pointer ${
                        state.isFocused && !state.isSelected
                          ? "!bg-secondary"
                          : ""
                      } ${state.isSelected ? "" : "hover:!bg-secondary"}`,
                  }}
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
      <div className="rounded-t-none w-full flex flex-col flex-1 bg-card border border-t-0 rounded-xl">
        {!isLoaded || loading ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 p-2">
            {[...Array(16)].map((_, index) => (
              <Skeleton className="h-14" key={index} />
            ))}
          </div>
        ) : clerkBeds.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-muted-foreground min-h-60">
            <InboxIcon />
          </div>
        ) : (
          Object.entries(groupBedsByWard).map(([wardName, bedsInWard]) => (
            <div key={wardName}>
              <h3 className="text-sm py-1 px-2 bg-muted/50 text-muted-foreground leading-none">
                {wardName}
              </h3>

              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 px-2 py-3">
                {bedsInWard.map((clerkBed, index) => {
                  const status = getBedStatus(clerkBed.bed_id);
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setBedEditModel(true);
                        setEditForBedId(clerkBed.bed_id);
                      }}
                      className={`
                    relative h-auto flex flex-col items-center justify-center gap-1 p-2 text-xs transition-all duration-200 hover:shadow-md ${getStatusColor(
                      status
                    )}
                  `}
                    >
                      <Bed className="h-3 w-3" />
                      <span className="font-medium line-clamp-1 truncate w-full">
                        {clerkBed.bed_id}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};
