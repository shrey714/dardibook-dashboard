import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { BadgeMinusIcon, GripVertical, LogIn, LogOut } from "lucide-react";
import { Badge } from "../ui/badge";
import { ColumnId } from "./KanbanBoard";
import { format } from "date-fns";

export interface Task {
  id: UniqueIdentifier;
  columnId: ColumnId;
  content: string;
}

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
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
    // <Card
    //   ref={setNodeRef}
    //   style={style}
    //   className={variants({
    //     dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
    //   })}
    // >
    //   <CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative">
    //     <Button
    //       variant={"ghost"}
    //       {...attributes}
    //       {...listeners}
    //       className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
    //     >
    //       <span className="sr-only">Move task</span>
    //       <GripVertical />
    //     </Button>
    //     <Badge variant={"outline"} className="ml-auto font-semibold">
    //       Task
    //     </Badge>
    //   </CardHeader>
    //   <CardContent className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap">
    //     {task.content}
    //   </CardContent>
    // </Card>
    <div
    ref={setNodeRef}
      style={style}
      className={`container flex justify-between rounded-md border px-1 py-2 font-mono text-sm shadow-sm ${variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}`}
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
      <p className="text-sm flex-[5]">Jeet Oza</p>
      <div className="flex flex-[5] flex-wrap md:gap-2">
        <p className="text-xs flex gap-1">
          <LogIn size={14} />
          {format(new Date(), "dd/MM HH:mm")}
        </p>
        <p className="text-xs flex gap-1">
          <LogOut size={14} />
          {format(new Date(), "dd/MM HH:mm")}
        </p>
      </div>
      </div>
      <Button className="" variant="outline" size="sm">
        <BadgeMinusIcon />
      </Button>
      
    </div>
  );
}
