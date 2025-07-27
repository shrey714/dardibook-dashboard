import React from "react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import uniqid from "uniqid";
import {
  PrescriptionAdditionalinfo,
  PrescriptionFormTypes,
} from "@/types/FormTypes";
import { Input } from "../ui/input";
import { useOrganization } from "@clerk/nextjs";

interface PrescriptionAdditionalInfoFormProps {
  additionalInfo: PrescriptionAdditionalinfo[];
  setAdditionalInfo: React.Dispatch<
    React.SetStateAction<PrescriptionFormTypes>
  >;
}

const PrescriptionAdditionalInfoForm: React.FC<PrescriptionAdditionalInfoFormProps> = ({
  additionalInfo,
  setAdditionalInfo,
}) => {
  const { organization, isLoaded } = useOrganization();

  const handleInputChange = (
    id: string,
    name: "label" | "value",
    value: string
  ) => {
    const updated_receipt_details = additionalInfo.map((item) =>
      item.id === id ? { ...item, [name]: value } : item
    );
    setAdditionalInfo((prevData) => ({
      ...prevData,
      prescription_additional_details: updated_receipt_details,
    }));
  };

  const addParticular = () => {
    setAdditionalInfo((prevData) => ({
      ...prevData,
      prescription_additional_details: [
        ...prevData.prescription_additional_details,
        { id: uniqid("Particular-"), label: "", value: "" },
      ],
    }));
  };

  const removeParticular = (id: string) => {
    const updated_receipt_details = additionalInfo.filter(
      (item) => item.id !== id
    );
    setAdditionalInfo((prevData) => ({
      ...prevData,
      prescription_additional_details: updated_receipt_details,
    }));
  };

  const getUnit = (id: string) => {
    const unit =
      isLoaded &&
      organization &&
      organization.publicMetadata.prescription_additional_details
        ? (
            organization.publicMetadata
              .prescription_additional_details as PrescriptionAdditionalinfo[]
          ).find((info) => info.id == id)?.value
        : undefined;
    return unit && unit.trim() !== "" ? unit : undefined;
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
                name={`label-${index}`}
                id={`label-${index}`}
                autoComplete="off"
                placeholder="Title*"
                wrapClassName={"col-span-3 sm:max-w-md my-1.5"}
                value={particular.label}
                onChange={(e) =>
                  handleInputChange(particular.id, "label", e.target.value)
                }
              />
              <Input
                type="text"
                name={`value-${index}`}
                id={`value-${index}`}
                autoComplete="off"
                placeholder={getUnit(particular.id) ?? "Value"}
                wrapClassName={"col-span-3 sm:max-w-md"}
                className="col-span-3 sm:max-w-md my-1.5"
                value={particular.value}
                onChange={(e) =>
                  handleInputChange(particular.id, "value", e.target.value)
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

export default PrescriptionAdditionalInfoForm;
