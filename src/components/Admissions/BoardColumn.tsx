import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { TaskCard } from "./TaskCard";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "@/components/ui/button";
import { Bed, MapPinIcon, UserPlus } from "lucide-react";
import { BedInfo, BedPatientTypes, OrgBed } from "@/types/FormTypes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";

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
  bedPatients: Record<string, BedPatientTypes>;
  openAddModal: (bedId: string) => void;
  openEditModal: (bookingId: string, bedId: string) => void;
  isHighlighted: boolean;
  highlightedBooking: string | null;
}

export function BoardColumn({
  column,
  tasks,
  bedPatients,
  openAddModal,
  openEditModal,
  isHighlighted = false,
  highlightedBooking = "",
}: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.bedBookingId);
  }, [tasks]);

  const { setNodeRef, transform, transition } = useSortable({
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

  return (
    <Card
      id={`bed-${column.bed_id}`}
      ref={setNodeRef}
      style={style}
      className={`gap-0 py-0 flex-shrink-0 snap-center ${
        isHighlighted &&
        "animate-pulse ring-2 ring-primary ring-offset-2 ring-offset-background ring-opacity-75"
      }`}
    >
      <CardHeader className="p-4 pb-2.5 flex flex-row items-start justify-between">
        <CardTitle className="flex items-start flex-col text-lg font-medium gap-1 overflow-hidden">
          <span
            className="flex flex-row gap-2 truncate w-full"
            title={`Bed ${column.bed_id}`}
          >
            <Bed className="h-5 w-5 shrink-0" />
            <p className="line-clamp-1 leading-none truncate">
              {column.bed_id}
            </p>
          </span>
          <p className="line-clamp-1 text-start w-full flex gap-1.5 items-center text-muted-foreground text-xs">
            <MapPinIcon className="h-4 w-4 shrink-0" />
            {column.ward}
          </p>
        </CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                effect={"ringHover"}
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
        </TooltipProvider>
      </CardHeader>
      <CardContent className={`p-0 h-[434px] flex`}>
        {tasks.length === 0 ? (
          <div
            className={`border-2 border-dashed border-muted-foreground/60 items-center justify-center flex flex-col flex-1 rounded-lg p-8 text-center m-2 transition-colors text-muted-foreground/60`}
          >
            <Bed className={`h-8 w-8 mx-auto mb-2 text-muted-foreground`} />
            <p className="text-sm font-medium">Available bed</p>
            <p className="text-xs mt-1">Add new patient.</p>
          </div>
        ) : (
          <ScrollArea className="h-full w-full" type="always">
            <div className="flex flex-col gap-3 px-3 pb-3 pt-1">
              <SortableContext items={tasksIds}>
                {tasks.map((task) => {
                  return (
                    <TaskCard
                      key={task.bedBookingId}
                      task={task}
                      bedPatientData={bedPatients[task.patient_id]}
                      openEditModal={openEditModal}
                      isHighlightedBooking={
                        highlightedBooking === task.patient_id
                      }
                    />
                  );
                })}
              </SortableContext>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
