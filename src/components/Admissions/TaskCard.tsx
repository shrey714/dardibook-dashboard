import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { Clock, PenBoxIcon, User } from "lucide-react";
import { ColumnId } from "./KanbanBoard";
import { BedPatientTypes, OrgBed } from "@/types/FormTypes";

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
      {...attributes}
      {...listeners}
      style={style}
      className={`container relative cursor-grab flex flex-row bg-border overflow-hidden rounded-md shadow-md hover:shadow-lg ${variants(
        {
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        }
      )}`}
    >
      <div className="absolute left-0 z-0 top-0 h-full w-full bg-center dark:bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] bg-[radial-gradient(#58585852_1px,transparent_1px)] bg-[size:14px_14px]"></div>

      <div className="bg-yellow-300 w-1 h-full absolute left-0"></div>
      <div className="flex relative flex-1 flex-col h-full p-3">
        <div className="flex items-center justify-between pointer-events-auto">
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
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium">Age:</span> {bedPatientData.age}
          </p>
          <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
            <Clock className="h-3 w-3" />
            <span>
              Admitted: {new Date(task.admission_at).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
            <Clock className="h-3 w-3" />
            <span>
              Discharge: {new Date(task.discharge_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      <div className="bg-red-500 w-1 h-full absolute right-0"></div>
    </div>
  );
}
