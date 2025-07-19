"use client";

import React, { FormEvent, useEffect, useState } from "react";
import {
  CirclePlus,
  InboxIcon,
  Pencil,
  PlusIcon,
  SaveIcon,
  Settings2Icon,
  StarIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
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
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { useOrganization } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { ReceiptDetails } from "@/types/FormTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  updateMedicineTypesDefaults,
  updatePrescriptionReceiptDefaults,
} from "@/app/dashboard/settings/defaults/_actions";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";

export const PrescriptionOptions = () => {
  return (
    <>
      <PrescriptionReceiptType />
      <MedicineTypes />
    </>
  );
};

const PrescriptionReceiptType = () => {
  const { organization, isLoaded } = useOrganization();
  const [receipts, setReceipts] = useState<ReceiptDetails[]>([]);
  const [addLoader, setAddLoader] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [receiptEditModel, setReceiptEditModel] = useState<boolean>(false);
  const [editForReceiptId, setEditForReceiptId] = useState<string>("");

  useEffect(() => {
    if (
      isLoaded &&
      organization &&
      organization.publicMetadata.prescription_receipt_types
    ) {
      setReceipts(
        organization.publicMetadata
          .prescription_receipt_types as ReceiptDetails[]
      );
    } else {
      setReceipts([]);
    }
  }, [isLoaded, organization]);

  // --------------add new receipt type-----------
  const AddNewType = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddLoader(true);
    const form = e.target as HTMLFormElement;
    const newReceiptType: ReceiptDetails = {
      id: uniqid(),
      title: form.receiptType.value.trim(),
      amount: parseInt(form.amount.value.trim()),
    };
    if (!organization) return;
    toast.promise(
      async () => {
        await updatePrescriptionReceiptDefaults(
          receipts.concat(newReceiptType)
        ).then(
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
        loading: "Adding receipt type...",
        success: "Receipt type added successfully",
        error: "Error adding receipt type",
      },
      {
        position: "bottom-right",
      }
    );
  };
  // --------------update receipt-----------
  const UpdateType = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdateLoader(true);
    const form = e.target as HTMLFormElement;
    const existingReceiptType: ReceiptDetails = {
      id: editForReceiptId,
      title: form.receiptType.value.trim(),
      amount: parseInt(form.amount.value.trim()),
    };
    if (!organization) return;
    toast.promise(
      async () => {
        await updatePrescriptionReceiptDefaults(
          receipts.map((receipt) =>
            receipt.id === editForReceiptId ? existingReceiptType : receipt
          )
        ).then(
          () => {
            organization.reload();
            setUpdateLoader(false);
            setReceiptEditModel(false);
          },
          (error) => {
            console.error("Operation failed. Please try again : ", error);
            setUpdateLoader(false);
          }
        );
      },
      {
        loading: "Updating receipt type...",
        success: "Receipt type updated successfully",
        error: "Error updating receipt type",
      },
      {
        position: "bottom-right",
      }
    );
  };
  // --------------delete receipt-----------
  const DeleteType = async () => {
    setDeleteLoader(true);
    if (!organization) return;
    toast.promise(
      async () => {
        await updatePrescriptionReceiptDefaults(
          receipts.filter((receipt) => receipt.id !== editForReceiptId)
        ).then(
          () => {
            organization.reload();
            setDeleteLoader(false);
            setReceiptEditModel(false);
          },
          (error) => {
            console.error("Operation failed. Please try again : ", error);
            setDeleteLoader(false);
          }
        );
      },
      {
        loading: "Deleting receipt type...",
        success: "Receipt type deleted successfully",
        error: "Error deleting receipt type",
      },
      {
        position: "bottom-right",
      }
    );
  };
  return (
    <>
      <Dialog open={receiptEditModel} onOpenChange={setReceiptEditModel}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-medium">Edit Receipt Type</DialogTitle>
            <DialogDescription>
              Modify details for{" "}
              {
                receipts?.find((receipt) => receipt.id === editForReceiptId)
                  ?.title
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={UpdateType} autoComplete="off">
            <fieldset
              disabled={updateLoader || deleteLoader}
              className="w-full rounded-lg grid grid-cols-6 gap-4"
            >
              <div className="col-span-6 space-y-2">
                <Label htmlFor="receiptType">Receipt Type</Label>
                <Input
                  name="receiptType"
                  id="receiptType"
                  placeholder="e.g., Consultation Fee"
                  required
                  defaultValue={
                    receipts?.find((receipt) => receipt.id === editForReceiptId)
                      ?.title
                  }
                />
              </div>
              <div className="col-span-6 space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  name="amount"
                  id="amount"
                  placeholder="e.g., 500"
                  required
                  type="number"
                  defaultValue={
                    receipts?.find((receipt) => receipt.id === editForReceiptId)
                      ?.amount
                  }
                />
              </div>

              <Separator className="w-full col-span-6" />
              <div className="flex col-span-6 w-full items-center justify-between">
                <Button
                  role="button"
                  variant={"destructive"}
                  type="button"
                  onClick={DeleteType}
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

      <Card className="border-b-0 rounded-b-none w-full h-min mx-auto">
        <CardHeader>
          <CardTitle className="font-medium">
            Add Prescription Receipt Type
          </CardTitle>
          <CardDescription>
            Define new receipt types for prescription-related charges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={AddNewType} autoComplete="off">
            <fieldset
              disabled={addLoader}
              className="w-full rounded-lg grid grid-cols-6 gap-4"
            >
              <div className="col-span-6 sm:col-span-3 space-y-2">
                <Label htmlFor="receiptType">Receipt Type</Label>
                <Input
                  name="receiptType"
                  id="receiptType"
                  placeholder="e.g., Consultation Fee"
                  required
                />
              </div>

              <div className="col-span-6 sm:col-span-3 space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  name="amount"
                  id="amount"
                  placeholder="e.g., 500"
                  required
                  type="number"
                />
              </div>

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
      <div className="rounded-t-none w-full flex flex-col flex-1 bg-card border rounded-xl divide-y">
        {!isLoaded ? (
          <div className="flex flex-1 items-center justify-center min-h-72 w-full">
            <Spinner size="sm" />
          </div>
        ) : receipts.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-muted-foreground min-h-72">
            <InboxIcon />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="h-12 pl-6">Id</TableHead>
                <TableHead className="h-12">Type</TableHead>
                <TableHead className="h-12">Amount (₹)</TableHead>
                <TableHead className="h-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receipts.map((receipt, index) => (
                <TableRow key={index}>
                  <TableCell className="pl-6">{index + 1}</TableCell>
                  <TableCell className="text-nowrap">{receipt.title}</TableCell>
                  <TableCell>₹{receipt.amount}</TableCell>
                  <TableCell className="text-right pr-6">
                    <Button
                      variant={"outline"}
                      className={`h-9 w-9 min-w-0`}
                      effect={"ringHover"}
                      onClick={() => {
                        setReceiptEditModel(true);
                        setEditForReceiptId(receipt.id);
                      }}
                    >
                      <Pencil />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
};

interface Medicine_Types {
  value: string;
  isDefault: boolean;
}

const MedicineTypes = () => {
  const { organization, isLoaded } = useOrganization();
  const [medicineTypeEditModel, setMedicineTypeEditModel] =
    useState<boolean>(false);
  const [editForMedicineType, setEditForMedicineType] = useState<
    (typeof medicineTypes)[0] | null
  >(null);
  const [addLoader, setAddLoader] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);
  const [medicineTypes, setMedicineTypes] = useState<Medicine_Types[]>([]);

  useEffect(() => {
    if (
      isLoaded &&
      organization &&
      organization.publicMetadata.medicine_types
    ) {
      setMedicineTypes(
        organization.publicMetadata.medicine_types as Medicine_Types[]
      );
    } else {
      setMedicineTypes([]);
    }
  }, [isLoaded, organization]);

  // --------------add new medicine type-----------
  const AddNewMedicineType = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!organization) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const newType = (formData.get("type") as string).trim();
    const isDefault = formData.get("default") === "on";

    if (!newType) return;

    // Check for duplicate (case-insensitive)
    const isDuplicate = medicineTypes.some(
      (t) => t.value.toLowerCase() === newType.toLowerCase()
    );
    if (isDuplicate) {
      toast.error(`Duplicate type not added: ${newType}`);
      return;
    }

    const updatedTypes = [
      ...medicineTypes.map((t) => ({
        ...t,
        isDefault: isDefault ? false : t.isDefault,
      })),
      { value: newType, isDefault },
    ];

    toast.promise(
      async () => {
        setAddLoader(true);
        await updateMedicineTypesDefaults(updatedTypes).then(
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
        loading: "Adding medicine type...",
        success: "Medicine type added successfully",
        error: "Error adding medicine type",
      },
      {
        position: "bottom-right",
      }
    );
  };

  // --------------update medicine type-----------
  const UpdateMedicineType = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!organization || !editForMedicineType) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const updatedValue = (formData.get("type") as string).trim();
    const isDefault = formData.get("default") === "on";

    if (!updatedValue) return;

    // Check for duplicate (case-insensitive), excluding the current type
    const isDuplicate = medicineTypes.some(
      (t) =>
        t.value.toLowerCase() === updatedValue.toLowerCase() &&
        t.value.toLowerCase() !== editForMedicineType.value.toLowerCase()
    );
    if (isDuplicate) {
      toast.error(`Duplicate type not updated: ${updatedValue}`);
      return;
    }

    const updatedTypes = medicineTypes.map((t) => {
      if (t.value.toLowerCase() === editForMedicineType.value.toLowerCase()) {
        return { value: updatedValue, isDefault };
      }
      return {
        ...t,
        isDefault: isDefault ? false : t.isDefault,
      };
    });

    toast.promise(
      async () => {
        setUpdateLoader(true);
        await updateMedicineTypesDefaults(updatedTypes).then(
          () => {
            organization.reload();
            setUpdateLoader(false);
            setMedicineTypeEditModel(false);
          },
          (error) => {
            console.error("Operation failed. Please try again : ", error);
            setUpdateLoader(false);
          }
        );
      },
      {
        loading: "Updating medicine type...",
        success: "Medicine type updated successfully",
        error: "Error updating medicine type",
      },
      {
        position: "bottom-right",
      }
    );
  };

  // --------------delete medicine type-----------
  const DeleteMedicineType = async () => {
    if (!organization || !editForMedicineType) return;

    const remainingTypes = medicineTypes.filter(
      (t) => t.value.toLowerCase() !== editForMedicineType.value.toLowerCase()
    );

    let updatedTypes: Medicine_Types[];

    if (editForMedicineType.isDefault && remainingTypes.length > 0) {
      updatedTypes = remainingTypes.map((t, index) => ({
        ...t,
        isDefault: index === 0,
      }));
    } else {
      updatedTypes = remainingTypes;
    }

    toast.promise(
      async () => {
        setDeleteLoader(true);
        await updateMedicineTypesDefaults(updatedTypes).then(
          () => {
            organization.reload();
            setDeleteLoader(false);
            setMedicineTypeEditModel(false);
          },
          (error) => {
            console.error("Operation failed. Please try again : ", error);
            setDeleteLoader(false);
          }
        );
      },
      {
        loading: "Deleting medicine type...",
        success: "Medicine type deleted successfully",
        error: "Error deleting medicine type",
      },
      {
        position: "bottom-right",
      }
    );
  };

  return (
    <>
      <Dialog
        open={medicineTypeEditModel}
        onOpenChange={setMedicineTypeEditModel}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-medium">
              Edit Medicine Type
            </DialogTitle>
            <DialogDescription>
              Modify details for {editForMedicineType?.value}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={UpdateMedicineType} autoComplete="off">
            <fieldset
              disabled={updateLoader || deleteLoader}
              className="w-full flex flex-col gap-4"
            >
              <div className="flex w-full items-start gap-2 flex-col">
                <Label htmlFor="type">Medicine Type</Label>
                <Input
                  name="type"
                  autoFocus
                  type="text"
                  placeholder="Injection..."
                  required
                  defaultValue={editForMedicineType?.value}
                />
              </div>

              <div className="flex w-full items-start gap-2 flex-row">
                <Label htmlFor="default">Make it default ?</Label>

                <Checkbox
                  defaultChecked={editForMedicineType?.isDefault}
                  name="default"
                />
              </div>

              <Separator className="w-full col-span-6" />
              <div className="flex col-span-6 w-full items-center justify-between">
                <Button
                  role="button"
                  variant={"destructive"}
                  type="button"
                  onClick={DeleteMedicineType}
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

      <Card className="w-full h-min mx-auto mt-2 md:mt-5">
        <CardHeader>
          <CardTitle className="font-medium">Add New Medicine Type</CardTitle>
          <CardDescription>
            Manage and add custom medicine types for prescriptions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-row gap-2 flex-wrap">
          {!isLoaded ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="w-28 h-10 rounded-full" />
            ))
          ) : medicineTypes.length === 0 ? (
            <Badge
              variant="outline"
              className={`rounded-full py-1 h-10 transition-all px-10`}
            >
              <InboxIcon className="size-4" />
            </Badge>
          ) : (
            medicineTypes.map((type, index) => (
              <Badge
                variant="outline"
                className={`group rounded-full text-sm font-medium leading-normal gap-2 py-1 h-10 transition-all pl-3 pr-1`}
                key={index}
              >
                {type.isDefault && (
                  <StarIcon className="size-4 fill-foreground" />
                )}
                {type.value}
                <Button
                  variant="secondary"
                  className="items-center justify-center h-full aspect-square w-auto px-1 py-1 rounded-full shadow-none flex"
                  size="icon"
                  onClick={() => {
                    setEditForMedicineType(type);
                    setMedicineTypeEditModel(true);
                  }}
                >
                  <Settings2Icon />
                </Button>
              </Badge>
            ))
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                effect={"ringHover"}
                className="rounded-full p-1 pr-3 h-10 text-sm font-medium leading-normal border-dashed"
              >
                <span className="gap-2 h-full flex flex-row items-center">
                  <span className="flex items-center justify-center h-full aspect-square px-1 py-1 rounded-full bg-white/10">
                    <PlusIcon />
                  </span>
                  Add New
                </span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-medium">Add New Type</DialogTitle>
                <DialogDescription>
                  Add new medicine type. Click add when you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={AddNewMedicineType} autoComplete="off">
                <fieldset
                  disabled={addLoader}
                  className="w-full flex flex-col gap-4"
                >
                  <div className="flex w-full items-start gap-2 flex-col">
                    <Label htmlFor="type">Medicine Type</Label>
                    <Input
                      name="type"
                      autoFocus
                      type="text"
                      placeholder="Injection..."
                      className=""
                      required
                    />
                  </div>

                  <div className="flex w-full items-start gap-2 flex-row">
                    <Label htmlFor="default">Make it default ?</Label>

                    <Checkbox name="default" />
                  </div>

                  <Separator className="w-full col-span-6" />
                  <div className="flex col-span-6 w-full items-center justify-between">
                    <DialogClose asChild>
                      <Button
                        role="button"
                        variant="outline"
                        type="button"
                        icon={XIcon}
                        iconPlacement="right"
                      >
                        Cancel
                      </Button>
                    </DialogClose>
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
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </>
  );
};
