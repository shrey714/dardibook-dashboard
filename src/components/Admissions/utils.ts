import { Active, DataRef, Over } from "@dnd-kit/core";
import { ColumnDragData } from "./BoardColumn";
import { TaskDragData } from "./TaskCard";
import { OrgBed } from "@/types/FormTypes";

type DraggableData = ColumnDragData | TaskDragData;

export function hasDraggableData<T extends Active | Over>(
  entry: T | null | undefined
): entry is T & {
  data: DataRef<DraggableData>;
} {
  if (!entry) {
    return false;
  }

  const data = entry.data.current;

  if (data?.type === "Column" || data?.type === "Task") {
    return true;
  }

  return false;
}

export function getOverdueClashes(patients: OrgBed[]) {
  const now = Date.now();
  const clashes: Record<string, string[]> = {};

  for (let i = 0; i < patients.length; i++) {
    const current = patients[i];

    // Only check if the current booking is overdue (still not discharged AND discharge_at in past)
    if (!current.discharge_at || current.discharge_at >= now) continue;

    const currentTo = now; // Treat current overdue booking as ending now

    for (let j = 0; j < patients.length; j++) {
      if (i === j) continue;
      const compare = patients[j];

      // Only check clash in same bed
      if (compare.bedId !== current.bedId) continue;

      const compareFrom = compare.admission_at;
      const compareTo = compare.discharge_at;

      // Check if future booking overlaps with overdue one
      const overlaps =
        compareFrom < currentTo && compareTo > current.admission_at;

      if (overlaps) {
        if (!clashes[current.patient_id]) {
          clashes[current.patient_id] = [];
        }
        if (!clashes[current.patient_id].includes(compare.patient_id)) {
          clashes[current.patient_id].push(compare.patient_id);
        }
      }
    }
  }

  return clashes;
}