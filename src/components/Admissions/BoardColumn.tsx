import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Dispatch, SetStateAction, useMemo } from "react";
import { TaskCard } from "./TaskCard";
import { cva } from "class-variance-authority";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";
import { Bed, MapPinIcon, Trash2, UserPlus } from "lucide-react";
import { BedInfo, BedPatientTypes, OrgBed } from "@/types/FormTypes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface Column {
  id: UniqueIdentifier;
}

export type ColumnType = "Column";

export interface ColumnDragData {
  type: ColumnType;
  column: BedInfo;
}

interface DeleteState {
  deleteModalOpen: boolean;
  deleteLoader: boolean;
  bedToDelete: null | string;
}

interface BoardColumnProps {
  column: BedInfo;
  tasks: OrgBed[];
  setIsEditModalOpen: any;
  bedPatients: Record<string, BedPatientTypes>;
  openAddModal: any;
  openEditModal: any;
  setDeleteState: Dispatch<SetStateAction<DeleteState>>;
  isHighlighted?: boolean;
}

export function BoardColumn({
  column,
  tasks,
  bedPatients,
  setIsEditModalOpen,
  openAddModal,
  openEditModal,
  setDeleteState,
  isHighlighted = false,
}: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.bedBookingId);
  }, [tasks]);

  const { setNodeRef, transform, transition, isDragging } = useSortable({
    id: column.bed_id,
    data: {
      type: "Column",
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.bed_id}`,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    "h-[500px] max-h-[500px] rounded-md bg-primary-foreground flex flex-col flex-shrink-0 snap-center",
    {
      variants: {
        dragging: {
          default: "border-2 border-transparent",
          over: "ring-2 opacity-30",
        },
      },
    }
  );

  const deleteHandler = () => {
    setDeleteState((state) => ({
      ...state,
      deleteModalOpen: true,
      bedToDelete: column.bed_id,
    }));
  };

  return (
    <Card
      id={`bed-${column.bed_id}`}
      ref={setNodeRef}
      style={style}
      className={`${variants({
        dragging: isDragging ? "over" : undefined,
      })} ${
        isHighlighted
          ? "animate-pulse ring-2 ring-yellow-600 dark:ring-yellow-400 ring-opacity-75"
          : ""
      }`}
    >
      <CardHeader className="p-4 pb-1">
        <div className="flex items-baseline justify-between">
          <CardTitle className="flex items-center flex-col text-lg font-medium">
            <p
              className="line-clamp-1 flex gap-2 items-center"
              title={`Bed ${column.bed_id}`}
            >
              <Bed className="h-5 w-5 shrink-0" />
              {column.bed_id}
            </p>
            <p className="line-clamp-1 text-start w-full flex gap-1.5 items-center text-muted-foreground text-xs">
              <MapPinIcon className="h-4 w-4 shrink-0" />
              {column.ward}
            </p>
          </CardTitle>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-500 hover:text-blue-700 bg-blue-500/10 hover:bg-blue-700/10"
                    onClick={() => {
                      openAddModal(column.bed_id);
                    }}
                  >
                    <UserPlus />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add new patient</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 bg-red-500/10 hover:bg-red-700/10"
                    onClick={deleteHandler}
                  >
                    <Trash2 />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-60">
                  <p>Remove bed</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent
        className={`p-2 sm:p-4 overflow-auto flex gap-2 flex-col ${
          tasks.length == 0 ? "h-full" : ""
        }`}
      >
        {tasks.length === 0 ? (
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

  const variations = cva("", {
    variants: {
      dragging: {
        default: "snap-x snap-mandatory",
        active: "snap-none",
      },
    },
  });

  return (
    <div
      className={`${variations({
        dragging: dndContext.active ? "active" : "default",
      })} h-full grid gap-3 px-1 sm:px-3 pb-16 pt-4 grid-cols-[repeat(auto-fit,minmax(250px,350px))] sm:grid-cols-[repeat(auto-fit,minmax(350px,350px))] justify-center`}
    >
      {children}
    </div>
  );
}
