import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import {
  BadgeMinusIcon,
  Check,
  ClipboardPen,
  Grip,
  GripVertical,
  LogIn,
  LogOut,
  Trash,
  X,
} from "lucide-react";
import { ColumnId } from "./KanbanBoard";
import { format } from "date-fns";
import { BedPatientTypes, OrgBed } from "@/types/FormTypes";
import { useState } from "react";
import Loader from "../common/Loader";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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
  const [dischargeLoader, setDischargeLoader] = useState(false);
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

  const [popOpen, setPopOpen] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`container flex justify-between items-center rounded-md border h-24 overflow-hidden font-mono text-sm shadow-sm ${variants(
        {
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        }
      )}`}
    >
      <div className="bg-yellow-300/90 w-1 h-full"></div>
      <div className="flex flex-1 pr-2 items-center h-full">
        <Button
          variant={"ghost"}
          size={"sm"}
          {...attributes}
          {...listeners}
          className="px-3 text-secondary-foreground/50 h-auto cursor-grab"
        >
          <span className="sr-only">Move task</span>
          <Grip />
        </Button>
        <div className="flex-1 h-full">
          <div className="text-sm flex-[5] h-1/2">{bedPatientData.name}</div>
          <div className="flex flex-[5] flex-wrap md:gap-2 h-1/2">
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
        <div className="flex h-full flex-col justify-around">
          <Button
            className=""
            variant="outline"
            size="sm"
            onClick={() => {
              openEditModal(task.bedBookingId, task.bedId);
            }}
          >
            {dischargeLoader ? <Loader size="small" /> : <ClipboardPen />}
          </Button>
          <Popover open={popOpen}>
            <PopoverTrigger asChild>
              <Button
                className=""
                variant="outline"
                size="sm"
                onClick={() => setPopOpen(true)}
                // onClick={() => {
                //   // openEditModal(task.bedBookingId, task.bedId);
                // }}
              >
                {dischargeLoader ? <Loader size="small" /> : <Trash />}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-48 flex flex-row justify-between items-center p-2"
            >
              <span className="">Are you sure?</span>
              <span className="flex items-center">
                <Button className="mr-1 h-6 w-6" size={"sm"}>
                  <Check className="p-[2px]" />
                </Button>
                <Button
                  size={"sm"}
                  className=" h-6 w-6"
                  onClick={() => setPopOpen(false)}
                >
                  <X className="p-[2px]" />
                </Button>
              </span>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div className="bg-red-500 w-1 h-full"></div>
    </div>
  );
}
