import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { TaskCard } from "./TaskCard";
import { cva } from "class-variance-authority";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "@/components/ui/button";
import { BadgePlusIcon, GripVertical, Trash } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { BedInfo, BedPatientTypes, OrgBed } from "@/types/FormTypes";
import Loader from "../common/Loader";

export interface Column {
  id: UniqueIdentifier;
}

export type ColumnType = "Column";

export interface ColumnDragData {
  type: ColumnType;
  column: BedInfo;
}

interface BoardColumnProps {
  column: BedInfo;
  tasks: OrgBed[];
  isOverlay?: boolean;
  setIsEditModalOpen: any;
  bedPatients: Record<string, BedPatientTypes>;
  openAddModal: any;
  openEditModal: any;
  deleteBed: any;
}

export function BoardColumn({
  column,
  tasks,
  isOverlay,
  bedPatients,
  setIsEditModalOpen,
  openAddModal,
  openEditModal,
  deleteBed,
}: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.bedBookingId);
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

  const [deleteLoader, setDeleteLoader] = useState(false);

  const deleteHandler = () => {
    setDeleteLoader(true);
    deleteBed(column.id);
    // setDeleteLoader(false)
  };

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
              <p className="flex flex-1 justify-center">${column.id}</p>
            </CardTitle>
            <CardContent className="p-2">
              <p className="flex justify-around items-center">
                Admit Patient
                <Button
                  className=""
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    openAddModal(column.id);
                  }}
                >
                  <BadgePlusIcon />
                </Button>
              </p>
            </CardContent>
          </CardHeader>
        </Card>
      </CardHeader>
      <CardContent
        className={`p-4 overflow-auto flex gap-2 flex-col ${
          tasks.length == 0 ? "h-full" : ""
        }`}
      >
        {tasks.length == 0 ? (
          <>
            <div className="w-full h-full flex justify-center items-center text-sm">
              This Bed is Empty
            </div>
          </>
        ) : (
          <SortableContext items={tasksIds}>
            {tasks.map((task) => {
              return (
                <TaskCard
                  key={task.bedBookingId}
                  task={task}
                  bedPatientData={bedPatients[task.patient_id]}
                  setIsEditModalOpen={setIsEditModalOpen}
                  openEditModal={openEditModal}
                />
              );
            })}
          </SortableContext>
        )}
      </CardContent>
      {!tasks.length && (
        <CardFooter className="p-0">
          <Button
            className="w-full mx-4"
            variant={"destructive"}
            onClick={deleteHandler}
          >
            {deleteLoader ? (
              <Loader />
            ) : (
              <>
                <Trash /> Delete Bed
              </>
            )}
          </Button>
        </CardFooter>
      )}
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
      className={`h-full ${variations({
        dragging: dndContext.active ? "active" : "default",
      })}`}
    >
      <div className="flex flex-wrap gap-4 items-start h-full">{children}</div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
