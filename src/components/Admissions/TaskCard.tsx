import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import {
  BedIcon,
  CalendarClockIcon,
  CalendarMinus,
  CalendarPlus,
  CalendarPlusIcon,
  ClipboardListIcon,
  ClockAlertIcon,
  LogOutIcon,
  PenBoxIcon,
  PencilLineIcon,
  StethoscopeIcon,
  User,
  UserPlusIcon,
} from "lucide-react";
import { ColumnId } from "./KanbanBoard";
import { BedPatientTypes, OrgBed } from "@/types/FormTypes";
import { format, getTime, isSameDay } from "date-fns";
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
  bedPatientData: BedPatientTypes;
  openEditModal: (bookingId: string, bedId: string) => void;
  isHighlightedBooking?: boolean;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: OrgBed;
  bedPatientData: BedPatientTypes;
  openEditModal: (bookingId: string, bedId: string) => void;
}

export function TaskCard({
  task,
  bedPatientData,
  openEditModal,
  isHighlightedBooking,
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
      },
    },
  });

  return (
    <div
      id={`booking-${task.patient_id}`}
      ref={setNodeRef}
      style={style}
      className={`container relative flex flex-row bg-border overflow-hidden rounded-md shadow-md hover:shadow-lg ${variants(
        {
          dragging: isDragging ? "over" : undefined,
        }
      )} ${
        isHighlightedBooking &&
        "animate-pulse ring-2 ring-primary ring-offset-2 ring-offset-background ring-opacity-75"
      }`}
    >
      {bedPatientData && (
        <div className="flex relative flex-1 flex-col h-full p-0">
          <div className="flex items-center justify-between pointer-events-auto px-3 pt-1">
            <div className="flex flex-1 flex-row items-center gap-2 line-clamp-1 truncate w-max">
              <User className="size-5 text-foreground shrink-0" />
              <Button
                variant={"link"}
                className="h-auto p-0 font-medium text-foreground leading-none text-base"
                onClick={() => {
                  openModal({ patientId: bedPatientData.patient_id });
                }}
              >
                <p className="truncate max-w-28 sm:max-w-40">
                  {bedPatientData.name}
                </p>
              </Button>
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" type="button" size="icon">
                    <Popover>
                      <PopoverTrigger asChild>
                        <span
                          id="shrey"
                          className="flex size-full items-center justify-center"
                        >
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
                                  <TimelineDescription className="text-foreground text-sm font-medium">
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
                                  <TimelineDescription className="text-foreground text-sm font-medium">
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
                                  <TimelineDescription className="text-foreground text-sm font-medium">
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
                                  <TimelineDescription className="text-foreground text-sm font-medium">
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
                                  <TimelineDescription className="text-foreground text-sm font-medium">
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
                                  {task.dischargeMarked && (
                                    <TimelineConnector />
                                  )}
                                </TimelineSeparator>
                                <TimelineContent>
                                  <TimelineTitle className="text-xs text-muted-foreground">
                                    {task.dischargeMarked
                                      ? "Discharged on"
                                      : "Expected discharge on"}
                                  </TimelineTitle>
                                  <TimelineDescription className="text-foreground text-sm font-medium">
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
          <div className="text-sm text-muted-foreground px-3 flex">
            <div className="flex flex-col flex-1 space-y-1.5">
              <p className="leading-none">
                <span className="font-medium">Age:</span> {bedPatientData.age}
              </p>
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <CalendarPlus className="h-3 w-3" />
                <span className="leading-none">
                  Admitted: {format(task.admission_at, "do MMM yy, h:mm a")}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                <CalendarMinus className="h-3 w-3" />
                <span className="leading-none">
                  Discharge: {format(task.discharge_at, "do MMM yy, h:mm a")}
                </span>
              </div>
            </div>
            {task.discharge_at < getTime(new Date()) && (
              <div className="h-full flex items-center justify-end max-w-16 p-2 rounded-r-md flex-1 bg-gradient-to-l from-red-500/30 to-red-500/0">
                <ClockAlertIcon
                  size={24}
                  strokeWidth={1.6}
                  className="text-red-500"
                />
              </div>
            )}
            {task.admission_at > getTime(new Date()) && (
              <div className="h-full flex items-center justify-end max-w-16 p-2 rounded-r-md flex-1 bg-gradient-to-l from-yellow-500/30 to-yellow-500/0">
                <CalendarClockIcon
                  size={24}
                  strokeWidth={1.6}
                  className="text-yellow-500"
                />
              </div>
            )}
          </div>
          <div
            {...attributes}
            {...listeners}
            className={`h-5 mt-1.5 z-0 ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            } w-full bg-center overflow-hidden dark:bg-[radial-gradient(#767676_1px,transparent_1px)] bg-[radial-gradient(#000000a1_1px,transparent_1px)] bg-[size:5px_5px] shadow-[inset_0px_21px_5px_-14px_hsl(var(--border))]`}
          ></div>
        </div>
      )}
      {isSameDay(task.admission_at, new Date()) ? (
        <div className="bg-green-400 w-1 h-full absolute left-0"></div>
      ) : (
        <div className="bg-yellow-500/90 w-1 h-full absolute left-0"></div>
      )}
      {isSameDay(task.discharge_at, new Date()) ? (
        <div className="bg-red-500 w-1 h-full absolute right-0"></div>
      ) : (
        <div className="bg-yellow-500/90 w-1 h-full absolute right-0"></div>
      )}
    </div>
  );
}
