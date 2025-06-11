import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { TaskCard } from "./TaskCard";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";
import { Bed, Trash, UserPlus } from "lucide-react";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { BedInfo, BedPatientTypes, OrgBed } from "@/types/FormTypes";
import Loader from "../common/Loader";
import { Skeleton } from "../ui/skeleton";

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
  loading: boolean;
  isHighlighted?: boolean;
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
  loading,
  isHighlighted = false,
}: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.bedBookingId);
  }, [tasks]);

  const { setNodeRef, transform, transition, isDragging } = useSortable({
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
    "h-[500px] max-h-[500px] rounded-lg bg-primary-foreground flex flex-col flex-shrink-0 snap-center",
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
      id={`bed-${column.id}`}
      ref={setNodeRef}
      style={style}
      className={`${variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })} ${
        isHighlighted
          ? "animate-pulse ring-2 ring-yellow-600 dark:ring-yellow-400 ring-opacity-75"
          : ""
      }`}
    >
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Bed className="h-5 w-5 shrink-0" />
            <p className="line-clamp-1" title={`Bed ${column.id}`}>
              Bed {column.id}
            </p>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              className="bg-blue-500 hover:bg-blue-500/90 text-white hover:text-white"
              variant="outline"
              onClick={() => {
                openAddModal(column.id);
              }}
            >
              <UserPlus />
            </Button>
            <Button
              className={`${
                !!tasks.length || loading ? "cursor-not-allowed opacity-50" : ""
              }`}
              variant={"destructive"}
              onClick={deleteHandler}
              aria-disabled={!!tasks.length || loading}
            >
              {deleteLoader ? (
                <Loader />
              ) : (
                <>
                  <Trash />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent
        className={`p-4 overflow-auto flex gap-2 flex-col ${
          tasks.length == 0 ? "h-full" : ""
        }`}
      >
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : tasks.length === 0 ? (
          <div
            className={`border-2 border-dashed border-muted-foreground/60 h-full items-center justify-center flex flex-col rounded-lg p-8 text-center transition-colors text-muted-foreground/60`}
          >
            <Bed className={`h-8 w-8 mx-auto mb-2 text-muted-foreground`} />
            <p className="text-sm font-medium">Available bed</p>
            <p className="text-xs mt-1">Add new patient.</p>
          </div>
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
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva("px-2 md:px-0 flex lg:justify-center", {
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
      <div className="grid gap-3 px-3 pb-16 pt-4 grid-cols-[repeat(auto-fit,minmax(350px,350px))] justify-center">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
