import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import {
  BedIcon,
  CalendarMinus,
  CalendarPlus,
  CalendarPlusIcon,
  ClipboardListIcon,
  LogOutIcon,
  PenBoxIcon,
  PencilLineIcon,
  StethoscopeIcon,
  User,
  UserPlusIcon,
} from "lucide-react";
import { ColumnId } from "./KanbanBoard";
import { BedPatientTypes, OrgBed } from "@/types/FormTypes";
import { format } from "date-fns";
import { usePatientHistoryModalStore } from "@/lib/stores/patientHistoryModalStore";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ScrollArea } from "../ui/scroll-area";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";

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
  const { openModal } = usePatientHistoryModalStore();

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
          <div className="flex flex-1 flex-row items-center gap-2">
            <User className="size-5 text-primary shrink-0" />
            <Button
              variant={"link"}
              className="h-auto p-0 font-semibold text-primary leading-none text-base"
              onClick={() => {
                openModal({ patientId: bedPatientData.patient_id });
              }}
            >
              {bedPatientData.name}
            </Button>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" type="button" size="icon">
                  <Popover>
                    <PopoverTrigger asChild>
                      <span>
                        <ClipboardListIcon />
                      </span>
                    </PopoverTrigger>
                    <PopoverContent
                      side="left"
                      collisionPadding={20}
                      sideOffset={10}
                      className="w-96 max-w-md bg-muted/50 backdrop-blur-3xl border-0 p-0 overflow-hidden"
                      style={{
                        boxShadow:
                          "0 3px 4px 0 rgba(0,0,0,.14),0 3px 3px -2px rgba(0,0,0,.12),0 1px 8px 0 rgba(0,0,0,.2)",
                      }}
                    >
                      <header className="flex flex-row items-center justify-end p-2.5 pb-0">
                        <PopoverClose asChild aria-label="Close">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="rounded-full"
                          >
                            <Cross2Icon />
                          </Button>
                        </PopoverClose>
                      </header>

                      <ScrollArea className="h-96 w-full">
                        <div className="pt-0 p-4 pb-0 flex flex-col gap-2">
                          <Timeline
                            orientation="vertical"
                            className="pt-2 px-2 pb-2"
                          >
                            <TimelineItem>
                              <TimelineSeparator>
                                <UserPlusIcon
                                  size={36}
                                  className="bg-blue-600/10 text-blue-600 border border-blue-600 rounded-full p-2"
                                />
                                <TimelineConnector />
                              </TimelineSeparator>
                              <TimelineContent>
                                <TimelineTitle className="text-xs text-muted-foreground">
                                  {bedPatientData.patient_id}
                                </TimelineTitle>
                                <TimelineDescription className="text-primary text-sm font-medium">
                                  {bedPatientData.name}
                                </TimelineDescription>
                              </TimelineContent>
                            </TimelineItem>

                            <TimelineItem>
                              <TimelineSeparator>
                                <div className="px-[6px]">
                                  <CalendarPlusIcon
                                    size={24}
                                    className="text-yellow-400"
                                  />
                                </div>
                                <TimelineConnector className="bg-yellow-400" />
                              </TimelineSeparator>
                              <TimelineContent>
                                <TimelineTitle className="text-xs text-muted-foreground">
                                  Admitted on
                                </TimelineTitle>
                                <TimelineDescription className="text-primary text-sm font-medium">
                                  {format(
                                    task.admission_at,
                                    "h.mm a, MMMM d, yyyy"
                                  )}
                                </TimelineDescription>
                              </TimelineContent>
                            </TimelineItem>

                            <TimelineItem>
                              <TimelineSeparator>
                                <PencilLineIcon
                                  size={36}
                                  className="bg-blue-600/10 text-blue-600 border border-blue-600 rounded-md p-2"
                                />
                              </TimelineSeparator>
                              <TimelineContent className="pb-1.5">
                                <TimelineTitle className="text-xs text-muted-foreground">
                                  Admitted By
                                </TimelineTitle>
                                <TimelineDescription className="text-primary text-sm font-medium">
                                  {task.admission_by.name}
                                </TimelineDescription>
                              </TimelineContent>
                            </TimelineItem>

                            <TimelineItem>
                              <TimelineSeparator>
                                <StethoscopeIcon
                                  size={36}
                                  className="bg-green-500/10 text-green-600 border border-green-600 rounded-md p-2"
                                />
                              </TimelineSeparator>
                              <TimelineContent className="pb-1.5">
                                <TimelineTitle className="text-xs text-muted-foreground">
                                  Admitted For
                                </TimelineTitle>
                                <TimelineDescription className="text-primary text-sm font-medium">
                                  {task.admission_for.name}
                                </TimelineDescription>
                              </TimelineContent>
                            </TimelineItem>

                            <TimelineItem>
                              <TimelineSeparator>
                                <BedIcon
                                  size={36}
                                  className="bg-blue-600/10 text-blue-600 border border-blue-600 rounded-md p-2"
                                />
                                <TimelineConnector className="bg-red-500" />
                              </TimelineSeparator>

                              <TimelineContent className="pb-10">
                                <TimelineTitle className="text-xs text-muted-foreground">
                                  Bed ID
                                </TimelineTitle>
                                <TimelineDescription className="text-primary text-sm font-medium">
                                  {task.bedId}
                                </TimelineDescription>
                              </TimelineContent>
                            </TimelineItem>

                            <TimelineItem>
                              <TimelineSeparator>
                                <div className="px-[6px]">
                                  <CalendarMinus
                                    size={24}
                                    className="text-red-500"
                                  />
                                </div>
                                {task.dischargeMarked && <TimelineConnector />}
                              </TimelineSeparator>
                              <TimelineContent>
                                <TimelineTitle className="text-xs text-muted-foreground">
                                  {task.dischargeMarked
                                    ? "Discharged on"
                                    : "Expected discharge on"}
                                </TimelineTitle>
                                <TimelineDescription className="text-primary text-sm font-medium">
                                  {format(
                                    task.discharge_at,
                                    "h.mm a, MMMM d, yyyy"
                                  )}
                                </TimelineDescription>
                              </TimelineContent>
                            </TimelineItem>

                            {task.dischargeMarked && (
                              <TimelineItem>
                                <TimelineSeparator>
                                  <LogOutIcon
                                    size={36}
                                    className="bg-red-500/10 text-red-500 border border-red-500 rounded-md p-2"
                                  />
                                </TimelineSeparator>
                                <TimelineContent className="pb-1.5">
                                  <TimelineTitle className="text-xs text-muted-foreground">
                                    Discharged By
                                  </TimelineTitle>
                                  <TimelineDescription className="text-primary text-base font-medium">
                                    {task.discharged_by?.name}
                                  </TimelineDescription>
                                </TimelineContent>
                              </TimelineItem>
                            )}
                          </Timeline>
                        </div>
                      </ScrollArea>
                    </PopoverContent>
                  </Popover>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Admission Timeline</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size={"icon"}
                  onClick={() => {
                    openEditModal(task.bedBookingId, task.bedId);
                  }}
                  variant={"ghost"}
                >
                  <PenBoxIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-60">
                <p>Edit Admission</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
