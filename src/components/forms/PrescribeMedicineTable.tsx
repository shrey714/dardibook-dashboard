// PrescribeMedicineTable
import { ChangeEvent, useState } from "react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import MedicineSuggetion from "../Prescribe/MedicineSuggetion";

interface Dosage {
  morning: string;
  afternoon: string;
  evening: string;
  night: string;
}

interface Medicine {
  id: number;
  medicineName: string;
  instruction: string;
  dosages: Dosage;
  duration: number;
  durationType: string;
  type: string;
}

interface PrescribeMedicineTableProps {
  rows: Medicine[];
  setRows: (medicines: Medicine[]) => void;
}
const medicineTypes = [
  { label: "Type", value: "", isDefault: true },
  { label: "Tablet", value: "TAB" },
  { label: "Capsule", value: "CAP" },
  { label: "Syrup", value: "SYRUP" },
  { label: "Drop", value: "DROP" },
  { label: "Cream", value: "CREAM" },
  { label: "Lotion", value: "LOTION" },
  { label: "Serum", value: "SERUM" },
  { label: "Soap", value: "SOAP" },
  { label: "Spray", value: "SPRAY" },
  { label: "Gel", value: "GEL" },
  { label: "Ointment", value: "OINTMENT" },
  { label: "Inhaler", value: "INHALER" },
  { label: "Injection", value: "INJECTION" },
  { label: "Powder", value: "POWDER" },
  { label: "Patch", value: "PATCH" },
  { label: "Suppository", value: "SUPPOSITORY" },
];
const durationTypes = [
  { label: "day", value: "day", isDefault: true },
  { label: "month", value: "month" },
  { label: "year", value: "year" },
];
const PrescribeMedicineTable: React.FC<PrescribeMedicineTableProps> = ({
  rows,
  setRows,
}) => {
  const [rowIdCounter, setRowIdCounter] = useState(2);

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
    setRowIdCounter(rowIdCounter + 1);
    setRows([...rows, newRow]);
  };

  const handleInputChange = (
    rowId: number,
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    // console.log("root===", name, value);
    setRows(
      rows.map((row) => (row.id === rowId ? { ...row, [name]: value } : row))
    );
  };
  const deleteRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const statusLabels: Array<keyof Dosage> = [
    "morning",
    "afternoon",
    "evening",
    "night",
  ];

  const handleDosageChange = (
    rowId: number,
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
    row: Medicine,
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

  return (
    <div className="container mx-auto pt-4 px-1 text-center">
      <table className="table w-full">
        <thead>
          <tr className="border-gray-300">
            <th>Medicine Name</th>
            <th>Instruction</th>
            <th>Dosages</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, index) => (
            <tr key={row.id} className={"border-0"}>
              <td className="align-top p-1 relative">
                {/* implement search functionality here */}
                <MedicineSuggetion
                  medicine={row.medicineName}
                  rowId={row.id}
                  handleInputChange={handleInputChange}
                />
              </td>
              <td className="align-top p-1">
                <input
                  type="text"
                  name="instruction"
                  autoComplete="new-off"
                  value={row.instruction}
                  onChange={(event) => handleInputChange(row.id, event)}
                  className="form-input w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </td>
              <td className="align-top p-1">
                <div className="w-full ring-1 rounded-lg ring-gray-300 p-[2px]">
                  <div className="w-full flex flex-row gap-[2px]">
                    <input
                      type="text"
                      value={`${row.dosages.morning}-${row.dosages.afternoon}-${row.dosages.evening}-${row.dosages.night}`}
                      autoComplete="new-off"
                      onChange={(event) => handleDosageChange(row.id, event)}
                      className="form-input border-0 rounded-[6px] tracking-wider font-mono w-[70%] block py-1.5 text-gray-900 placeholder:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 text-sm sm:leading-6"
                    />

                    <select
                      value={row.type}
                      name="type"
                      onChange={(e) => {
                        handleInputChange(row.id, e);
                      }}
                      className="form-select border-0 rounded-[6px] flex flex-1 py-1 text-gray-900 placeholder:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                      {medicineTypes.map((type, index) => (
                        <option
                          key={index}
                          value={type.value}
                          selected={type.isDefault || false}
                        >
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex w-full px-2 py-1 border-0">
                    {statusLabels.map((label, key) => (
                      <div key={key} className="flex items-center me-4">
                        <input
                          id={`checkbox-${label}-${row.id}`}
                          type="checkbox"
                          checked={row.dosages[label] ? true : false}
                          onChange={(e) => {
                            handleDosageChangeFromCheckBox(e, row, label);
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`checkbox-${label}-${row.id}`}
                          className="ms-2 text-sm font-medium text-gray-800"
                        >
                          {label.charAt(0)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </td>
              <td className="align-top p-1 flex flex-row items-center gap-2">
                <div className="w-full flex flex-row gap-[2px]">
                  <input
                    type="number"
                    name="duration"
                    autoComplete="new-off"
                    value={row.duration}
                    onChange={(event) => handleInputChange(row.id, event)}
                    className="form-input flex flex-1 w-20 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <select
                    value={row.durationType}
                    name="durationType"
                    onChange={(e) => {
                      handleInputChange(row.id, e);
                    }}
                    className="form-select flex flex-1 border-0 rounded-[6px]  py-1 text-gray-900 placeholder:text-gray-400 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    {durationTypes.map((type, index) => (
                      <option
                        key={index}
                        value={type.value}
                        selected={type.isDefault || false}
                      >
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  disabled={rows.length > 1 ? false : true}
                  onClick={() => deleteRow(row.id)}
                  className="btn btn-xs btn-error btn-circle"
                >
                  <XMarkIcon className="size-4 text-white" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={addRow}
        className="btn mt-2 animate-none btn-neutral btn-sm btn-wide"
      >
        <PlusIcon className="size-4 text-white" />
      </button>
    </div>
  );
};

export default PrescribeMedicineTable;
