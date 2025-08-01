"use client";
import React, { useEffect, useState } from "react";
import {
  Calculator,
  CalendarClockIcon,
  ClipboardPlusIcon,
  Phone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Trash, Plus, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  MedicineItems,
  MedicinesDetails,
  PharmacySelectedPatientType,
  PharmacyTypes,
  PrescriptionFormTypes,
  ServiceItems,
} from "@/types/FormTypes";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth, useOrganization, useUser } from "@clerk/nextjs";

const calculateTotalAmount = (
  medicines: MedicineItems[],
  services: ServiceItems[],
  discount: number = 0,
  taxPercentage: number = 0
): number => {
  const medicinesTotal = medicines.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const servicesTotal = services.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const subtotal = medicinesTotal + servicesTotal;
  const discountAmount = (subtotal * discount) / 100;
  const afterDiscount = subtotal - discountAmount;
  const taxAmount = (afterDiscount * taxPercentage) / 100;

  return afterDiscount + taxAmount;
};

const generateBillId = (): string => {
  return `BILL-${format(new Date(), "yyyyMMdd")}-${Math.floor(
    Math.random() * 1000
  )
    .toString()
    .padStart(3, "0")}`;
};

interface ServiceType {
  price: number;
  service_id: string;
  service_name: string;
}

interface BillFormTypes {
  selectedPatient?: PharmacySelectedPatientType;
  selectedPrescription?: PrescriptionFormTypes;
}

const BillForm = ({ selectedPatient, selectedPrescription }: BillFormTypes) => {
  const { orgId } = useAuth();
  const { user } = useUser();
  const { organization, isLoaded } = useOrganization();
  const [selectedMedicines, setSelectedMedicines] = useState<MedicineItems[]>(
    []
  );
  const [selectedServices, setSelectedServices] = useState<ServiceItems[]>([]);
  const [medicineToAdd, setMedicineToAdd] = useState<string>("");
  const [serviceToAdd, setServiceToAdd] = useState<ServiceType>();
  const [quantity, setQuantity] = useState<number>(1);
  const [discount, setDiscount] = useState<number>(0);
  const [taxPercentage, setTaxPercentage] = useState<number>(0);
  const [notes, setNotes] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<
    "Cash" | "Card" | "UPI" | "Online"
  >("Card");
  const [paymentStatus, setPaymentStatus] = useState<
    "Paid" | "Unpaid" | "Not Required" | "Refunded"
  >("Unpaid");

  const [medicines, setMedicines] = useState<MedicinesDetails[]>([]);
  const [services, setServices] = useState<ServiceType[]>([]);
  const [submissionLoader, setSubmissionLoader] = useState(false);

  const [prescribedMedicines, setprescribedMedicines] = useState<
    MedicineItems[]
  >([]);

  useEffect(() => {
    if (selectedPrescription) {
      setprescribedMedicines(
        selectedPrescription.medicines.map((medicine) => ({
          ...medicine,
          quantity: 0,
          price: 0,
        }))
      );
    }
  }, [selectedPrescription]);

  useEffect(() => {
    const fetchmedicine = async () => {
      if (orgId) {
        const diseaseDataRef = collection(db, "doctor", orgId, "medicinesData");
        const snapshot = await getDocs(diseaseDataRef);

        if (snapshot.empty) {
          setMedicines([]);
        }
        const medicineData = snapshot.docs.map((doc) => ({
          ...doc.data(),
        }));
        setMedicines(medicineData as MedicinesDetails[]);
      }
    };
    fetchmedicine();
  }, [orgId]);

  useEffect(() => {
    if (isLoaded && organization && organization.publicMetadata.services) {
      setServices(organization.publicMetadata.services as ServiceType[]);
    } else {
      setServices([]);
    }
  }, [isLoaded, orgId, organization]);

  useEffect(() => {
    if (selectedPatient) {
      form.reset({
        name: selectedPatient.name,
        mobile: selectedPatient.mobile,
        gender: selectedPatient.gender,
      });
    } else {
      form.reset({
        name: "",
        mobile: "",
        gender: "Male",
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPatient]);

  const form = useForm<{
    name: string;
    mobile: string;
    gender: "Male" | "Female" | "Other";
  }>({
    defaultValues: {
      name: selectedPatient?.name || "",
      mobile: selectedPatient?.mobile || "",
      gender: selectedPatient?.gender || "Male",
    },
  });

  const handleAddMedicine = () => {
    if (!medicineToAdd) return;
    const medicineDetails = medicines.find((med) => med.id === medicineToAdd);
    if (medicineDetails) {
      setSelectedMedicines([
        ...selectedMedicines,
        {
          ...medicineDetails,
          quantity: quantity,
          price: 0,
          dosages: {
            morning: "",
            evening: "",
            afternoon: "",
            night: "",
          },
        },
      ]);
      setMedicineToAdd("");
      setQuantity(1);
    }
  };

  const handleAddService = () => {
    if (!serviceToAdd) return;

    if (serviceToAdd) {
      setSelectedServices([
        ...selectedServices,
        {
          ...serviceToAdd,
          quantity: 1,
        },
      ]);
      setServiceToAdd(undefined);
    }
  };

  const handleRemoveMedicine = (index: number) => {
    const newMedicines = [...selectedMedicines];
    newMedicines.splice(index, 1);
    setSelectedMedicines(newMedicines);
  };

  const handleRemoveService = (index: number) => {
    const newServices = [...selectedServices];
    newServices.splice(index, 1);
    setSelectedServices(newServices);
  };

  const handleUpdateMedicineQuantity = (index: number, quantity: number) => {
    const newMedicines = [...selectedMedicines];
    newMedicines[index] = {
      ...newMedicines[index],
      quantity,
    };
    setSelectedMedicines(newMedicines);
  };

  const handleUpdateMedicinePrice = (index: number, price: number) => {
    const newMedicines = [...selectedMedicines];
    newMedicines[index] = {
      ...newMedicines[index],
      price,
    };
    setSelectedMedicines(newMedicines);
  };

  const handleUpdateServiceQuantity = (index: number, quantity: number) => {
    const newServices = [...selectedServices];
    newServices[index] = {
      ...newServices[index],
      quantity,
    };
    setSelectedServices(newServices);
  };

  const handleUpdateServicePrice = (index: number, price: number) => {
    const newServices = [...selectedServices];
    newServices[index] = {
      ...newServices[index],
      price,
    };
    setSelectedServices(newServices);
  };

  const handleUpdatePrescribedMedicineQuantity = (
    index: number,
    quantity: number
  ) => {
    const newMedicines = [...prescribedMedicines];
    newMedicines[index] = {
      ...newMedicines[index],
      quantity,
    };
    setprescribedMedicines(newMedicines);
  };

  const handleUpdatePrescribedMedicinePrice = (
    index: number,
    price: number
  ) => {
    const newMedicines = [...prescribedMedicines];
    newMedicines[index] = {
      ...newMedicines[index],
      price,
    };
    setprescribedMedicines(newMedicines);
  };

  const totalAmount = calculateTotalAmount(
    selectedPrescription ? prescribedMedicines : selectedMedicines,
    selectedServices,
    discount,
    taxPercentage
  );

  const handleSaveBill = () => {
    const formValues = form.getValues();

    if (user && orgId) {
      const newBill = {
        bill_id: generateBillId(),
        name: formValues.name,
        mobile: formValues.mobile,
        gender: formValues.gender,
        generated_at: Date.now(),
        generated_by: {
          id: user.id,
          name: user.fullName || "",
          email: user.primaryEmailAddress?.emailAddress || "",
        },
        payment_status: paymentStatus,
        total_amount: totalAmount,
        discount: discount,
        tax_percentage: taxPercentage,
        notes: notes,
        payment_method: paymentMethod,
      };
      const generatdBill: PharmacyTypes = selectedPatient
        ? selectedPrescription
          ? {
              ...newBill,
              prescription_id: selectedPrescription.prescription_id,
              patient_id: selectedPatient.patient_id,
              medicines: prescribedMedicines,
              prescribed_by: {
                id: selectedPrescription.prescribed_by.id,
                name: selectedPrescription.prescribed_by.name,
                email: selectedPrescription.prescribed_by.email,
              },
              services: [],
            }
          : {
              ...newBill,
              patient_id: selectedPatient.patient_id,
              medicines: selectedMedicines,
              services: selectedServices,
            }
        : {
            ...newBill,
            medicines: selectedMedicines,
            services: selectedServices,
          };

      toast.promise(
        async () => {
          setSubmissionLoader(true);
          await setDoc(
            doc(db, "doctor", orgId, "bills", newBill.bill_id),
            generatdBill
          ).then(
            () => {
              setSubmissionLoader(false);
              form.reset();
              setSelectedMedicines([]);
              setSelectedServices([]);
              setDiscount(0);
              setTaxPercentage(0);
              setNotes("");
              setPaymentMethod("Cash");
              setPaymentStatus("Unpaid");
            },
            () => {
              setSubmissionLoader(false);
            }
          );
        },
        {
          loading: "Loading...",
          success: "Bill generated successfully",
          error: "Failed to generate bill",
        },
        {
          position: "bottom-left",
        }
      );
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden p-0 gap-0">
      <CardHeader hidden className="p-0 gap-0">
        <CardTitle hidden></CardTitle>
        <CardDescription hidden></CardDescription>
      </CardHeader>

      <AnimatePresence mode="wait">
        {(selectedPatient || selectedPrescription) && (
          <motion.div
            key="patient-prescription-header"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="w-full bg-muted/50 overflow-hidden shadow-sm"
          >
            <div className="px-4 py-2 gap-y-1 flex flex-wrap border-b items-center justify-between">
              {/* Patient Info */}
              {selectedPatient && (
                <motion.div
                  key="patient-info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-1 items-center space-x-2 dm:space-x-4"
                >
                  <User className="size-9 md:size-11 border border-muted-foreground rounded-full p-2 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm md:text-base font-medium line-clamp-1">
                        {selectedPatient.name}
                      </h3>
                      <Badge
                        variant={"outline"}
                        className="bg-primary/10 border-primary text-primary rounded-full line-clamp-1"
                      >
                        {selectedPatient.patient_id ?? "-"}
                      </Badge>
                    </div>
                    <div className="flex items-center mt-1 text-sm text-muted-foreground gap-3">
                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                        <span>{selectedPatient.gender ?? "-"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span className="line-clamp-1">
                          {selectedPatient.mobile}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Prescription Info */}
              {selectedPrescription ? (
                <motion.div
                  key="prescription-info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center divide-x-0 md:divide-x divide-gray-700 gap-x-3"
                >
                  <div className="flex items-center">
                    <CalendarClockIcon
                      size={36}
                      className="hidden md:block mr-3 border border-foreground rounded-full p-2"
                    />
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-xs text-muted-foreground">
                        Prescribed at
                      </span>
                      <span className="text-base font-medium">
                        {format(
                          new Date(selectedPrescription.created_at || 0),
                          "do MMM yyyy"
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center pl-3">
                    <ClipboardPlusIcon
                      size={36}
                      className="hidden md:block mr-3 bg-green-500/10 text-green-600 border border-green-600 rounded-full p-2"
                    />
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-xs text-muted-foreground">
                        Prescribed by
                      </span>
                      <span className="text-base font-medium">
                        {selectedPrescription.prescribed_by.name}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.p
                  key="new-bill"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.15 }}
                  className="bg-green-500/10 font-medium text-green-600 border border-green-600 rounded-md py-1.5 px-4 ml-auto"
                >
                  New Bill
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CardContent className="overflow-auto flex-grow p-6 bg-card">
        {selectedPatient ? (
          selectedPrescription ? (
            <Form {...form}>
              {/* Prescription Details */}
              <div className="w-full flex flex-col">
                <CommonHeader label={"Prescription Details"} />

                <div className="space-y-3 mt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Prescription Id</p>
                      <div className="flex items-center h-9 text-muted-foreground w-full rounded-md border px-3 text-base md:text-sm !leading-9 shadow-sm">
                        {selectedPrescription.prescription_id}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Medicines Details */}
              <div className="w-full flex flex-col mt-6">
                <CommonHeader label={"Medicines Details"} />

                <div className="border rounded-md overflow-hidden mt-3">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Medicine</TableHead>
                        <TableHead>Dosage</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price(₹)</TableHead>
                        <TableHead>Total(₹)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prescribedMedicines.length > 0 ? (
                        prescribedMedicines.map((med, index) => (
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
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={med.quantity}
                                onChange={(e) =>
                                  handleUpdatePrescribedMedicineQuantity(
                                    index,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                wrapClassName="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={med.price}
                                onChange={(e) =>
                                  handleUpdatePrescribedMedicinePrice(
                                    index,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                wrapClassName="w-28"
                              />
                            </TableCell>
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
              {/* Billing Details */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <CommonHeader label={"Bill Details"} />

                  <div className="space-y-3 mt-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <FormLabel>Discount (%)</FormLabel>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={discount}
                          onChange={(e) =>
                            setDiscount(parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <FormLabel>Tax (%)</FormLabel>
                        <Input
                          type="number"
                          min="0"
                          value={taxPercentage}
                          onChange={(e) =>
                            setTaxPercentage(parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Payment Status</FormLabel>
                      <Select
                        value={paymentStatus}
                        onValueChange={(value) =>
                          setPaymentStatus(
                            value as
                              | "Paid"
                              | "Unpaid"
                              | "Not Required"
                              | "Refunded"
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Unpaid">Unpaid</SelectItem>
                          <SelectItem value="Not Required">
                            Not Required
                          </SelectItem>
                          <SelectItem value="Refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {paymentStatus === "Paid" && (
                      <div className="space-y-2">
                        <FormLabel>Payment Method</FormLabel>
                        <Select
                          value={paymentMethod}
                          onValueChange={(value) =>
                            setPaymentMethod(
                              value as "Cash" | "Card" | "UPI" | "Online"
                            )
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Card">Card</SelectItem>
                            <SelectItem value="UPI">UPI</SelectItem>
                            <SelectItem value="Online">Online</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <FormLabel>Notes</FormLabel>
                      <Input
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Card className="flex flex-col overflow-hidden gap-0 p-0">
                  <CardHeader className="py-3 bg-muted/50 border-b gap-0">
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
                        {prescribedMedicines
                          .reduce(
                            (sum, med) => sum + med.price * med.quantity,
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Services Total:</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Discount ({discount}%):</span>
                        <span>
                          -₹
                          {(
                            prescribedMedicines.reduce(
                              (sum, med) => sum + med.price * med.quantity,
                              0
                            ) *
                            (discount / 100)
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {taxPercentage > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Tax ({taxPercentage}%):</span>
                        <span>
                          +₹
                          {(
                            prescribedMedicines.reduce(
                              (sum, med) => sum + med.price * med.quantity,
                              0
                            ) *
                            (1 - discount / 100) *
                            (taxPercentage / 100)
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t py-3 flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </CardFooter>
                </Card>
              </div>
            </Form>
          ) : (
            <Form {...form}>
              {/* Medicines Section */}
              <div className="mt-0">
                <CommonHeader label={"Medicines"} />

                <div className="flex gap-2 mb-2 mt-3">
                  <Select
                    value={medicineToAdd}
                    onValueChange={setMedicineToAdd}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select medicine" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicines.map((med) => (
                        <SelectItem key={med.id} value={med.id}>
                          {med.medicineName} ({med.type})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    wrapClassName="w-24"
                    placeholder="Qty"
                  />

                  <Button
                    variant={"default"}
                    effect={"ringHover"}
                    type="button"
                    size="icon"
                    className="shrink-0"
                    onClick={handleAddMedicine}
                    disabled={!medicineToAdd}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Medicine</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price(₹)</TableHead>
                        <TableHead>Total(₹)</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedMedicines.length > 0 ? (
                        selectedMedicines.map((med, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-transparent"
                          >
                            <TableCell>
                              {med.medicineName}
                              <div className="text-xs text-muted-foreground">
                                {med.type}, {med.instruction}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={med.quantity}
                                onChange={(e) =>
                                  handleUpdateMedicineQuantity(
                                    index,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                wrapClassName="w-20"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={med.price}
                                onChange={(e) =>
                                  handleUpdateMedicinePrice(
                                    index,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                wrapClassName="w-28"
                              />
                            </TableCell>
                            <TableCell>
                              ₹{(med.price * med.quantity).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="destructive"
                                className="shrink-0"
                                size="icon"
                                onClick={() => handleRemoveMedicine(index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
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

              {/* Services Section */}
              <div className="mt-6">
                <CommonHeader label={"Services"} />

                <div className="flex gap-2 mb-2 mt-3">
                  <Select
                    value={serviceToAdd?.service_id ?? ""}
                    onValueChange={(value) => {
                      setServiceToAdd(
                        services.find((service) => service.service_id === value)
                      );
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem
                          key={service.service_id}
                          value={service.service_id}
                        >
                          {service.service_name} (₹{service.price.toFixed(2)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    variant={"default"}
                    effect={"ringHover"}
                    type="button"
                    size="icon"
                    className="shrink-0"
                    onClick={handleAddService}
                    disabled={!serviceToAdd}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Service</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Price(₹)</TableHead>
                        <TableHead>Total(₹)</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedServices.length > 0 ? (
                        selectedServices.map((service, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-transparent"
                          >
                            <TableCell>{service.service_name}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={service.quantity || 1}
                                onChange={(e) =>
                                  handleUpdateServiceQuantity(
                                    index,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-20 h-8 focus-visible:ring-[#2563eb]"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={service.price || 1}
                                onChange={(e) =>
                                  handleUpdateServicePrice(
                                    index,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-28 h-8 focus-visible:ring-[#2563eb]"
                              />
                            </TableCell>
                            <TableCell>
                              ₹
                              {(
                                service.price * (service.quantity || 1)
                              ).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveService(index)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
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

              {/* Billing Details */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <CommonHeader label="Bill Details" />

                  <div className="space-y-3 mt-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <FormLabel>Discount (%)</FormLabel>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={discount}
                          onChange={(e) =>
                            setDiscount(parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <FormLabel>Tax (%)</FormLabel>
                        <Input
                          type="number"
                          min="0"
                          value={taxPercentage}
                          onChange={(e) =>
                            setTaxPercentage(parseFloat(e.target.value) || 0)
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Payment Status</FormLabel>
                      <Select
                        value={paymentStatus}
                        onValueChange={(value) =>
                          setPaymentStatus(
                            value as
                              | "Paid"
                              | "Unpaid"
                              | "Not Required"
                              | "Refunded"
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Unpaid">Unpaid</SelectItem>
                          <SelectItem value="Not Required">
                            Not Required
                          </SelectItem>
                          <SelectItem value="Refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {paymentStatus === "Paid" && (
                      <div className="space-y-2">
                        <FormLabel>Payment Method</FormLabel>
                        <Select
                          value={paymentMethod}
                          onValueChange={(value) =>
                            setPaymentMethod(
                              value as "Cash" | "Card" | "UPI" | "Online"
                            )
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cash">Cash</SelectItem>
                            <SelectItem value="Card">Card</SelectItem>
                            <SelectItem value="UPI">UPI</SelectItem>
                            <SelectItem value="Online">Online</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <FormLabel>Notes</FormLabel>
                      <Input
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <Card className="flex flex-col overflow-hidden gap-0 p-0">
                  <CardHeader className="py-3 bg-muted/50 border-b gap-0">
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
                        {selectedMedicines
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
                        {selectedServices
                          .reduce(
                            (sum, service) =>
                              sum + service.price * (service.quantity || 1),
                            0
                          )
                          .toFixed(2)}
                      </span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Discount ({discount}%):</span>
                        <span>
                          -₹
                          {(
                            (selectedMedicines.reduce(
                              (sum, med) => sum + med.price * med.quantity,
                              0
                            ) +
                              selectedServices.reduce(
                                (sum, service) =>
                                  sum + service.price * (service.quantity || 1),
                                0
                              )) *
                            (discount / 100)
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {taxPercentage > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Tax ({taxPercentage}%):</span>
                        <span>
                          +₹
                          {(
                            (selectedMedicines.reduce(
                              (sum, med) => sum + med.price * med.quantity,
                              0
                            ) +
                              selectedServices.reduce(
                                (sum, service) =>
                                  sum + service.price * (service.quantity || 1),
                                0
                              )) *
                            (1 - discount / 100) *
                            (taxPercentage / 100)
                          ).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="border-t py-3 flex justify-between font-bold text-lg">
                    <span>Total Amount:</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </CardFooter>
                </Card>
              </div>
            </Form>
          )
        ) : (
          <Form {...form}>
            {/* Patient Information */}
            <CommonHeader label="Patient Details" />
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Patient Name..."
                        {...field}
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mobile Number..."
                        {...field}
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* Medicines Section */}
            <div className="mt-6">
              <CommonHeader label="Medicines" />

              <div className="flex gap-2 mb-2 mt-3">
                <Select value={medicineToAdd} onValueChange={setMedicineToAdd}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select medicine" />
                  </SelectTrigger>
                  <SelectContent>
                    {medicines.map((med) => (
                      <SelectItem key={med.id} value={med.id}>
                        {med.medicineName} ({med.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  wrapClassName="w-24"
                  placeholder="Qty"
                />

                <Button
                  variant={"default"}
                  effect={"ringHover"}
                  type="button"
                  size="icon"
                  className="shrink-0"
                  onClick={handleAddMedicine}
                  disabled={!medicineToAdd}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Medicine</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price(₹)</TableHead>
                      <TableHead>Total(₹)</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedMedicines.length > 0 ? (
                      selectedMedicines.map((med, index) => (
                        <TableRow className="hover:bg-transparent" key={index}>
                          <TableCell>
                            {med.medicineName}
                            <div className="text-xs text-muted-foreground">
                              {med.type}, {med.instruction}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={med.quantity}
                              onChange={(e) =>
                                handleUpdateMedicineQuantity(
                                  index,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              wrapClassName="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={med.price}
                              onChange={(e) =>
                                handleUpdateMedicinePrice(
                                  index,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              wrapClassName="w-28"
                            />
                          </TableCell>
                          <TableCell>
                            ₹{(med.price * med.quantity).toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="destructive"
                              className="shrink-0"
                              size="icon"
                              onClick={() => handleRemoveMedicine(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
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

            {/* Services Section */}
            <div className="mt-6">
              <CommonHeader label="Services" />

              <div className="flex gap-2 mb-2 mt-3">
                <Select
                  value={serviceToAdd?.service_id ?? ""}
                  onValueChange={(value) => {
                    setServiceToAdd(
                      services.find((service) => service.service_id === value)
                    );
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem
                        key={service.service_id}
                        value={service.service_id}
                      >
                        {service.service_name} (₹{service.price.toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant={"default"}
                  effect={"ringHover"}
                  type="button"
                  size="icon"
                  className="shrink-0"
                  onClick={handleAddService}
                  disabled={!serviceToAdd}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="border rounded-md overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Service</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Price(₹)</TableHead>
                      <TableHead>Total(₹)</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedServices.length > 0 ? (
                      selectedServices.map((service, index) => (
                        <TableRow className="hover:bg-transparent" key={index}>
                          <TableCell>{service.service_name}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={service.quantity || 1}
                              onChange={(e) =>
                                handleUpdateServiceQuantity(
                                  index,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              wrapClassName="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="1"
                              value={service.price || 1}
                              onChange={(e) =>
                                handleUpdateServicePrice(
                                  index,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              wrapClassName="w-28"
                            />
                          </TableCell>
                          <TableCell>
                            ₹
                            {(service.price * (service.quantity || 1)).toFixed(
                              2
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="destructive"
                              className="shrink-0"
                              size="icon"
                              onClick={() => handleRemoveService(index)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
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

            {/* Billing Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <CommonHeader label="Bill Details" />

                <div className="space-y-3 mt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <FormLabel>Discount (%)</FormLabel>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={discount}
                        onChange={(e) =>
                          setDiscount(parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <FormLabel>Tax (%)</FormLabel>
                      <Input
                        type="number"
                        min="0"
                        value={taxPercentage}
                        onChange={(e) =>
                          setTaxPercentage(parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <FormLabel>Payment Status</FormLabel>
                    <Select
                      value={paymentStatus}
                      onValueChange={(value) =>
                        setPaymentStatus(
                          value as
                            | "Paid"
                            | "Unpaid"
                            | "Not Required"
                            | "Refunded"
                        )
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Paid">Paid</SelectItem>
                        <SelectItem value="Unpaid">Unpaid</SelectItem>
                        <SelectItem value="Not Required">
                          Not Required
                        </SelectItem>
                        <SelectItem value="Refunded">Refunded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentStatus === "Paid" && (
                    <div className="space-y-2">
                      <FormLabel>Payment Method</FormLabel>
                      <Select
                        value={paymentMethod}
                        onValueChange={(value) =>
                          setPaymentMethod(
                            value as "Cash" | "Card" | "UPI" | "Online"
                          )
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="Online">Online</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <FormLabel>Notes</FormLabel>
                    <Input
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Card className="flex flex-col overflow-hidden gap-0 p-0">
                <CardHeader className="py-3 bg-muted/50 border-b gap-0">
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
                      {selectedMedicines
                        .reduce((sum, med) => sum + med.price * med.quantity, 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Services Total:</span>
                    <span>
                      ₹
                      {selectedServices
                        .reduce(
                          (sum, service) =>
                            sum + service.price * (service.quantity || 1),
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Discount ({discount}%):</span>
                      <span>
                        -₹
                        {(
                          (selectedMedicines.reduce(
                            (sum, med) => sum + med.price * med.quantity,
                            0
                          ) +
                            selectedServices.reduce(
                              (sum, service) =>
                                sum + service.price * (service.quantity || 1),
                              0
                            )) *
                          (discount / 100)
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {taxPercentage > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax ({taxPercentage}%):</span>
                      <span>
                        +₹
                        {(
                          (selectedMedicines.reduce(
                            (sum, med) => sum + med.price * med.quantity,
                            0
                          ) +
                            selectedServices.reduce(
                              (sum, service) =>
                                sum + service.price * (service.quantity || 1),
                              0
                            )) *
                          (1 - discount / 100) *
                          (taxPercentage / 100)
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t py-3 flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </CardFooter>
              </Card>
            </div>
          </Form>
        )}
      </CardContent>

      <CardFooter className="border-t p-4 bg-muted/50">
        <div className="flex gap-2 ml-auto">
          <Button
            type="button"
            variant="outline"
            className="gap-1"
            onClick={() => {
              form.reset();
              setSelectedMedicines([]);
              setSelectedServices([]);
            }}
          >
            <Calculator className="h-4 w-4" />
            Reset
          </Button>

          <Button
            type="button"
            effect={"ringHover"}
            onClick={handleSaveBill}
            disabled={
              !form.getValues().name ||
              !form.getValues().mobile ||
              (!selectedPrescription &&
                selectedMedicines.length === 0 &&
                selectedServices.length === 0)
            }
            loading={submissionLoader}
            loadingText="Saving"
            icon={Save}
            iconPlacement="right"
          >
            Save Bill
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BillForm;

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
