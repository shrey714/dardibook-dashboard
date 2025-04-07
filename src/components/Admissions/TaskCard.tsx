import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import {
  BadgeMinusIcon,
  GripVertical,
  LogIn,
  LogOut,
} from "lucide-react";
import { ColumnId } from "./KanbanBoard";
import { format, getTime } from "date-fns";
import { BedPatientTypes, OrgBed } from "@/types/FormTypes";
import { useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { writeBatch, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/clerk-react";
import Loader from "../common/Loader";

export interface Task {
  id: UniqueIdentifier;
  columnId: ColumnId;
  content: string;
}

interface TaskCardProps {
  task: OrgBed;
  isOverlay?: boolean;
  bedPatientData: BedPatientTypes;
  setIsEditModalOpen:any;
  openEditModal:any;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: OrgBed;
  bedPatientData: BedPatientTypes;
  setIsEditModalOpen:any;
  openEditModal:any;
}

export function TaskCard({
  task,
  isOverlay,
  bedPatientData,
  setIsEditModalOpen,
  openEditModal
}: TaskCardProps) {
  const [dischargeLoader, setDischargeLoader] = useState(false);
  const {user} = useUser();
  const {orgId} = useAuth();
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
      openEditModal
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`container flex justify-between rounded-md border px-1 py-2 font-mono text-sm shadow-sm ${variants(
        {
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        }
      )}`}
    >
      <Button
        variant={"ghost"}
        {...attributes}
        {...listeners}
        className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
      >
        <span className="sr-only">Move task</span>
        <GripVertical />
      </Button>
      <div>
        <p className="text-sm flex-[5]">{bedPatientData.name}</p>
        <div className="flex flex-[5] flex-wrap md:gap-2">
          <p className="text-xs flex gap-1">
            <LogIn size={14} />
            {format(new Date(task.admission_at), "dd/MM HH:mm")}
          </p>
          <p className="text-xs flex gap-1">
            <LogOut size={14} />
            {format(new Date(task.discharge_at), "dd/MM HH:mm")}
          </p>
        </div>
      </div>
          <Button
            className=""
            variant="outline"
            size="sm"
            onClick={() => {
              openEditModal(task.bedBookingId)
            }}
          >
            {dischargeLoader?<Loader size="small" />:<BadgeMinusIcon />}
          </Button>
    </div>
  );
}
