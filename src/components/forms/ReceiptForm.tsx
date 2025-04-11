import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import uniqid from "uniqid";
import { PrescriptionFormTypes, ReceiptDetails } from "@/types/FormTypes";

interface ReceiptFormProps {
  receiptInfo: ReceiptDetails[];
  setReceiptInfo: React.Dispatch<React.SetStateAction<PrescriptionFormTypes>>;
}

const ReceiptForm: React.FC<ReceiptFormProps> = ({
  receiptInfo,
  setReceiptInfo,
}) => {
  const handleInputChange = (
    id: string,
    name: "title" | "amount",
    value: string | number
  ) => {
    const updated_receipt_details = receiptInfo.map((item) =>
      item.id === id ? { ...item, [name]: value } : item
    );
    setReceiptInfo((prevData) => ({
      ...prevData,
      receipt_details: updated_receipt_details,
    }));
  };

  const addParticular = () => {
    setReceiptInfo((prevData) => ({
      ...prevData,
      receipt_details: [
        ...prevData.receipt_details,
        { id: uniqid("Particular-"), title: "", amount: 0 },
      ],
    }));
  };

  const removeParticular = (id: string) => {
    const updated_receipt_details = receiptInfo.filter(
      (item) => item.id !== id
    );
    setReceiptInfo((prevData) => ({
      ...prevData,
      receipt_details: updated_receipt_details,
    }));
  };

  const calculateTotalAmount = (particulars: ReceiptDetails[]) => {
    const total = particulars.reduce((sum, { amount }) => {
      return sum + (Number.isFinite(amount) ? amount : 0);
    }, 0);

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(total);
  };

  return (
    <Card className="bg-muted/50 border rounded-lg col-span-10 2xl:col-span-3 h-min">
      <CardHeader className="border-b p-2 md:px-4 md:py-3">
        <CardTitle className="flex items-center text-sm md:text-lg font-medium">
          Receipt Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <AnimatePresence initial={false}>
          {receiptInfo.map((particular, index: number) => (
            <motion.div
              key={particular.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden" }}
              className="grid grid-cols-7 gap-4"
            >
              <input
                type="text"
                required
                name={`title-${index}`}
                id={`title-${index}`}
                autoComplete="off"
                placeholder="Title*"
                className="col-span-3 sm:max-w-md my-1.5 disabled:text-primary shadow-sm rounded-none border-border border-0 border-b-2 ring-0 outline-none focus:ring-0 bg-transparent form-input block py-1 pl-2 sm:text-sm sm:leading-6"
                value={particular.title}
                onChange={(e) =>
                  handleInputChange(particular.id, "title", e.target.value)
                }
              />
              <input
                type="number"
                name={`amount-${index}`}
                id={`amount-${index}`}
                autoComplete="off"
                placeholder="Amount"
                className="col-span-3 sm:max-w-md my-1.5 disabled:text-primary shadow-sm rounded-md border-border bg-transparent form-input block py-1 pl-2 sm:text-sm sm:leading-6"
                value={particular.amount}
                onChange={(e) =>
                  handleInputChange(
                    particular.id,
                    "amount",
                    parseFloat(e.target.value)
                  )
                }
              />
              <Button
                type="button"
                variant={"destructive"}
                className="rounded-full self-center col-span-1 size-9 aspect-square flex items-center justify-center"
                onClick={() => removeParticular(particular.id)}
              >
                <X className="size-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="w-full grid grid-cols-7 gap-4">
          <Button
            variant={"outline"}
            type="button"
            onClick={addParticular}
            className={`rounded-full size-9 aspect-square flex items-center justify-center col-start-7`}
          >
            <Plus className="size-4" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-end p-2 md:px-4 md:py-3 border-t text-muted-foreground">
        <strong>Total Fees : </strong>
        <p className="px-2 font-medium">{calculateTotalAmount(receiptInfo)}</p>
      </CardFooter>
    </Card>
  );
};

export default ReceiptForm;
