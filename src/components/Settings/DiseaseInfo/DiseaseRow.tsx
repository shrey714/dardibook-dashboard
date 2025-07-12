import React from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/Settings/DiseaseInfo/MedicineMultipleSelector";
import { Checkbox } from "@/components/ui/checkbox";

interface DisplayDiseaseProps {
  disease: {
    diseaseDetail: string;
    medicines: string[];
    diseaseId: string;
  };
  index: number;
  setDiseaseEditModel: React.Dispatch<React.SetStateAction<boolean>>;
  setEditForDiseaseId: React.Dispatch<React.SetStateAction<string>>;
  isSelected: boolean;
  onSelectionChange: (selected: boolean) => void;
}

const DiseaseRow: React.FC<DisplayDiseaseProps> = ({
  index,
  disease,
  setDiseaseEditModel,
  setEditForDiseaseId,
  isSelected,
  onSelectionChange,
}) => {
  return (
    <div
      className={`grid grid-cols-12 gap-1 w-full p-2 sm:p-4 ${
        index !== 0 ? "border-t" : "border-0"
      }`}
    >
      <div className="col-span-1 flex justify-start items-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelectionChange}
          aria-label={`Select ${disease.diseaseDetail}`}
        />
      </div>

      <div className="col-span-3 h-auto flex flex-col justify-start items-start">
        <p className="text-sm font-normal">{disease.diseaseDetail}</p>
        <p className="text-sm text-muted-foreground">{disease.diseaseId}</p>
      </div>

      <MultipleSelector
        commandProps={{
          className:
            "col-span-7 w-full rounded-md bg-background text-sm font-normal h-min border-none",
        }}
        value={disease?.medicines?.map((disease) => ({
          label: disease,
          value: disease,
        }))}
        placeholder="No Medicines"
        disabled
        hidePlaceholderWhenSelected
        className={`border-none p-2 sm:p-3`}
        badgeClassName="text-sm p-0"
      />

      <div className="col-span-1 flex justify-center items-center">
        <Button
          variant={"outline"}
          className={`h-9 w-9 min-w-0`}
          onClick={() => {
            setEditForDiseaseId(disease.diseaseId);
            setDiseaseEditModel(true);
          }}
        >
          <Pencil height={15} width={15} />
        </Button>
      </div>
    </div>
  );
};

export default DiseaseRow;
