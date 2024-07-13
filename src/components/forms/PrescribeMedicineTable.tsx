// PrescribeMedicineTable
import { ChangeEvent, useState } from "react";
import {
  ChevronRightIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
  XCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

interface Dosage {
  id: number;
  value: string;
}

interface Medicine {
  id: number;
  medicineName: string;
  instruction: string;
  dosages: Dosage[];
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
  const [dosageIdCounter, setDosageIdCounter] = useState(2);

  const addRow = () => {
    const newRow = {
      id: rowIdCounter,
      medicineName: "",
      instruction: "",
      dosages: [{ id: dosageIdCounter, value: "" }],
      duration: "",
    };
    setRowIdCounter(rowIdCounter + 1);
    setDosageIdCounter(dosageIdCounter + 1);
    setRows([...rows, newRow]);
  };

  const handleInputChange = (
    rowId: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setRows(
      rows.map((row) => (row.id === rowId ? { ...row, [name]: value } : row))
    );
  };

  const handleDosageChange = (
    rowId: number,
    dosageId: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setRows(
      rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              dosages: row.dosages.map((dosage) =>
                dosage.id === dosageId ? { ...dosage, value } : dosage
              ),
            }
          : row
      )
    );
  };

  const addDosage = (rowId: number) => {
    setRows(
      rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              dosages: [...row.dosages, { id: dosageIdCounter, value: "" }],
            }
          : row
      )
    );
    setDosageIdCounter(dosageIdCounter + 1);
  };

  const deleteDosage = (rowId: number, dosageId: number) => {
    setRows(
      rows.map((row) =>
        row.id === rowId
          ? {
              ...row,
              dosages: row.dosages.filter((dosage) => dosage.id !== dosageId),
            }
          : row
      )
    );
  };

  const deleteRow = (id: number) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  return (
    <div className="container mx-auto pt-4 px-1 text-center">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Instruction</th>
            <th>Dosages</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, index) => (
            <tr key={row.id} className={`${row.id}`}>
              <td className="align-top p-1">
                <input
                  type="text"
                  name="medicineName"
                  value={row.medicineName}
                  onChange={(event) => handleInputChange(row.id, event)}
                  className="form-input w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </td>
              <td className="align-top p-1">
                <input
                  type="text"
                  name="instruction"
                  value={row.instruction}
                  onChange={(event) => handleInputChange(row.id, event)}
                  className="form-input w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </td>
              <td className="align-top p-1 w-1/3">
                {row.dosages.map((dosage, dosageIndex) => (
                  <div
                    key={dosage.id}
                    className={`flex items-center mb-1 ${dosage.id}`}
                  >
                    <input
                      type="text"
                      value={dosage.value}
                      onChange={(event) =>
                        handleDosageChange(row.id, dosage.id, event)
                      }
                      className="form-input w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <button
                      type="button"
                      disabled={row.dosages.length > 1 ? false : true}
                      onClick={() => deleteDosage(row.id, dosage.id)}
                      className="h-full animate-none"
                    >
                      <XCircleIcon
                        className={`size-5 ${
                          row.dosages.length > 1
                            ? "text-red-600"
                            : "text-gray-500"
                        } ml-1`}
                      />
                    </button>
                  </div>
                ))}
                <div className="w-full flex justify-end">
                  <button type="button" onClick={() => addDosage(row.id)}>
                    <PlusCircleIcon className="size-5 text-primary" />
                  </button>
                </div>
              </td>
              <td className="align-top p-1 flex flex-row items-center gap-2">
                <input
                  type="text"
                  name="duration"
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
