// PrescribeMedicineTable
import {
  ChangeEvent,
  useState,
  FocusEvent,
  MouseEvent,
  KeyboardEvent,
} from "react";
import {
  XMarkIcon,
  PlusIcon,
  XCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";
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
  duration: string;
}

interface PrescribeMedicineTableProps {
  rows: Medicine[];
  setRows: (medicines: Medicine[]) => void;
}

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
      duration: "",
    };
    setRowIdCounter(rowIdCounter + 1);
    setRows([...rows, newRow]);
  };

  const handleInputChange = (
    rowId: number,
    event: ChangeEvent<HTMLInputElement>
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

  const [currentDodageStatus, setcurrentDodageStatus] = useState<number | null>(
    null
  );
  const statusLabels = ["morning", "afternoon", "evening", "night"];

  const handleDosageChange = (
    rowId: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value, selectionStart } = event.target;
    // Split the input value by commas and trim spaces
    const dosageValues = value.split("-").map((dosage) => dosage.trim());

    // Determine which dosage is currently being edited based on caret position
    const commaPositions = [
      0,
      ...value.split("").reduce<number[]>((acc, char, index) => {
        if (char === "-") acc.push(index + 1);
        return acc;
      }, []),
      value.length + 1,
    ];

    const activeIndex = commaPositions.findIndex(
      (pos, i) =>
        selectionStart !== null &&
        selectionStart >= pos &&
        selectionStart < commaPositions[i + 1]
    );
    setcurrentDodageStatus(activeIndex === -1 ? null : activeIndex);

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

  const handleCursorMovement = (
    rowId: number,
    event:
      | MouseEvent<HTMLInputElement>
      | FocusEvent<HTMLInputElement>
      | KeyboardEvent<HTMLInputElement>
  ) => {
    const { value, selectionStart } = event.currentTarget;
    // Split the input value by commas and trim spaces
    const dosageValues = value.split("-").map((dosage) => dosage.trim());

    // Determine which dosage is currently being edited based on caret position
    const commaPositions = [
      0,
      ...value.split("").reduce<number[]>((acc, char, index) => {
        if (char === "-") acc.push(index + 1);
        return acc;
      }, []),
      value.length + 1,
    ];

    const activeIndex = commaPositions.findIndex(
      (pos, i) =>
        selectionStart !== null &&
        selectionStart >= pos &&
        selectionStart < commaPositions[i + 1]
    );
    setcurrentDodageStatus(activeIndex === -1 ? null : activeIndex);

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
  const handleBlur = () => {
    setcurrentDodageStatus(null);
  };
  return (
    <div className="container mx-auto pt-4 px-1 text-center">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Instruction</th>
            <th className="pb-0">
              Dosages <br />
              {statusLabels.map((label, index) => (
                <span
                  key={label}
                  className={`inline-block cursor-pointer transition-all duration-300 ${
                    currentDodageStatus === index
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {currentDodageStatus === index ? label : label.charAt(0)}
                  {index < statusLabels.length - 1 ? "-" : ""}
                </span>
              ))}
            </th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, index) => (
            <tr key={row.id} className={`${row.id}`}>
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
                {/* w-1/3 for bigger space */}
                <input
                  type="text"
                  // value={`${row.dosages.morning}, ${row.dosages.afternoon}, ${row.dosages.evening}, ${row.dosages.night}`}
                  autoComplete="new-off"
                  onChange={(event) => handleDosageChange(row.id, event)}
                  onFocus={(event) => handleCursorMovement(row.id, event)}
                  onClick={(event) => handleCursorMovement(row.id, event)}
                  onKeyUp={(event) => handleCursorMovement(row.id, event)}
                  onBlur={handleBlur}
                  className="form-input w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </td>
              <td className="align-top p-1 flex flex-row items-center gap-2">
                <input
                  type="text"
                  name="duration"
                  autoComplete="new-off"
                  value={row.duration}
                  onChange={(event) => handleInputChange(row.id, event)}
                  className="form-input w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
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
