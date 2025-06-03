"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import Header from "./Header";
import Footer from "./Footer";
import RegistrationPrint from "@/components/PrintHandeler/PrintTemplates/RegistrationPrint";
import PrescriptionPrint from "@/components/PrintHandeler/PrintTemplates/PrescriptionPrint";
import BillReceiptPrint from "@/components/PrintHandeler/PrintTemplates/BillReceiptPrint";
import toast from "react-hot-toast";

type PrintHandelerProps =
  | {
      printType: "registration";
      data: RegistrationData;
      buttonProps?: React.ComponentProps<typeof Button>;
      children: ReactNode;
    }
  | {
      printType: "prescription";
      data: PrescriptionData;
      buttonProps?: React.ComponentProps<typeof Button>;
      children: ReactNode;
    }
  | {
      printType: "bill";
      data: BillData;
      buttonProps?: React.ComponentProps<typeof Button>;
      children: ReactNode;
    };

export default function PrintButton({
  printType,
  data,
  buttonProps,
  children,
}: PrintHandelerProps) {
  const printComponentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printComponentRef,
    documentTitle: `Clinic-${printType}-${
      new Date().toISOString().split("T")[0]
    }`,
    onBeforePrint: () => {
      return toast.promise(
        async () => {
          new Promise<void>((resolve) => {
            console.log("Preparing print content...");
            resolve();
          });
        },
        {
          loading: "Printing...",
          success: "Print generated successfully",
          error: "Failed to generate print",
        },
        {
          position: "bottom-right",
        }
      );
    },
    onAfterPrint: () => {
      console.log("Print completed");
    },
  });
  const renderPrintComponent = () => {
    switch (printType) {
      case "registration":
        return <RegistrationPrint data={data as RegistrationData} />;
      case "prescription":
        return <PrescriptionPrint data={data as PrescriptionData} />;
      case "bill":
        return <BillReceiptPrint data={data as BillData} />;
      default:
        return <div className="text-center py-10">No data available...</div>;
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          console.log("start printing");
          handlePrint();
        }}
        {...buttonProps}
      >
        {children}
      </Button>
      {/* This is the printable component */}
      <div className="hidden print:block">
        <div ref={printComponentRef}>
          <div className="print-container p-8 bg-white text-black font-sans text-sm w-[210mm] min-h-[297mm] mx-auto shadow-lg my-4 print:shadow-none print:my-0 print:mx-0 print:w-full print:min-h-screen">
            <Header />
            <main>{renderPrintComponent()}</main>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}
