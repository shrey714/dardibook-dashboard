// PrescribeMedicineTable
import { ChangeEvent, useState } from "react";
import MedicineSuggetion from "../Prescribe/MedicineSuggetion";
import uniqid from "uniqid";
import { Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { DosageTypes, MedicinesDetails } from "@/types/FormTypes";
import { Kbd } from "../ui/kbd";
import { useHotkeys } from "react-hotkeys-hook";
import { useOrganization } from "@clerk/nextjs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PrescribeMedicineTableProps {
  rows: MedicinesDetails[];
  setRows: (medicines: MedicinesDetails[]) => void;
}
interface Medicine_Types {
  value: string;
  isDefault: boolean;
}
const durationTypes = [
  { label: "day", value: "day", isDefault: true },
  { label: "month", value: "month" },
  { label: "year", value: "year" },
];
const PrescribeMedicineTable: React.FC<PrescribeMedicineTableProps> = ({
  rows,
  setRows,
}) => {
  const [rowIdCounter, setRowIdCounter] = useState(uniqid());
  const { organization, isLoaded } = useOrganization();

  const addRow = () => {
    const newRow = {
      id: rowIdCounter,
      medicineName: "",
      instruction: "",
      dosages: {
        morning: "",
        afternoon: "",
        evening: "",
        night: "",
      },
      duration: 1,
      durationType: "day",
      type: "",
    };
    setRowIdCounter(uniqid());
    setRows([...rows, newRow]);
  };

  const handleInputChange = (
    rowId: string,
    event: { target: { name: string; value: string } }
  ) => {
    const { name, value } = event.target;
    setRows(
      rows.map((row) => (row.id === rowId ? { ...row, [name]: value } : row))
    );
  };
  const deleteRow = (id: string) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const statusLabels: Array<keyof DosageTypes> = [
    "morning",
    "afternoon",
    "evening",
    "night",
  ];

  const handleDosageChange = (
    rowId: string,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    // Split the input value by commas and trim spaces
    const dosageValues = value.split("-").map((dosage) => dosage.trim());

    // Create a new dosage object based on the input values
    const newDosages = {
      morning: dosageValues[0] || "",
      afternoon: dosageValues[1] || "",
      evening: dosageValues[2] || "",
      night: dosageValues[3] || "",
    };
    setRows(
      rows.map((row) =>
        row.id === rowId ? { ...row, ["dosages"]: newDosages } : row
      )
    );
  };

  const handleDosageChangeFromCheckBox = (
    event: ChangeEvent<HTMLInputElement>,
    row: MedicinesDetails,
    label: string
  ) => {
    const isChecked = event.target.checked;
    const updatedDosages = {
      ...row.dosages,
      [label]: isChecked ? "1" : "",
    };
    setRows(
      rows.map((prevrow) =>
        prevrow.id === row.id
          ? { ...prevrow, ["dosages"]: updatedDosages }
          : prevrow
      )
    );
  };

  const handleComingData = (
    rowId: string,
    selectedOption: {
      value: string;
      type: string;
      instruction: string;
      id: string;
    }
  ) => {
    setRows(
      rows?.map((row) =>
        row.id === rowId
          ? {
              ...row,
              medicineName: selectedOption?.value || "",
              type: selectedOption?.type || "",
              instruction: selectedOption?.instruction || "",
              id: selectedOption?.id || uniqid(),
            }
          : row
      )
    );
  };

  useHotkeys("shift+n", () => addRow());

  const options =
    isLoaded &&
    organization &&
    Array.isArray(organization.publicMetadata.medicine_types)
      ? (organization.publicMetadata.medicine_types as Medicine_Types[])
      : [];
  const defaultType = options.find((t) => t.isDefault)?.value ?? "";

  return (
    <div className="mx-auto px-0 text-center">
      <table className="table w-full">
        <thead className="hidden md:table-header-group">
          <tr className="text-muted-foreground bg-border">
            <th className="font-medium text-sm py-2">Medicine Name*</th>
            <th className="font-medium text-sm py-2">Instruction</th>
            <th className="font-medium text-sm py-2">Dosages</th>
            <th className="font-medium text-sm py-2">Duration</th>
          </tr>
        </thead>
        <tbody className="sm:px-8">
          {rows?.map((row, index) => (
            <tr key={row.id} className={`border-b flex flex-col sm:table-row`}>
              <td className="align-top px-1 sm:pl-3 py-0.5 pt-2 sm:py-3 relative">
                {/* implement search functionality here */}
                <MedicineSuggetion
                  medicine={row.medicineName}
                  rowId={row.id}
                  handleComingData={handleComingData}
                />
              </td>
              <td className="align-top px-1 py-0.5 sm:py-3">
                <Input
                  type="text"
                  name="instruction"
                  placeholder="instruction.."
                  autoComplete="new-off"
                  value={row.instruction}
                  onChange={(event) => handleInputChange(row.id, event)}
                  wrapClassName="w-full"
                />
              </td>
              <td className="align-top px-1 py-0.5 sm:py-3">
                <div className="w-full ring-1 rounded-lg ring-border p-[2px]">
                  <div className="w-full flex flex-row gap-[2px]">
                    <Input
                      type="text"
                      value={`${row.dosages.morning}-${row.dosages.afternoon}-${row.dosages.evening}-${row.dosages.night}`}
                      autoComplete="new-off"
                      onChange={(event) => handleDosageChange(row.id, event)}
                      className="tracking-wider font-mono"
                      wrapClassName="w-[70%]"
                    />
                    <Select
                      name="type"
                      value={row.type || defaultType}
                      onValueChange={(val) => {
                        handleInputChange(row.id, {
                          target: {
                            name: "type",
                            value: val,
                          },
                        });
                      }}
                    >
                      <SelectTrigger id="type" className="flex flex-1">
                        <SelectValue placeholder="Doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {options.map((type, index) => (
                          <SelectItem value={type.value} key={index}>
                            {type.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex w-full px-2 py-1 border-0">
                    {statusLabels.map((label, key) => (
                      <div key={key} className="flex items-center me-4">
                        <Input
                          id={`checkbox-${label}-${row.id}`}
                          type="checkbox"
                          checked={row.dosages[label] ? true : false}
                          onChange={(e) => {
                            handleDosageChangeFromCheckBox(e, row, label);
                          }}
                          className="w-4 h-4"
                        />
                        <Label
                          htmlFor={`checkbox-${label}-${row.id}`}
                          className="ms-2 text-sm font-medium text-muted-foreground"
                        >
                          {label.charAt(0)}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </td>
              <td className="align-top px-1 sm:pr-3 py-0.5 pb-2 sm:py-3 flex flex-row items-start gap-2">
                <div className="w-full flex flex-row gap-[2px]">
                  <Input
                    type="number"
                    name="duration"
                    autoComplete="new-off"
                    value={row.duration}
                    onChange={(event) => handleInputChange(row.id, event)}
                    wrapClassName="flex flex-1 w-20"
                  />

                  <Select
                    value={row.durationType || "day"}
                    name="durationType"
                    onValueChange={(val) => {
                      handleInputChange(row.id, {
                        target: {
                          name: "durationType",
                          value: val,
                        },
                      });
                    }}
                  >
                    <SelectTrigger id="durationType" className="flex flex-1">
                      <SelectValue placeholder="Doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {durationTypes.map((type, index) => (
                        <SelectItem value={type.value} key={index}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant={"destructive"}
                    className="rounded-full size-9 aspect-square flex items-center justify-center"
                    disabled={rows.length > 1 ? false : true}
                    onClick={() => deleteRow(row.id)}
                  >
                    <X className="size-4" />
                  </Button>
                  <Button
                    variant={"outline"}
                    type="button"
                    onClick={addRow}
                    className={`rounded-full relative size-9 aspect-square flex items-center justify-center ${
                      rows.length !== index + 1 ? "hidden" : ""
                    }`}
                  >
                    <Plus className="size-4" />
                    <Kbd
                      variant="outline"
                      className="hidden md:flex self-start absolute right-[calc(100%+8px)] border-0 rounded-full bg-border"
                    >
                      <span className="text-xs">⇧</span>n
                    </Kbd>
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="w-full bg-border text-muted-foreground font-medium text-xs text-start pl-4 py-1">
        Total {rows.length} medicine(s)
      </div>
    </div>
  );
};

export default PrescribeMedicineTable;
