"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePatientHistoryModalStore } from "@/lib/stores/patientHistoryModalStore";
import PatientHistoryTabs from "@/components/History/PatientHistoryTabs";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import {
  BedDoubleIcon,
  BedIcon,
  CalendarClockIcon,
  CalendarMinus,
  CalendarPlus,
  CircleHelp,
  ClipboardPlusIcon,
  LogOutIcon,
  MapPinHouse,
  PencilLineIcon,
  Phone,
  PrinterIcon,
  ReceiptText,
  ReceiptTextIcon,
  User,
  X,
} from "lucide-react";
import {
  patientBed,
  PharmacyTypes,
  PrescriptionFormTypes,
  RegisterPatientFormTypes,
} from "@/types/FormTypes";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimelineInstanceType {
  time: number;
  type: "Register" | "Prescribe" | "Bill" | "BedIn" | "BedOut" | "Discharged";
}

const PatientHistoryGlobalModal = () => {
  const { isOpen, modalProps, closeModal } = usePatientHistoryModalStore();
  const { isLoaded, orgId, orgRole } = useAuth();
  const [isBillDrawerOpen, setIsBillDrawerOpen] = useState(false);
  const [billsData, setBillsData] = useState<PharmacyTypes[]>([]);
  const [selectedBillId, setSelectedBillId] = useState<string>();

  const [isAdmDrawerOpen, setIsAdmDrawerOpen] = useState(false);
  const [admsData, setAdmsData] = useState<patientBed[]>([]);
  const [selectedAdmId, setSelectedAdmId] = useState<string>();

  const [patientData, setPatientData] = useState<RegisterPatientFormTypes>();
  const [prescriptionsData, setPrescriptionsData] = useState<
    PrescriptionFormTypes[]
  >([]);

  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const getPatientData = async () => {
      if (
        modalProps.patientId &&
        modalProps.patientId !== "" &&
        isLoaded &&
        orgId &&
        orgRole
      ) {
        setLoader(true);

        const patientRef = doc(
          db,
          "doctor",
          orgId,
          "patients",
          modalProps.patientId
        );

        const prescriptionsRef = collection(
          db,
          "doctor",
          orgId,
          "patients",
          modalProps.patientId,
          "prescriptions"
        );

        const billsRef = query(
          collection(db, "doctor", orgId, "bills"),
          where("patient_id", "==", modalProps.patientId)
        );

        const [patientSnap, prescriptionsSnap, billsSnap] = await Promise.all([
          getDoc(patientRef),
          getDocs(prescriptionsRef),
          getDocs(billsRef),
        ]);

        if (!patientSnap.exists()) {
          setLoader(false);
          setPatientData(undefined);
          setPrescriptionsData([]);
          return null;
        }

        const patientData = patientSnap.data() as RegisterPatientFormTypes;
        const prescriptions = prescriptionsSnap.docs.map(
          (doc) => doc.data() as PrescriptionFormTypes
        );
        const bills = billsSnap.docs.map((doc) => doc.data() as PharmacyTypes);

        setAdmsData(patientData.bed_info);
        setBillsData(bills);
        setPatientData(patientData);
        setPrescriptionsData(prescriptions);
        setLoader(false);
        setSelectedBillId(undefined);
        setSelectedAdmId(undefined);
      } else {
        setLoader(false);
        setAdmsData([]);
        setBillsData([]);
        setPatientData(undefined);
        setPrescriptionsData([]);
        setSelectedBillId(undefined);
        setSelectedAdmId(undefined);
      }
    };
    getPatientData();
  }, [modalProps, isLoaded, orgId, orgRole]);

  const handleBillIdSelection = (id: string) => {
    if (id) {
      setIsBillDrawerOpen(true);
      setSelectedBillId(id);
    }
  };

  const bill = billsData.find((bill) => bill.bill_id === selectedBillId);
  const adm = admsData.find((adm) => adm.bedBookingId === selectedAdmId);

  return (
    <>
      <Drawer open={isAdmDrawerOpen} onOpenChange={setIsAdmDrawerOpen}>
        <DrawerContent className="max-h-[85%]">
          {admsData.length !== 0 && isAdmDrawerOpen && (
            <ScrollArea className="overflow-hidden !absolute bg-background/40 bg-clip-padding backdrop-filter backdrop-blur-sm px-2 py-2.5 top-[-99px] rounded-lg left-0 right-0 mx-auto max-w-2xl w-auto">
              <div className="flex flex-1 flex-row gap-2">
                {admsData
                  .sort((a, b) => b.admission_at - a.admission_at)
                  .map((adm, index) => (
                    <Button
                      key={index}
                      variant={"secondary"}
                      onClick={() => {
                        setSelectedAdmId(adm.bedBookingId);
                      }}
                      className={`${
                        adm.bedBookingId === selectedAdmId
                          ? "bg-blue-700 text-white hover:bg-blue-700"
                          : "bg-border text-muted-foreground"
                      } text-sm h-auto shadow flex items-center justify-center py-2 px-3 flex-col gap-y-2 `}
                    >
                      <BedIcon className="!size-8" />
                      <p className="text-xs leading-tight line-clamp-1">
                        {format(adm.admission_at, "dd-MM-yy")}
                        {" / "}
                        {format(adm.discharge_at, "dd-MM-yy")}
                      </p>
                    </Button>
                  ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}

          <DrawerHeader className={`${adm ? "shadow-sm px-0 pb-0" : "p-0"}`}>
            <DrawerTitle hidden></DrawerTitle>
            <DrawerDescription hidden></DrawerDescription>
            {adm && patientData && (
              <div className="w-full gap-y-1 bg-slate-50 dark:bg-gray-900 border-b px-4 py-2 flex flex-wrap items-center justify-between ">
                <div className="flex flex-1 items-center space-x-2 sm:space-x-4">
                  <User className="size-9 md:size-11 border border-muted-foreground rounded-full p-2 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm md:text-base font-medium line-clamp-1">
                        {patientData.name}
                      </h3>
                      <Badge
                        variant={"outline"}
                        className="bg-blue-500/10 border-blue-500 text-blue-500 rounded-full line-clamp-1"
                      >
                        {patientData.patient_id}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground gap-3">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                        <span>{patientData.gender} </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span className="line-clamp-1">
                          {patientData.mobile}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex items-center h-full justify-center ml-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAdmDrawerOpen(false);
                    }}
                    className="text-muted-foreground p-2.5 aspect-auto w-auto h-auto"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </DrawerHeader>
          {admsData.length === 0 ? (
            <div className="w-full h-full flex items-center flex-col gap-8 pt-6 pb-2 justify-center">
              <img className="w-full max-w-[16rem]" src="/empty.svg" alt="" />
              <p className="text-muted-foreground text-base">
                No Admission Data Available.
              </p>
            </div>
          ) : adm ? (
            <div className="flex flex-1 flex-col overflow-y-auto w-full p-2 sm:p-6 gap-y-2 sm:gap-y-6 max-w-4xl mx-auto">
              <Timeline
                orientation="horizontal"
                className="w-full max-w-3xl py-4 px-2"
              >
                <TimelineItem className="flex-1">
                  <TimelineSeparator>
                    <TimelineDot className="size-8 [&_svg]:size-6">
                      <CalendarPlus className="text-yellow-400" />
                    </TimelineDot>
                    <TimelineConnector className="bg-gradient-to-r from-yellow-400 to-red-500" />
                  </TimelineSeparator>
                  <TimelineContent>
                    <TimelineTitle>Admitted on</TimelineTitle>
                    <TimelineDescription className="whitespace-nowrap">
                      {format(adm.admission_at, "h.mm a, MMMM d, yyyy")}
                    </TimelineDescription>
                  </TimelineContent>
                </TimelineItem>

                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot className="!size-8 [&_svg]:size-6">
                      <CalendarMinus className="text-red-500" />
                    </TimelineDot>
                  </TimelineSeparator>
                  <TimelineContent>
                    <TimelineTitle>
                      {adm.dischargeMarked ? "Discharged on" : "Discharge on"}
                    </TimelineTitle>
                    <TimelineDescription className="whitespace-nowrap">
                      {format(adm.discharge_at, "h.mm a, MMMM d, yyyy")}
                    </TimelineDescription>
                  </TimelineContent>
                </TimelineItem>
              </Timeline>

              <div className="w-full flex flex-col-reverse md:flex-row gap-3 sm:gap-6">
                <div className="flex flex-col flex-1">
                  <CommonHeader label={"Admission Details"} />
                  <div className="space-y-3 mt-3 px-3">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Admission Id</p>
                      <div className="flex items-center h-9 text-muted-foreground w-full rounded-md border px-3 text-base md:text-sm !leading-9 shadow-sm">
                        {adm.bedBookingId}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Bed Id</p>
                      <div className="flex items-center h-9 text-muted-foreground w-full rounded-md border px-3 text-base md:text-sm !leading-9 shadow-sm">
                        {adm.bedId}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col overflow-hidden gap-y-2 md:pr-8">
                  <Badge
                    className="text-base rounded-full px-2 py-1 justify-center"
                    variant={adm.dischargeMarked ? "failure" : "success"}
                  >
                    {adm.dischargeMarked ? "Discharged" : "In Bed"}
                  </Badge>

                  <div className="flex items-center">
                    <PencilLineIcon
                      size={36}
                      className="mr-3 bg-blue-600/10 text-blue-600 border-blue-600 border rounded-full p-2"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-muted-foreground">
                        Admitted by
                      </span>
                      <span className="text-base font-medium">
                        {adm.admission_by.name}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ClipboardPlusIcon
                      size={36}
                      className="mr-3 bg-blue-600/10 text-green-600 border border-green-600 rounded-full p-2"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-muted-foreground">
                        Admitted for
                      </span>
                      <span className="text-base font-medium">
                        {adm.admission_for.name}
                      </span>
                    </div>
                  </div>
                  {adm.dischargeMarked && (
                    <div className="flex items-center">
                      <LogOutIcon
                        size={36}
                        className="mr-3 bg-green-500/10 text-red-500 border border-red-500 rounded-full p-2"
                      />
                      <div className="flex flex-col items-start">
                        <span className="text-xs text-muted-foreground">
                          Discharged by
                        </span>
                        <span className="text-base font-medium">
                          {adm.discharged_by?.name}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : selectedAdmId ? (
            <div className="w-full h-full flex items-center flex-col gap-8 pt-6 pb-2 justify-center">
              <img className="w-full max-w-[16rem]" src="/empty.svg" alt="" />
              <p className="text-muted-foreground text-base">
                Admission Id is not valid.
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center flex-col gap-8 pt-6 pb-2 justify-center">
              <img className="w-full max-w-[16rem]" src="/empty.svg" alt="" />
              <p className="text-muted-foreground text-base">
                Please Select Admission.
              </p>
            </div>
          )}
          <DrawerFooter className="items-center flex-row justify-center">
            <DrawerClose asChild>
              <Button className="max-w-sm w-full" variant="outline">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer open={isBillDrawerOpen} onOpenChange={setIsBillDrawerOpen}>
        <DrawerContent className="max-h-[85%]">
          {billsData.length !== 0 && isBillDrawerOpen && (
            <ScrollArea className="overflow-hidden !absolute bg-background/40 bg-clip-padding backdrop-filter backdrop-blur-sm px-2 py-2.5 top-[-99px] rounded-lg left-0 right-0 mx-auto max-w-2xl w-auto">
              <div className="flex flex-1 flex-row gap-2">
                {billsData
                  .sort((a, b) => b.generated_at - a.generated_at)
                  .map((bill, index) => (
                    <Button
                      key={index}
                      variant={"secondary"}
                      onClick={() => {
                        setSelectedBillId(bill.bill_id);
                      }}
                      className={`${
                        bill.bill_id === selectedBillId
                          ? "bg-blue-700 text-white hover:bg-blue-700"
                          : "bg-border text-muted-foreground"
                      } text-sm h-auto shadow flex items-center justify-center py-2 px-3 flex-col gap-y-2 `}
                    >
                      <ReceiptTextIcon className="!size-8" />
                      <p className="text-xs leading-tight line-clamp-1">
                        {format(bill.generated_at, "dd-MM-yyyy")}
                      </p>
                    </Button>
                  ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}

          <DrawerHeader className={`${bill ? "shadow-sm px-0 pb-0" : "p-0"}`}>
            <DrawerTitle hidden></DrawerTitle>
            <DrawerDescription hidden></DrawerDescription>
            {bill && (
              <div className="w-full gap-y-1 bg-slate-50 dark:bg-gray-900 border-b px-4 py-2 flex flex-wrap items-center justify-between ">
                <div className="flex flex-1 items-center space-x-2 sm:space-x-4">
                  <User className="size-9 md:size-11 border border-muted-foreground rounded-full p-2 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm md:text-base font-medium line-clamp-1">
                        {bill.name}
                      </h3>
                      <Badge
                        variant={"outline"}
                        className="bg-blue-500/10 border-blue-500 text-blue-500 rounded-full line-clamp-1"
                      >
                        {bill.patient_id ?? "-"}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground gap-3">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                        <span>{bill.gender ?? "-"} </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span className="line-clamp-1">{bill.mobile}</span>
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
                        {format(new Date(bill.generated_at), "do MMM yyyy")}
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
                        {bill?.prescribed_by?.name}
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
                        {bill.generated_by.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center h-full justify-center ml-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsBillDrawerOpen(false);
                    }}
                    className="text-muted-foreground p-2.5 aspect-auto w-auto h-auto"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </DrawerHeader>
          {billsData.length === 0 ? (
            <div className="w-full h-full flex items-center flex-col gap-8 pt-6 pb-2 justify-center">
              <img className="w-full max-w-[16rem]" src="/empty.svg" alt="" />
              <p className="text-muted-foreground text-base">
                No Bill Data Available.
              </p>
            </div>
          ) : bill ? (
            <div className="flex flex-1 flex-col overflow-y-auto w-full p-2 sm:p-6 gap-y-2 sm:gap-y-6">
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-6">
                <div>
                  <CommonHeader label={"Bill Details"} />

                  <div className="space-y-3 mt-3 px-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Bill Id</p>
                        <div className="flex items-center h-9 text-muted-foreground w-full rounded-md border px-3 text-base md:text-sm !leading-9 shadow-sm">
                          {bill.bill_id}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium">Prescription Id</p>
                        <div className="flex items-center h-9 text-muted-foreground w-full rounded-md border px-3 text-base md:text-sm !leading-9 shadow-sm">
                          {bill.prescription_id ?? "-"}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Payment Status</p>
                        <div className="flex items-center h-9 text-muted-foreground w-full rounded-md border px-3 text-base md:text-sm !leading-9 shadow-sm">
                          {bill.payment_status}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-sm font-medium">Payment Method</p>
                        <div className="flex items-center h-9 text-muted-foreground w-full rounded-md border px-3 text-base md:text-sm !leading-9 shadow-sm">
                          {bill.payment_method ?? "-"}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium">Notes</p>
                      <div className="flex items-center h-9 text-muted-foreground w-full rounded-md border px-3 text-base md:text-sm !leading-9 shadow-sm">
                        {bill.notes ?? "-"}
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
                        {bill.medicines
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
                        {bill.services
                          .reduce(
                            (sum, service) =>
                              sum + service.price * (service.quantity || 1),
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                    {bill.discount > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Discount ({bill.discount}%):</span>
                        <span>
                          -₹
                          {(
                            (bill.medicines.reduce(
                              (sum, med) => sum + med.price * med.quantity,
                              0
                            ) +
                              bill.services.reduce(
                                (sum, service) =>
                                  sum + service.price * (service.quantity || 1),
                                0
                              )) *
                            (bill.discount / 100)
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {bill.tax_percentage > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Tax ({bill.tax_percentage}%):</span>
                        <span>
                          +₹
                          {(
                            (bill.medicines.reduce(
                              (sum, med) => sum + med.price * med.quantity,
                              0
                            ) +
                              bill.services.reduce(
                                (sum, service) =>
                                  sum + service.price * (service.quantity || 1),
                                0
                              )) *
                            (1 - bill.discount / 100) *
                            (bill.tax_percentage / 100)
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t py-3 flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span>₹{bill.total_amount.toFixed(2)}</span>
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
                      {bill.services.length > 0 ? (
                        bill.services.map((service, index) => (
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
                      {bill.medicines.length > 0 ? (
                        bill.medicines.map((med, index) => (
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
          ) : selectedBillId ? (
            <div className="w-full h-full flex items-center flex-col gap-8 pt-6 pb-2 justify-center">
              <img className="w-full max-w-[16rem]" src="/empty.svg" alt="" />
              <p className="text-muted-foreground text-base">
                Bill Id is not valid.
              </p>
            </div>
          ) : (
            <div className="w-full h-full flex items-center flex-col gap-8 pt-6 pb-2 justify-center">
              <img className="w-full max-w-[16rem]" src="/empty.svg" alt="" />
              <p className="text-muted-foreground text-base">
                Please Select Bill Id.
              </p>
            </div>
          )}
          <DrawerFooter className="items-center flex-row justify-center">
            <DrawerClose asChild>
              <Button className="max-w-sm w-full" variant="outline">
                Close
              </Button>
            </DrawerClose>

            {bill && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      className="w-auto px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
                    >
                      <PrinterIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Print</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Dialog open={isOpen} onOpenChange={closeModal}>
        <DialogContent
          showCloseBtn={false}
          className="max-w-[95%] h-[95%] sm:max-w-[80%] sm:h-[90%] overflow-y-auto p-0 flex flex-col gap-0"
        >
          <DialogHeader className="shadow-sm">
            <DialogTitle hidden></DialogTitle>
            <DialogDescription hidden></DialogDescription>
            <div className="w-full gap-y-1 bg-slate-50 dark:bg-gray-900 border-b px-4 py-2 flex flex-wrap items-center justify-between ">
              {loader ? (
                <div className="flex flex-1 items-center space-x-2 sm:space-x-4">
                  <Skeleton className="size-9 md:size-11 rounded-full" />
                  <div className="w-full">
                    <Skeleton className="h-6 max-w-[200px]" />
                    <Skeleton className="h-5 mt-1 max-w-[400px]" />
                  </div>
                </div>
              ) : patientData ? (
                <div className="flex flex-1 items-center space-x-2 sm:space-x-4">
                  <User className="size-9 md:size-11 border border-muted-foreground rounded-full p-2 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm md:text-base font-medium line-clamp-1">
                        {patientData.name}
                      </h3>
                      <Badge
                        variant={"outline"}
                        className="bg-blue-500/10 border-blue-500 text-blue-500 rounded-full line-clamp-1"
                      >
                        {patientData.patient_id}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground gap-x-3 flex-wrap">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                        <span>
                          {patientData.gender}({patientData.age})
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span className="line-clamp-1">
                          {patientData.mobile}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPinHouse className="h-3 w-3" />
                        <span className="line-clamp-1">
                          {[
                            patientData.street_address,
                            patientData.city,
                            patientData.state,
                            patientData.zip,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}

              <div className="flex items-center gap-x-2 h-full justify-center ml-auto pl-3">
                <Button
                  variant="default"
                  onClick={() => {
                    setIsAdmDrawerOpen(true);
                  }}
                  className="p-2.5 leading-[normal] aspect-auto w-auto h-auto"
                >
                  <BedDoubleIcon className="h-4 w-4" />
                  <p className="hidden md:block">Adms</p>
                </Button>

                <Button
                  variant="default"
                  onClick={() => {
                    setIsBillDrawerOpen(true);
                  }}
                  className="p-2.5 leading-[normal] aspect-auto w-auto h-auto"
                >
                  <ReceiptTextIcon className="h-4 w-4" />
                  <p className="hidden md:block">Bills</p>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => {
                    closeModal();
                  }}
                  className="text-muted-foreground p-2.5 aspect-auto w-auto h-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="flex flex-1 flex-col overflow-y-auto w-full">
            <div className="relative">
              {loader ? (
                <ScrollArea className="mx-auto border rounded-lg m-2 h-min overflow-x-auto">
                  <div className="py-4 px-6 flex flex-row">
                    {Array.from({ length: 5 }, (_, i) => i).map((index) => (
                      <div key={index} className="flex flex-col gap-4">
                        <div className="flex items-center">
                          <Skeleton className="size-4 rounded-full" />
                          <Skeleton
                            hidden={index + 1 === 5}
                            className="flex-1 bg-border mx-2 h-0.5"
                          />
                        </div>
                        <div className="flex-1 pr-7">
                          <Skeleton className="h-5 w-[90px]" />
                          <Skeleton className="h-4 mt-2 w-[120px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              ) : (
                patientData &&
                billsData &&
                patientData.registered_date.length > 0 &&
                patientData.prescribed_date_time.length >= 0 &&
                (() => {
                  const TimeLineData: TimelineInstanceType[] = [];
                  patientData.registered_date_time.forEach((date_time) => {
                    TimeLineData.push({
                      time: date_time,
                      type: "Register",
                    });
                  });
                  patientData.prescribed_date_time.forEach((date_time) => {
                    TimeLineData.push({
                      time: date_time,
                      type: "Prescribe",
                    });
                  });
                  patientData.bed_info.forEach((bed) => {
                    TimeLineData.push({
                      time: bed.admission_at,
                      type: "BedIn",
                    });
                    TimeLineData.push({
                      time: bed.discharge_at,
                      type: bed.dischargeMarked ? "Discharged" : "BedOut",
                    });
                  });
                  billsData.forEach((bill) => {
                    TimeLineData.push({
                      time: bill.generated_at,
                      type: "Bill",
                    });
                  });
                  let bedStart = false;
                  const isBedExist = patientData.bed_info.length > 0;

                  return (
                    <ScrollArea className="mx-auto border rounded-lg m-2 h-min overflow-x-auto">
                      <Timeline orientation="horizontal" className="py-4 px-6">
                        {TimeLineData.sort((a, b) => b.time - a.time).map(
                          (event, index) => {
                            if (event.type === "BedIn") {
                              bedStart = false;
                            } else if (
                              event.type === "BedOut" ||
                              event.type === "Discharged"
                            ) {
                              bedStart = true;
                            }
                            return (
                              <TimelineItem key={index} className="">
                                {event.type === "BedIn" ? (
                                  <div className="h-4 border-l-2"></div>
                                ) : event.type === "BedOut" ||
                                  event.type === "Discharged" ? (
                                  <div className="h-4 border-l-2 border-t-2"></div>
                                ) : (
                                  <div
                                    className={`${
                                      isBedExist ? "h-4" : "hidden"
                                    } ${bedStart ? "border-t-2" : ""} `}
                                  ></div>
                                )}
                                <TimelineSeparator className="">
                                  <TimelineDot className="">
                                    {event.type === "Register" ? (
                                      <PencilLineIcon className="text-blue-600" />
                                    ) : event.type === "Prescribe" ? (
                                      <ClipboardPlusIcon className="text-green-500" />
                                    ) : event.type === "BedIn" ? (
                                      <CalendarPlus className="text-yellow-400" />
                                    ) : event.type === "BedOut" ||
                                      event.type === "Discharged" ? (
                                      <CalendarMinus className="text-red-500" />
                                    ) : event.type === "Bill" ? (
                                      <ReceiptText className="text-blue-600" />
                                    ) : (
                                      <CircleHelp />
                                    )}
                                  </TimelineDot>
                                  <TimelineConnector
                                    className=""
                                    hidden={index + 1 === TimeLineData.length}
                                  />
                                </TimelineSeparator>
                                <TimelineContent className="">
                                  <TimelineTitle
                                    className={`whitespace-nowrap`}
                                  >
                                    {event.type} on
                                  </TimelineTitle>
                                  <TimelineDescription className="text-xs line-clamp-2 truncate text-nowrap">
                                    {format(event.time, "do MMM yyyy")}
                                    <br />
                                    at {format(event.time, "hh:mm a")}
                                  </TimelineDescription>
                                </TimelineContent>
                              </TimelineItem>
                            );
                          }
                        )}
                      </Timeline>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  );
                })()
              )}

              {loader ? (
                <>
                  <div className="flex flex-row gap-x-2 gap-y-1 w-full p-1 justify-start bg-muted flex-wrap sticky top-0">
                    {Array.from({ length: 5 }, (_, i) => i).map((index) => (
                      <Skeleton
                        key={index}
                        className="h-7 w-24 rounded-md bg-background"
                      ></Skeleton>
                    ))}
                  </div>
                  <Skeleton className="m-2 h-svh" />
                </>
              ) : (
                <PatientHistoryTabs
                  handleBillIdSelection={handleBillIdSelection}
                  prescriptionsData={prescriptionsData}
                  billsData={billsData}
                />
              )}
            </div>
            {/* )} */}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PatientHistoryGlobalModal;

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
