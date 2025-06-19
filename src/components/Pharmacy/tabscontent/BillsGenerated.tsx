"use client";
import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { endOfDay, format, getTime, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  query,
  collection,
  onSnapshot,
  where,
  and,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

import { SidebarMenuSkeleton } from "@/components/ui/sidebar";
import { PharmacyTypes } from "@/types/FormTypes";

const BillsGenerated = ({
  onViewBill,
}: {
  onViewBill: (bill: PharmacyTypes) => void;
}) => {
  const { isLoaded, orgId } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [billsLoader, setBillsLoader] = useState(true);
  const [bills, setBills] = useState<PharmacyTypes[]>([]);

  useEffect(() => {
    let unsubscribe: () => void;
    const getBillsGenerated = () => {
      if (isLoaded && orgId && date) {
        const billsQuery = query(
          collection(db, "doctor", orgId, "bills"),
          where("generated_at", ">=", getTime(startOfDay(date))),
          where("generated_at", "<=", getTime(endOfDay(date))),
          orderBy("generated_at", "desc")
        );

        setBillsLoader(true);
        unsubscribe = onSnapshot(billsQuery, async (snapshot) => {
          const billsData: PharmacyTypes[] = [];

          snapshot.forEach((doc) => {
            const bill = doc.data() as PharmacyTypes;
            billsData.push(bill);
          });

          setBills(billsData);
          setBillsLoader(false);
        });
      } else {
        setBillsLoader(false);
      }
    };

    getBillsGenerated();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isLoaded, orgId, date]);

  const filteredBills = searchTerm
    ? bills.filter(
        (bill: PharmacyTypes) =>
          bill.bill_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bill.mobile.includes(searchTerm)
      )
    : bills;

  return (
    <Card className="h-full w-full overflow-hidden flex-col">
      <CardHeader className="p-3 space-y-2">
        <CardTitle className="text-lg font-semibold text-muted-foreground flex items-center justify-between">
          <span>Bills Generated On</span>
          <span className="text-sm font-normal text-muted-foreground">
            {bills.length} bills
          </span>
        </CardTitle>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <div className="relative w-full">
          <input
            type="search"
            placeholder="Search by name, mobile or bill"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="h-auto py-1.5">Bill</TableHead>
            <TableHead className="h-auto py-1.5">Name</TableHead>
            <TableHead className="h-auto py-1.5">Amount</TableHead>
            <TableHead className="h-auto py-1.5">Status</TableHead>
            <TableHead className="h-auto py-1.5 text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
      </Table>
      <CardContent className="p-0 flex-col overflow-y-auto h-[var(--content-height)]">
        <Table>
          <TableBody>
            {billsLoader ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={3}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <SidebarMenuSkeleton key={index} />
                  ))}
                </TableCell>
              </TableRow>
            ) : filteredBills.length > 0 ? (
              filteredBills.map((bill) => (
                <TableRow key={bill.bill_id} className="hover:bg-transparent">
                  <TableCell className="font-normal text-xs break-all">
                    {bill.bill_id}
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-normal line-clamp-1">
                      {bill.name}
                    </p>
                    {bill.patient_id && (
                      <p className="text-sm text-muted-foreground gap-x-2 inline-flex items-center line-clamp-1">
                        {bill.patient_id}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>₹{bill.total_amount.toFixed(0)}</TableCell>
                  <TableCell>
                    <span
                      className={`w-min px-2 py-1 text-xs rounded-full truncate ${
                        bill.payment_status === "Paid"
                          ? "bg-green-200 text-green-800"
                          : bill.payment_status === "Unpaid"
                          ? "bg-red-200 text-red-800"
                          : bill.payment_status === "Refunded"
                          ? "bg-yellow-200 text-yellow-800"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {bill.payment_status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewBill(bill)}
                      className="my-1 mr-1 h-7 border-0 sm:h-8 py-1 flex items-center justify-center bg-blue-700 hover:bg-blue-900 text-white hover:text-white rounded-[4px]"
                    >
                      <Eye />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  No bills generated
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BillsGenerated;
