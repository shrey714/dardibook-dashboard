import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { Task, TaskCard } from "./TaskCard";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { BadgePlusIcon, GripVertical } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import Bed from "./Bed";

export interface Column {
  id: UniqueIdentifier;
  // title: string;
}

export type ColumnType = "Column";

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
  setIsModalOpen: any
}

export function BoardColumn({ column, tasks, isOverlay,setIsModalOpen }: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.id}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    "h-[500px] max-h-[500px] w-[350px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary",
        },
      },
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`pb-4 ${variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}`}
    >
      <CardHeader className="p-4">
        <Card>
          <CardHeader className="p-1">
            <CardTitle className="text-center flex">
              <Button
                variant={"ghost"}
                {...attributes}
                {...listeners}
                className=" p-1 text-primary/50 -ml-2 h-auto cursor-grab relative"
              >
                <span className="sr-only">{`Move column: ${column.id}`}</span>
                <GripVertical />
              </Button>
              <p className="flex flex-1 justify-center">bedInfo.id</p>
            </CardTitle>
            <CardContent className="p-2">
              <p className="flex justify-around items-center">
                Admit Patient
                <Button className="" variant="outline" size="sm" onClick={()=>{setIsModalOpen(true)}}>
                  <BadgePlusIcon />
                </Button>
              </p>
            </CardContent>
          </CardHeader>
        </Card>
      </CardHeader>
      <CardContent className="p-4 overflow-auto flex gap-2 flex-col">
          <SortableContext items={tasksIds}>
          {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          {/* {
              admissionInfo.length>0?admissionInfo.map((admissionInfo,index)=>(<PatientList />)):<>noadmission</>
            } */}
          </SortableContext>
        </CardContent>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center pb-4", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? "active" : "default",
      })}
    >
      <div className="flex flex-wrap gap-4 items-start">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
