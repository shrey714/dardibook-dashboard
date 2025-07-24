import { PrescriptionFormTypes } from "@/types/FormTypes";
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BedSingleIcon,
  CalendarClockIcon,
  ClipboardPlusIcon,
  PencilLineIcon,
  TriangleAlertIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from "date-fns";

interface PatientHistoryDataTypes {
  history: PrescriptionFormTypes;
}

const PatientHistoryData: React.FC<PatientHistoryDataTypes> = ({ history }) => {
  return (
    <div className="mx-auto max-w-7xl flex flex-1 flex-col gap-y-3 sm:gap-y-6">
      {/* prescription and receipt details */}
      <div className="w-full flex flex-col-reverse md:flex-row gap-3 sm:gap-6">
        <div className="flex flex-col flex-1">
          <CommonHeader label={"Prescription Details"} />
          <div className="space-y-3 mt-3 px-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">Prescription Id</p>
              <div className="flex items-center min-h-9 text-muted-foreground w-full rounded-md border px-3 text-sm shadow-sm">
                {history.prescription_id}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Next Visit</p>
              <div className="flex items-center min-h-9 text-muted-foreground w-full rounded-md border px-3 text-sm shadow-sm">
                {history.nextVisit}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col overflow-hidden gap-y-2 md:pr-8">
          {history.prescription_for_bed && (
            <div
              className={`flex w-fit flex-row text-sm text-muted-foreground gap-x-2 border py-1 px-5 rounded-full text-center items-center justify-center border-muted-foreground`}
            >
              <BedSingleIcon className="size-4 sm:size-5" /> In Bed
            </div>
          )}

          <div className="flex items-center">
            <CalendarClockIcon
              size={36}
              className="mr-3 border border-foreground rounded-full p-2"
            />
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground">Created at</span>
              <span className="text-base font-medium">
                {format(new Date(history.created_at), "do MMM yyyy")}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <PencilLineIcon
              size={36}
              className="mr-3 bg-blue-600/10 text-blue-600 border border-blue-600 rounded-full p-2"
            />
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground">
                Registerd by
              </span>
              <span className="text-base font-medium">
                {history.registerd_by.name}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <ClipboardPlusIcon
              size={36}
              className="mr-3 bg-green-500/10 text-green-600 border border-green-600 rounded-full p-2"
            />
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground">
                Prescribed by
              </span>
              <span className="text-base font-medium">
                {history.prescribed_by.name}
              </span>
            </div>

            {history.prescriber_assigned.id !== history.prescribed_by.id && (
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <TriangleAlertIcon
                      size={30}
                      className="ml-3 bg-red-500/10 text-red-600 border border-red-600 rounded-full p-2"
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    className="bg-red-900 text-white font-medium text-sm max-w-xs"
                    side="bottom"
                    sideOffset={10}
                  >
                    <p>
                      The assigned doctor was {history.prescriber_assigned.name}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>

      {/* Disease/Advice text area */}
      <div className="w-full flex flex-col">
        <CommonHeader label={"Disease and Diagnosis"} />
        <div className="space-y-1 mt-3 px-3">
          <p className="text-sm font-medium">Bill Id</p>
          <div className="flex items-center min-h-9 text-muted-foreground w-full lg:w-3/5 rounded-md border mt-3 px-3 text-sm shadow-sm">
            {history.diseaseDetail}
          </div>
        </div>
        <div className="space-y-1 mt-3 px-3">
          <p className="text-sm font-medium">Advice or special instructions</p>
          <div className="flex items-center min-h-9 text-muted-foreground w-full lg:w-3/5 rounded-md border mt-3 px-3 py-1 text-sm shadow-sm">
            {history.advice}
          </div>
        </div>
      </div>

      {/* Medicine list */}
      <div className="w-full flex flex-col">
        <CommonHeader label={"Medicines"} />
        <div className="border rounded-md overflow-hidden mt-3">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Medicine</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.medicines.length > 0 ? (
                history.medicines.map((med, index) => (
                  <TableRow key={index} className="hover:bg-transparent">
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

      {/* Higher hospital and receipt details */}
        <div className="w-full">
          <CommonHeader label={"Refer Details"} />
          <div className="space-y-3 mt-3 px-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">Hospital Name</p>
              <div className="flex items-center min-h-9 text-muted-foreground w-full lg:w-3/5 rounded-md border px-3 py-1 text-sm shadow-sm">
                {history.refer.hospitalName}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Appointed Doctor Name</p>
              <div className="flex items-center min-h-9 text-muted-foreground w-full lg:w-3/5 rounded-md border px-3 py-1 text-sm shadow-sm">
                {history.refer.doctorName}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Refer message</p>
              <div className="flex items-center min-h-9 text-muted-foreground w-full lg:w-3/5 rounded-md border px-3 py-1 text-sm shadow-sm">
                {history.refer.referMessage}
              </div>
            </div>
          </div>
        </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
        <Card className="flex flex-col overflow-hidden p-0 gap-0">
          <CardHeader className="py-3 bg-muted/50 border-b gap-0">
            <CardTitle className="text-lg font-medium">
              Additional Details
            </CardTitle>
            <CardDescription hidden></CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-2 p-2 sm:p-6">
            {history.prescription_additional_details.map((info) => (
              <div key={info.id} className="flex justify-between">
                <span>{info.label}:</span>
                <span className="self-end">{info.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="flex flex-col overflow-hidden p-0 gap-0">
          <CardHeader className="py-3 bg-muted/50 border-b gap-0">
            <CardTitle className="text-lg font-medium">
              Receipt Summary
            </CardTitle>
            <CardDescription hidden></CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-2 p-2 sm:p-6">
            {history.receipt_details.map((receipt) => (
              <div key={receipt.id} className="flex justify-between">
                <span>{receipt.title}:</span>
                <span className="self-end">₹{receipt.amount.toFixed(2)}</span>
              </div>
            ))}
          </CardContent>
          <CardFooter className="border-t py-3 flex justify-between font-bold text-lg">
            <span>Total Amount:</span>
            <span>
              ₹
              {history.receipt_details
                .reduce((sum, item) => sum + item.amount, 0)
                .toFixed(2)}
            </span>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PatientHistoryData;

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
