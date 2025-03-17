import React from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
interface DisplayMedicineProps {
  medicine: {
    medicineName: string;
    type: string;
    id: string;
    instruction: string;
    searchableString: string;
    active: boolean;
  };
  index: number;
  setMedicineEditModel: React.Dispatch<React.SetStateAction<boolean>>;
  setEditForMedicineId: React.Dispatch<React.SetStateAction<string>>;
}

const MedicineRow: React.FC<DisplayMedicineProps> = ({
  medicine,
  index,
  setMedicineEditModel,
  setEditForMedicineId,
}) => {
  return (
    <div
      className={`grid grid-cols-12 gap-1 w-full p-4 ${
        index !== 0 ? "border-t" : "border-0"
      }`}
    >
      <div className="col-span-3 h-auto flex flex-col justify-start items-start">
        <p className="text-sm font-normal">
          {medicine.medicineName}
        </p>
        <p className="text-sm text-muted-foreground gap-x-2 inline-flex items-center">
          {medicine.id}{" "}
          <span
            className={`w-2 h-2 aspect-square rounded-full ${
              medicine.active ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
        </p>
      </div>

      <div className="col-span-3 [&:empty]:invisible border rounded-md flex items-center h-min py-[0px] sm:py-[5.5px] px-2 text-muted-foreground shadow-sm bg-background border-border text-sm leading-6 w-full">
        {medicine.type}
      </div>
      <div className="col-span-5 [&:empty]:invisible border rounded-md flex items-center h-min py-[0px] sm:py-[5.5px] px-2 text-muted-foreground shadow-sm bg-background border-border text-sm leading-6 w-full">
        {medicine.instruction}
      </div>

      <div className="col-span-1 flex justify-center items-center">
        <Button
          variant={"outline"}
          className={`h-9 w-9 min-w-0`}
          onClick={() => {
            setEditForMedicineId(medicine.id);
            setMedicineEditModel(true);
          }}
        >
          <Pencil height={15} width={15} />
        </Button>
      </div>
    </div>
  );
};

export default MedicineRow;
