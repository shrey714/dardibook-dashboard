"use client";
import React, { useState } from "react";
import { Bed, FileText, Calculator, PlusIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PharmacySelectedPatientType,
  PharmacyTypes,
  PrescriptionFormTypes,
} from "@/types/FormTypes";
import TodayRegisteredPatients from "@/components/Pharmacy/tabscontent/TodayRegisteredPatients";
import PatientsInBed from "@/components/Pharmacy/tabscontent/PatientsInBed";
import BillsGenerated from "@/components/Pharmacy/tabscontent/BillsGenerated";
import BillsForPatient from "@/components/Pharmacy/RightScroll/BillsForPatient";
import BillHistoryModal from "@/components/Pharmacy/BillHistoryModal";
import PrescriptionsForPatient from "@/components/Pharmacy/middleForm/PrescriptionsForPatient";
import BillForm from "@/components/Pharmacy/middleForm/BillForm";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const Medical = () => {
  const isDesktop = useMediaQuery("(min-width: 1536px)");
  const [billModal, setbillModal] = useState(false);
  const [selectedPatient, setSelectedPatient] =
    useState<PharmacySelectedPatientType>();
  const [selectedBillData, setselectedBillData] = useState<PharmacyTypes>();
  const [selectedPrescription, setselectedPrescription] =
    useState<PrescriptionFormTypes>();

  const handlePatientSelect = (patient: PharmacySelectedPatientType) => {
    setSelectedPatient(patient);
  };

  const handleBedPatientSelect = (patient: PharmacySelectedPatientType) => {
    setSelectedPatient(patient);
  };

  const handleViewBill = (bill: PharmacyTypes) => {
    setbillModal(true);
    setselectedBillData(bill);
  };

  return (
    <main
      className={cn(
        "min-h-[calc(100svh-53px)] bg-background",
        isDesktop && "p-2 pt-3"
      )}
    >
      <BillHistoryModal
        billModal={billModal}
        setbillModal={setbillModal}
        selectedBillData={selectedBillData}
        setselectedBillData={setselectedBillData}
      />
      <div
        className={cn(
          "w-full p-0 flex flex-row items-center absolute top-[35px]",
          isDesktop ? "z-[1]" : "z-[2] hidden sm:flex"
        )}
      >
        <span className="flex flex-1 h-[2px] bg-gradient-to-r from-transparent to-primary"></span>
        <div className=" flex items-center justify-center">
          <p className="text-primary w-auto px-3 bg-background py-1 font-medium text-base rounded-full border-primary border-[2px]">
            Pharmacy Space
          </p>
        </div>
        <span className="flex flex-1 h-[2px] bg-gradient-to-l from-transparent to-primary"></span>
      </div>

      <div
        className={cn(
          isDesktop
            ? "grid gap-2 h-full"
            : "w-full flex flex-row bg-background sticky top-0 rounded-none p-1 border-b shadow-sm sm:p-2 z-[1]"
        )}
        style={
          isDesktop ? { gridTemplateColumns: "repeat(18, minmax(0, 1fr))" } : {}
        }
      >
        {/* Lists Section */}
        {isDesktop ? (
          <div className="col-span-5 overflow-hidden flex flex-col sticky top-3 h-[calc(100svh-73px)]">
            <Tabs defaultValue="registered" className="h-full">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger
                  value="registered"
                  className="flex items-center gap-1"
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Registered</span>
                </TabsTrigger>
                <TabsTrigger value="inbed" className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span className="hidden sm:inline">In Bed</span>
                </TabsTrigger>
                <TabsTrigger value="bills" className="flex items-center gap-1">
                  <Calculator className="h-4 w-4" />
                  <span className="hidden sm:inline">Bills</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent
                className="[--content-height:calc(100svh-252px)]"
                value="registered"
              >
                <TodayRegisteredPatients
                  onSelectPatient={handlePatientSelect}
                />
              </TabsContent>

              <TabsContent
                className="[--content-height:calc(100svh-296px)]"
                value="inbed"
              >
                <PatientsInBed onSelectPatient={handleBedPatientSelect} />
              </TabsContent>

              <TabsContent
                className="[--content-height:calc(100svh-296px)]"
                value="bills"
              >
                <BillsGenerated onViewBill={handleViewBill} />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Select Patient</Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto w-full max-w-lg px-1">
                <DrawerHeader className="px-0 pt-0">
                  <DrawerTitle hidden>Select Patient</DrawerTitle>
                  <DrawerDescription hidden></DrawerDescription>
                </DrawerHeader>
                {/* Lists Section */}
                <div className="">
                  <Tabs defaultValue="registered">
                    <TabsList className="grid grid-cols-3">
                      <TabsTrigger
                        value="registered"
                        className="flex items-center gap-1"
                      >
                        <FileText className="h-4 w-4" />
                        <span className="hidden sm:inline">Registered</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="inbed"
                        className="flex items-center gap-1"
                      >
                        <Bed className="h-4 w-4" />
                        <span className="hidden sm:inline">In Bed</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="bills"
                        className="flex items-center gap-1"
                      >
                        <Calculator className="h-4 w-4" />
                        <span className="hidden sm:inline">Bills</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent
                      className="[--content-height:400px]"
                      value="registered"
                    >
                      <TodayRegisteredPatients
                        onSelectPatient={handlePatientSelect}
                      />
                    </TabsContent>

                    <TabsContent
                      className="[--content-height:calc(400px-44px)]"
                      value="inbed"
                    >
                      <PatientsInBed onSelectPatient={handleBedPatientSelect} />
                    </TabsContent>

                    <TabsContent
                      className="[--content-height:calc(400px-44px)]"
                      value="bills"
                    >
                      <BillsGenerated onViewBill={handleViewBill} />
                    </TabsContent>
                  </Tabs>
                </div>
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        )}

        {/* Bill Form Section */}
        {isDesktop && (
          <motion.div
            layout
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="overflow-hidden mt-3"
            style={{
              gridColumn: selectedPatient
                ? "span 12 / span 12"
                : "span 13 / span 13",
            }}
          >
            {selectedPatient && (
              <PrescriptionsForPatient
                selectedPatient={selectedPatient}
                setselectedPrescription={setselectedPrescription}
                selectedPrescription={selectedPrescription}
              />
            )}
            <motion.div
              layout
              transition={{ duration: 0.15, ease: "easeInOut" }}
            >
              <BillForm
                selectedPatient={selectedPatient}
                selectedPrescription={selectedPrescription}
              />
            </motion.div>
          </motion.div>
        )}

        {/* Bill History Section */}
        {isDesktop && selectedPatient && (
          <ScrollArea
            showScrollbar={false}
            className="col-span-1 overflow-hidden flex flex-col !sticky top-3 h-[calc(100svh-73px)]"
          >
            <div className="bg-background rounded-none sticky top-0 pb-3">
              <Button
                disabled={!selectedPatient}
                variant={"outline"}
                onClick={() => {
                  setSelectedPatient(undefined);
                  setselectedPrescription(undefined);
                }}
                className="text-sm h-auto border-2 text-foreground shadow rounded-md w-full flex items-center justify-center py-2 flex-col gap-y-1.5 transition-all"
              >
                <PlusIcon className="text-muted-foreground !size-6" />
                <p className="text-sm text-muted-foreground leading-tight line-clamp-1">
                  Add
                </p>
              </Button>
            </div>
            <BillsForPatient
              selectedPatient={selectedPatient}
              onViewBill={handleViewBill}
            />
          </ScrollArea>
        )}

        {!isDesktop && selectedPatient && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="ml-auto mr-1 sm:mr-2">
                Bills
              </Button>
            </SheetTrigger>
            <SheetContent className="w-28 p-2 pt-12">
              <SheetHeader>
                <SheetTitle hidden>Bills</SheetTitle>
                <SheetDescription hidden></SheetDescription>
              </SheetHeader>
              <ScrollArea
                showScrollbar={false}
                className="col-span-1 overflow-hidden flex flex-col !sticky top-3 h-[calc(100svh-64px)]"
              >
                <BillsForPatient
                  selectedPatient={selectedPatient}
                  onViewBill={handleViewBill}
                />
              </ScrollArea>
            </SheetContent>
          </Sheet>
        )}

        {!isDesktop && selectedPatient && (
          <Button
            variant={"outline"}
            onClick={() => {
              setSelectedPatient(undefined);
              setselectedPrescription(undefined);
            }}
            className="mx-0"
          >
            <PlusIcon className="text-muted-foreground !size-6" />
            <p className="text-sm text-muted-foreground leading-tight line-clamp-1">
              Add
            </p>
          </Button>
        )}
      </div>

      {/* Bill Form Section */}
      {!isDesktop && (
        <motion.div
          layout
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="overflow-hidden pt-1 pb-2 px-1 sm:px-2"
        >
          {selectedPatient && (
            <PrescriptionsForPatient
              selectedPatient={selectedPatient}
              setselectedPrescription={setselectedPrescription}
              selectedPrescription={selectedPrescription}
            />
          )}
          <motion.div layout transition={{ duration: 0.15, ease: "easeInOut" }}>
            <BillForm
              selectedPatient={selectedPatient}
              selectedPrescription={selectedPrescription}
            />
          </motion.div>
        </motion.div>
      )}
    </main>
  );
};

export default Medical;
