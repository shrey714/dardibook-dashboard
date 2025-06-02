"use client";
import React, { useState } from "react";
import {
  User,
  Phone,
  PencilLineIcon,
  ClipboardPlusIcon,
  X,
  CalendarClockIcon,
  CreditCard,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PharmacyTypes } from "@/types/FormTypes";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

interface BillHistoryModaltypes {
  billModal: boolean;
  setbillModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBillData?: PharmacyTypes;
  setselectedBillData: React.Dispatch<
    React.SetStateAction<PharmacyTypes | undefined>
  >;
  setNeedsToReFetchBills: React.Dispatch<React.SetStateAction<number>>;
}

const BillHistoryModal = ({
  billModal,
  setbillModal,
  selectedBillData,
  setselectedBillData,
  setNeedsToReFetchBills,
}: BillHistoryModaltypes) => {
  const { orgId } = useAuth();
  const [updateLoader, setUpdateLoader] = useState(false);

  const changePaymentMethod = async (method: string) => {
    setUpdateLoader(true);
    if (orgId && selectedBillData?.bill_id) {
      toast.promise(
        async () => {
          await updateDoc(
            doc(db, "doctor", orgId, "bills", selectedBillData?.bill_id),
            { payment_method: method }
          ).then(
            () => {
              setUpdateLoader(false);
              setselectedBillData({
                ...selectedBillData,
                payment_method: method as "Cash" | "Card" | "UPI" | "Online",
              });
              setNeedsToReFetchBills((prev) => prev + 1);
            },
            (e) => {
              console.log("error==", e);
              setUpdateLoader(false);
            }
          );
        },
        {
          loading: "Updating...",
          success: "Payment method updated",
          error: "Failed to update payment method",
        },
        {
          position: "bottom-right",
        }
      );
    }
  };

  const changePaymentStatus = async (status: string) => {
    setUpdateLoader(true);
    if (orgId && selectedBillData?.bill_id) {
      toast.promise(
        async () => {
          await updateDoc(
            doc(db, "doctor", orgId, "bills", selectedBillData?.bill_id),
            { payment_status: status }
          ).then(
            () => {
              setUpdateLoader(false);
              setselectedBillData({
                ...selectedBillData,
                payment_status: status as
                  | "Paid"
                  | "Unpaid"
                  | "Not Required"
                  | "Refunded",
              });
              setNeedsToReFetchBills((prev) => prev + 1);
            },
            (e) => {
              console.log("error==", e);
              setUpdateLoader(false);
            }
          );
        },
        {
          loading: "Updating...",
          success: "Payment status updated",
          error: "Failed to update payment status",
        },
        {
          position: "bottom-right",
        }
      );
    }
  };

  return (
    <Dialog open={billModal} onOpenChange={setbillModal}>
      <DialogContent
        showCloseBtn={false}
        className="max-w-[95%] h-[95%] sm:max-w-[80%] sm:h-[90%] overflow-y-auto p-0 flex flex-col gap-0"
      >
        {selectedBillData ? (
          <>
            <DialogHeader className="shadow-sm">
              <DialogTitle hidden></DialogTitle>
              <DialogDescription hidden></DialogDescription>
              <div className="w-full gap-y-1 bg-slate-50 dark:bg-gray-900 border-b px-4 py-2 flex flex-wrap items-center justify-between ">
                <div className="flex flex-1 items-center space-x-2 sm:space-x-4">
                  <User className="size-9 md:size-11 border border-muted-foreground rounded-full p-2 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm md:text-base font-medium line-clamp-1">
                        {selectedBillData.name}
                      </h3>
                      <Badge
                        variant={"outline"}
                        className="bg-blue-500/10 border-blue-500 text-blue-500 rounded-full line-clamp-1"
                      >
                        {selectedBillData.patient_id ?? "-"}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground gap-3">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                        <span>{selectedBillData.gender ?? "-"} </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span className="line-clamp-1">
                          {selectedBillData.mobile}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registered by/for section */}
                <div className="hidden md:flex items-center divide-x-0 md:divide-x divide-gray-700 gap-x-3">
                  <div className="flex items-center">
                    <CalendarClockIcon
                      size={36}
                      className="mr-3 border border-foreground rounded-full p-2"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-muted-foreground">
                        Generated at
                      </span>
                      <span className="text-base font-medium">
                        {format(
                          new Date(selectedBillData?.generated_at || 0),
                          "do MMM yyyy"
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center pl-3">
                    <ClipboardPlusIcon
                      size={36}
                      className="mr-3 bg-green-500/10 text-green-600 border border-green-600 rounded-full p-2"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-muted-foreground">
                        Prescribed by
                      </span>
                      <span className="text-base font-medium">
                        {selectedBillData?.prescribed_by?.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center pl-3">
                    <PencilLineIcon
                      size={36}
                      className="mr-3 bg-blue-600/10 text-blue-600 border border-blue-600 rounded-full p-2"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-muted-foreground">
                        Generated by
                      </span>
                      <span className="text-base font-medium">
                        {selectedBillData?.generated_by?.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center h-full justify-center ml-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setbillModal(false);
                    }}
                    className="text-muted-foreground p-2.5 aspect-auto w-auto h-auto"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>
            <div className="flex flex-1 flex-col overflow-y-auto w-full p-2 sm:p-6 gap-y-2 sm:gap-y-6">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-6">
                <div>
                  <CommonHeader label={"Bill Details"} />

                  <div className="space-y-3 mt-3 px-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Bill Id</p>
                        <div className="flex items-center h-9 text-muted-foreground w-full rounded-md border px-3 text-base md:text-sm !leading-9 shadow-sm">
                          {selectedBillData.bill_id}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium">Prescription Id</p>
                        <div className="flex items-center h-9 text-muted-foreground w-full rounded-md border px-3 text-base md:text-sm !leading-9 shadow-sm">
                          {selectedBillData.prescription_id ?? "-"}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Notes</p>
                      <div className="flex items-center h-9 text-muted-foreground w-full rounded-md border px-3 text-base md:text-sm !leading-9 shadow-sm">
                        {selectedBillData.notes ?? "-"}
                      </div>
                    </div>
                  </div>
                </div>

                <Card className="flex flex-col overflow-hidden">
                  <CardHeader className="py-3 bg-muted/50 border-b">
                    <CardTitle className="text-lg font-medium">
                      Bill Summary
                    </CardTitle>
                    <CardDescription hidden></CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-2 p-2 sm:p-6">
                    <div className="flex justify-between">
                      <span>Medicines Total:</span>
                      <span>
                        ₹
                        {selectedBillData.medicines
                          .reduce(
                            (sum, med) => sum + med.price * med.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Services Total:</span>
                      <span>
                        ₹
                        {selectedBillData.services
                          .reduce(
                            (sum, service) =>
                              sum + service.price * (service.quantity || 1),
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                    {selectedBillData.discount > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Discount ({selectedBillData.discount}%):</span>
                        <span>
                          -₹
                          {(
                            (selectedBillData.medicines.reduce(
                              (sum, med) => sum + med.price * med.quantity,
                              0
                            ) +
                              selectedBillData.services.reduce(
                                (sum, service) =>
                                  sum + service.price * (service.quantity || 1),
                                0
                              )) *
                            (selectedBillData.discount / 100)
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {selectedBillData.tax_percentage > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Tax ({selectedBillData.tax_percentage}%):</span>
                        <span>
                          +₹
                          {(
                            (selectedBillData.medicines.reduce(
                              (sum, med) => sum + med.price * med.quantity,
                              0
                            ) +
                              selectedBillData.services.reduce(
                                (sum, service) =>
                                  sum + service.price * (service.quantity || 1),
                                0
                              )) *
                            (1 - selectedBillData.discount / 100) *
                            (selectedBillData.tax_percentage / 100)
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t py-3 flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span>₹{selectedBillData.total_amount.toFixed(2)}</span>
                  </CardFooter>
                </Card>
              </div>
              <div className="w-full flex flex-col">
                <CommonHeader label={"Services Details"} />

                <div className="border rounded-md overflow-hidden mt-3">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Service</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedBillData.services.length > 0 ? (
                        selectedBillData.services.map((service, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-transparent"
                          >
                            <TableCell>{service.service_name}</TableCell>
                            <TableCell>{service.quantity}</TableCell>
                            <TableCell>₹{service.price.toFixed(2)}</TableCell>
                            <TableCell>
                              ₹
                              {(
                                service.price * (service.quantity || 1)
                              ).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow className="hover:bg-transparent">
                          <TableCell
                            colSpan={5}
                            className="text-center py-3 text-muted-foreground"
                          >
                            No services added
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              <div className="w-full flex flex-col">
                <CommonHeader label={"Medicines Details"} />

                <div className="border rounded-md overflow-hidden mt-3">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Medicine</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedBillData.medicines.length > 0 ? (
                        selectedBillData.medicines.map((med, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-transparent"
                          >
                            <TableCell>
                              {med.medicineName}
                              <div className="text-xs text-muted-foreground max-w-40 line-clamp-2">
                                {med.type}, {med.instruction}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="inline-flex rounded-md shadow-xs">
                                <div className="px-4 py-2 text-sm font-medium border rounded-s-lg">
                                  {med.dosages.morning === "1" ? 1 : "-"}
                                </div>
                                <div className="px-4 py-2 text-sm font-medium border-t border-b border-r">
                                  {med.dosages.afternoon === "1" ? 1 : "-"}
                                </div>
                                <div className="px-4 py-2 text-sm font-medium border-t border-b">
                                  {med.dosages.evening === "1" ? 1 : "-"}
                                </div>
                                <div className="px-4 py-2 text-sm font-medium border rounded-e-lg">
                                  {med.dosages.night === "1" ? 1 : "-"}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {med.duration} {med.durationType}
                            </TableCell>
                            <TableCell>{med.quantity}</TableCell>
                            <TableCell>₹{med.price.toFixed(2)}</TableCell>
                            <TableCell>
                              ₹{(med.price * med.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow className="hover:bg-transparent">
                          <TableCell
                            colSpan={6}
                            className="text-center py-3 text-muted-foreground"
                          >
                            No medicines added
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
            <DialogFooter className="bg-slate-50 dark:bg-gray-900 w-full gap-1 border-t px-4 py-2 flex flex-row justify-end items-center">
              {selectedBillData.payment_status === "Paid" && (
                <Select
                  disabled={updateLoader}
                  onValueChange={(method) => {
                    changePaymentMethod(method);
                  }}
                  value={selectedBillData?.payment_method}
                >
                  <SelectTrigger className="w-min min-w-40 px-4 gap-2 shadow-sm">
                    <div className="flex flex-row h-full gap-2 items-center">
                      <CreditCard className="h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="min-w-44">
                    <SelectGroup className="space-y-1">
                      <SelectLabel>Payment Method</SelectLabel>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Card">Card</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Online">Online</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}

              <Select
                disabled={updateLoader}
                onValueChange={(status) => {
                  changePaymentStatus(status);
                }}
                value={selectedBillData.payment_status}
              >
                <SelectTrigger
                  className={`w-min min-w-40 px-4 gap-2 border-0 shadow-sm
            ${
              selectedBillData?.payment_status === "Paid"
                ? "bg-green-300 text-green-800 font-medium"
                : selectedBillData?.payment_status === "Unpaid"
                ? "bg-red-300 text-red-800 font-medium"
                : selectedBillData?.payment_status === "Not Required"
                ? "bg-gray-300 text-gray-800 font-medium"
                : selectedBillData?.payment_status === "Refunded"
                ? "bg-yellow-300 text-yellow-800 font-medium"
                : ""
            }    
            `}
                >
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="min-w-44">
                  <SelectGroup className="space-y-1">
                    <SelectLabel>Payment Status</SelectLabel>
                    <SelectItem
                      className="bg-green-200 text-green-800 focus:bg-green-300 focus:text-green-800 focus:font-medium"
                      value="Paid"
                    >
                      Paid
                    </SelectItem>
                    <SelectItem
                      className="bg-red-200 text-red-800 focus:bg-red-300 focus:text-red-800 focus:font-medium"
                      value="Unpaid"
                    >
                      Unpaid
                    </SelectItem>
                    <SelectItem
                      className="bg-gray-200 text-gray-800 focus:bg-gray-300 focus:text-gray-800 focus:font-medium"
                      value="Not Required"
                    >
                      Not Required
                    </SelectItem>
                    <SelectItem
                      className="bg-yellow-200 text-yellow-800 focus:bg-yellow-300 focus:text-yellow-800 focus:font-medium"
                      value="Refunded"
                    >
                      Refunded
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </DialogFooter>
          </>
        ) : (
          <div className="w-full h-full flex items-center flex-col gap-8 justify-center">
            <DialogHeader className="p-0">
              <DialogTitle hidden></DialogTitle>
              <DialogDescription hidden></DialogDescription>
            </DialogHeader>
            <img className="w-full max-w-[16rem]" src="/empty.svg" alt="" />
            <p className="text-muted-foreground text-base">
              No Bill Data Available.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BillHistoryModal;

const CommonHeader = ({ label }: { label: string }) => {
  return (
    <div className="w-full p-0 flex flex-row items-center">
      <div className="flex items-center justify-center">
        <p className="text-muted-foreground w-auto px-3 py-1 font-medium text-sm rounded-full border-muted-foreground border-[1px]">
          {label}
        </p>
      </div>
      <span className="flex flex-1 h-[1px] bg-gradient-to-l from-transparent to-muted-foreground"></span>
    </div>
  );
};
