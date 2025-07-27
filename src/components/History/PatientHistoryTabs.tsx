import React from "react";
import PatientHistoryData from "./PatientHistoryData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PharmacyTypes,
  PrescriptionFormTypes,
  RegisterPatientFormTypes,
} from "@/types/FormTypes";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { PrinterIcon, ReceiptTextIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PrintButton from "../PrintHandeler/PrintButton";

interface PatientHistoryTabsTypes {
  patientData?: RegisterPatientFormTypes;
  prescriptionsData: PrescriptionFormTypes[];
  handleBillIdSelection: (id: string) => void;
  billsData: PharmacyTypes[];
}

const PatientHistoryTabs: React.FC<PatientHistoryTabsTypes> = ({
  patientData,
  prescriptionsData,
  handleBillIdSelection,
  billsData,
}) => {
  return (
    <>
      {prescriptionsData?.length === 0 ? (
        <div className="w-full h-full flex items-center flex-col gap-8 justify-center py-8">
          <img className="w-full max-w-[16rem]" src="/empty.svg" alt="" />
          <p className="text-muted-foreground text-base">
            No prescriptions available
          </p>
        </div>
      ) : (
        <Tabs defaultValue="0" className="w-full max-h-full">
          <TabsList className="w-full rounded-none sticky top-0 h-auto flex-wrap justify-start z-[1]">
            {prescriptionsData
              .sort((a, b) => b.created_at - a.created_at)
              .map((history, key: number) => (
                <TabsTrigger key={key} value={key.toString()}>
                  {format(history.created_at, "dd-MM-yyyy")}
                </TabsTrigger>
              ))}
          </TabsList>
          {prescriptionsData.map((history, key: number) => {
            const billId = billsData.find(
              (bill) => bill.prescription_id === history.prescription_id
            )?.bill_id;
            return (
              <TabsContent
                key={key}
                value={key.toString()}
                className="p-1 sm:p-2 md:p-6 pb-14 sm:pb-16 md:pb-20 m-1 sm:m-2 rounded-md"
              >
                <PatientHistoryData history={history} />

                {/* Print-Bill buttons */}
                <div
                  className="flex items-center justify-center gap-x-2 sm:gap-x-3 fixed 
      bg-clip-padding backdrop-filter backdrop-blur-sm
      bottom-0 p-2 border-t border-x sm:p-3 rounded-t-lg left-0 right-0 w-fit mx-auto shadow-lg"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PrintButton
                          printType="prescription"
                          data={{
                            patient_id: patientData?.patient_id || "",
                            name: patientData?.name || "",
                            advice: history.advice,
                            created_at: history.created_at,
                            diseaseDetail: history.diseaseDetail,
                            medicines: history.medicines.map((medicine) => ({
                              dosages: medicine.dosages,
                              duration: medicine.duration,
                              durationType: medicine.durationType,
                              instruction: medicine.instruction,
                              medicineName: medicine.medicineName,
                              type: medicine.type,
                            })),
                            nextVisit: history.nextVisit,
                            prescribed_by: history.prescribed_by.name,
                            prescriber_assigned:
                              history.prescriber_assigned.name,
                            prescription_for_bed: history.prescription_for_bed,
                            prescription_id: history.prescription_id,
                            receipt_details: history.receipt_details.map(
                              (receipt) => ({
                                amount: receipt.amount,
                                title: receipt.title,
                              })
                            ),
                            refer: {
                              doctorName: history.refer.doctorName,
                              hospitalName: history.refer.hospitalName,
                              referMessage: history.refer.referMessage,
                            },
                            registerd_by: history.registerd_by.name,
                          }}
                          buttonProps={{
                            size: "icon",
                            className:
                              "w-auto px-6 bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors",
                          }}
                        >
                          <PrinterIcon />
                        </PrintButton>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Print</p>
                      </TooltipContent>
                    </Tooltip>

                    {billId && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            className="w-auto px-6 bg-green-500 hover:bg-green-600 text-white transition-colors"
                            onClick={() => {
                              handleBillIdSelection(billId);
                            }}
                          >
                            <ReceiptTextIcon />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Open Bill</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </TooltipProvider>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      )}
    </>
  );
};

export default PatientHistoryTabs;
