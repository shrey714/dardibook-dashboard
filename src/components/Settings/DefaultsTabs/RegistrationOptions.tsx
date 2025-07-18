"use client";

import React, { FormEvent, useEffect, useState } from "react";
import {
  CirclePlus,
  InboxIcon,
  Pencil,
  SaveIcon,
  Trash2Icon,
} from "lucide-react";
import uniqid from "uniqid";
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

import { useAuth, useOrganization } from "@clerk/nextjs";
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
import { updateRegistrationReceiptDefaults } from "@/app/dashboard/settings/defaults/_actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export const RegistrationOptions = () => {
  const { orgId } = useAuth();
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
      organization.publicMetadata.registration_receipt_types
    ) {
      setReceipts(
        organization.publicMetadata
          .registration_receipt_types as ReceiptDetails[]
      );
    } else {
      setReceipts([]);
    }
  }, [isLoaded, orgId, organization]);

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
        await updateRegistrationReceiptDefaults(
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
        await updateRegistrationReceiptDefaults(
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
        await updateRegistrationReceiptDefaults(
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
                  placeholder="e.g., Registration Fee"
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
            Add Registration Receipt Type
          </CardTitle>
          <CardDescription>
            Create and define new receipt types with associated fees.
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
                  placeholder="e.g., Registration Fee"
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
                  effect={"ringHover"}
                  icon={CirclePlus}
                  iconPlacement="right"
                  loading={addLoader}
                  loadingText={"Adding"}
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
            <Loader size="medium" />
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
