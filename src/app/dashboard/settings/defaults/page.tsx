"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimatePresence, motion } from "framer-motion";
import { RegistrationOptions } from "@/components/Settings/DefaultsTabs/RegistrationOptions";
import { PrescriptionOptions } from "@/components/Settings/DefaultsTabs/PrescriptionOptions";
import { PharmacyOptions } from "@/components/Settings/DefaultsTabs/PharmacyOptions";
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
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import GeneralOptions from "@/components/Settings/DefaultsTabs/GeneralOptions";
import { AdmissionOptions } from "@/components/Settings/DefaultsTabs/AdmissionOptions";

const tabs = [
  {
    name: "General",
    value: "General",
    component: GeneralOptions,
  },
  {
    name: "Registration Settings",
    value: "Registration",
    component: RegistrationOptions,
  },
  {
    name: "Prescription Preferences",
    value: "Prescription",
    component: PrescriptionOptions,
  },
  {
    name: "Admission Settings",
    value: "Admission",
    component: AdmissionOptions,
  },
  {
    name: "Pharmacy Settings",
    value: "Pharmacy",
    component: PharmacyOptions,
  },
];

export default function SettingsMedicineInfoPage() {
  const [tabValue, setTabValue] = useState(tabs[0].value);
  return (
    <Tabs
      orientation="vertical"
      defaultValue={tabs[0].value}
      onValueChange={setTabValue}
      className="w-full flex items-start gap-2 md:gap-4 justify-center py-2 sm:py-5 px-2 md:px-5 flex-col md:flex-row 2xl:gap-5 2xl:justify-center"
    >
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            variant="secondary"
            className="sticky top-[60px] z-10 flex w-full md:hidden"
            aria-label={`Open tab selector, current tab is ${tabValue}`}
          >
            {tabValue} <ChevronDown />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="md:hidden">
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle>Select a Default Type</DrawerTitle>
              <DrawerDescription>
                Choose the section you want to configure.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4 py-0">
              <TabsList className="flex md:hidden bg-transparent p-0 rounded-none flex-col items-center justify-start gap-1 h-auto mx-0">
                {tabs.map((tab) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="justify-start rounded-none data-[state=active]:shadow-none py-1.5 line-clamp-1 text-start"
                  >
                    {tab.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>

      <TabsList className="hidden md:flex sticky top-20 bg-transparent p-0 rounded-none flex-col items-start justify-start gap-1 border-r min-h-96 mx-0 mr-0 xl:mr-10 min-w-48 lg:min-w-56">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="justify-start rounded-none data-[state=active]:shadow-none py-1.5 line-clamp-1 text-start"
          >
            {tab.name}
          </TabsTrigger>
        ))}
      </TabsList>

      <AnimatePresence>
        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="mt-0 focus-visible:ring-0 max-w-4xl w-full"
          >
            <motion.div
              key={tab.value}
              className="flex flex-col mx-0 w-full"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 50,
                  transition: { type: "tween", ease: "anticipate" },
                },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { type: "tween", ease: "anticipate" },
                },
              }}
            >
              <tab.component />
            </motion.div>
          </TabsContent>
        ))}
      </AnimatePresence>
    </Tabs>
  );
}
