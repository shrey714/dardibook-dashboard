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
import { AdditionalInfo, PrescriptionFormTypes, ReceiptDetails } from "@/types/FormTypes";
import { Input } from "../ui/input";

interface ReceiptFormProps {
  additionalInfo: AdditionalInfo[];
  setAdditionalInfo: React.Dispatch<React.SetStateAction<PrescriptionFormTypes>>;
}

const AdditionalInfoForm: React.FC<ReceiptFormProps> = ({
  additionalInfo,
  setAdditionalInfo,
}) => {
  const handleInputChange = (
    id: string,
    name: "additionalDetailTitle" | "additionalDetailContent",
    value: string
  ) => {
    const updated_receipt_details = additionalInfo.map((item) =>
      item.id === id ? { ...item, [name]: value } : item
    );
    setAdditionalInfo((prevData) => ({
      ...prevData,
      additional_details: updated_receipt_details,
    }));
  };

  const addParticular = () => {
    setAdditionalInfo((prevData) => ({
      ...prevData,
      additional_details: [
        ...prevData.additional_details,
        { id: uniqid("Particular-"), additionalDetailTitle: "", additionalDetailContent: "" },
      ],
    }));
  };

  const removeParticular = (id: string) => {
    const updated_receipt_details = additionalInfo.filter(
      (item) => item.id !== id
    );
    setAdditionalInfo((prevData) => ({
      ...prevData,
      additional_details: updated_receipt_details,
    }));
  };

  return (
    <Card className="col-span-10 2xl:col-span-3 h-min py-0 gap-0">
      <CardHeader className="border-b p-2 md:px-4 md:py-3">
        <CardTitle className="flex items-center text-sm md:text-lg font-medium">
          Additional Details
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <AnimatePresence initial={false}>
          {additionalInfo.map((particular, index: number) => (
            <motion.div
              key={particular.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden" }}
              className="grid grid-cols-7 gap-3"
            >
              <Input
                type="text"
                required
                name={`additionalDetailTitle-${index}`}
                id={`additionalDetailTitle-${index}`}
                autoComplete="off"
                placeholder="Title*"
                wrapClassName={"col-span-3 sm:max-w-md my-1.5"}
                value={particular.additionalDetailTitle}
                onChange={(e) =>
                  handleInputChange(particular.id, "additionalDetailTitle", e.target.value)
                }
              />
              <Input
                type="text"
                name={`additionalDetailContent-${index}`}
                id={`additionalDetailContent-${index}`}
                autoComplete="off"
                placeholder="Value"
                wrapClassName={"col-span-3 sm:max-w-md"}
                className="col-span-3 sm:max-w-md my-1.5"
                value={particular.additionalDetailContent}
                onChange={(e) =>
                  handleInputChange(
                    particular.id,
                    "additionalDetailContent",
                    e.target.value
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

        <div className="w-full grid grid-cols-7 gap-3">
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
    </Card>
  );
};

export default AdditionalInfoForm;
