import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import {
  CalendarMinus,
  CalendarPlus,
  PenBoxIcon,
  User,
} from "lucide-react";
import { ColumnId } from "./KanbanBoard";
import { BedPatientTypes, OrgBed } from "@/types/FormTypes";
import { format } from "date-fns";

export interface Task {
  id: UniqueIdentifier;
  columnId: ColumnId;
  content: string;
}

interface TaskCardProps {
  task: OrgBed;
  isOverlay?: boolean;
  bedPatientData: BedPatientTypes;
  setIsEditModalOpen: any;
  openEditModal: any;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: OrgBed;
  bedPatientData: BedPatientTypes;
  setIsEditModalOpen: any;
  openEditModal: any;
}

export function TaskCard({
  task,
  isOverlay,
  bedPatientData,
  setIsEditModalOpen,
  openEditModal,
}: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.bedBookingId,
    data: {
      type: "Task",
      task,
      bedPatientData,
      setIsEditModalOpen,
      openEditModal,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2",
      },
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`container relative flex flex-row bg-border overflow-hidden rounded-md shadow-md hover:shadow-lg ${variants(
        {
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        }
      )}`}
    >
      <div className="flex relative flex-1 flex-col h-full p-0">
        <div className="flex items-center justify-between pointer-events-auto px-3 pt-1">
          <div className="flex flex-row items-center gap-2">
            <User className="size-5 text-primary shrink-0" />
            <h3 className="font-semibold text-primary leading-none">
              {bedPatientData.name}
            </h3>
          </div>
          <Button
            type="button"
            size={"icon"}
            onClick={(e) => {
              console.log("shrey");
              e.stopPropagation();
              openEditModal(task.bedBookingId, task.bedId);
            }}
            variant={"ghost"}
          >
            <PenBoxIcon />
          </Button>
        </div>
        <div className="text-sm space-y-1 text-muted-foreground px-3">
          <p>
            <span className="font-medium">Age:</span> {bedPatientData.age}
          </p>
          <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <CalendarPlus className="h-3 w-3" />
            <span>
              Admitted: {format(task.admission_at, "do MMM yy, h:mm a")}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
            <CalendarMinus className="h-3 w-3" />
            <span>
              Discharge: {format(task.discharge_at, "do MMM yy, h:mm a")}
            </span>
          </div>
        </div>
        <div
          {...attributes}
          {...listeners}
          className={`h-5 mt-1.5 z-0 ${
            isDragging || isOverlay ? "cursor-grabbing" : "cursor-grab"
          } w-full bg-center overflow-hidden dark:bg-[radial-gradient(#767676_1px,transparent_1px)] bg-[radial-gradient(#000000a1_1px,transparent_1px)] bg-[size:5px_5px] shadow-[inset_0px_21px_5px_-14px_hsl(var(--border))]`}
        ></div>
      </div>
      <div className="bg-yellow-300 w-1 h-full absolute left-0"></div>
      <div className="bg-red-500 w-1 h-full absolute right-0"></div>
    </div>
  );
}
