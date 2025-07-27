import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { BoardColumn } from "./BoardColumn";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { getOverdueClashes, hasDraggableData } from "./utils";
import { BedInfo, OrgBed } from "@/types/FormTypes";
import { useOrganization } from "@clerk/nextjs";
import { useBedsStore } from "@/lib/stores/useBedsStore";
import BedNavigationHeader from "./BedNavigation";
import { Skeleton } from "../ui/skeleton";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import Image from "next/image";

export type ColumnId = string;
interface KanbanBoardProps {
  openAddModal: (bedId: string | null) => void;
  openEditModal: (bookingId: string, bedId: string) => void;
  isEditModalOpen: boolean;
  setWasEdited: React.Dispatch<React.SetStateAction<boolean>>;
  wasEdited: boolean;
}

const KanbanBoard = ({
  openAddModal,
  openEditModal,
  isEditModalOpen,
  setWasEdited,
  wasEdited,
}: KanbanBoardProps) => {
  const { organization, isLoaded } = useOrganization();
  const { beds, bedPatients, loading } = useBedsStore((state) => state);
  const pickedUpTaskColumn = useRef<ColumnId | null>(null);
  const [tasks, setTasks] = useState<OrgBed[]>([]);
  const [activeTask, setActiveTask] = useState<OrgBed | null>(null);

  const [prevTaskState, setPrevTaskState] = useState<{
    task: OrgBed;
    bookingId: string;
  } | null>(null);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  // Track which booking is currently being edited
  const [currentEditingBookingId, setCurrentEditingBookingId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (isEditModalOpen == false) {
      // Only revert if the task wasn't edited AND it matches the current editing booking
      if (
        !wasEdited &&
        prevTaskState &&
        prevTaskState.bookingId === currentEditingBookingId
      ) {
        setTasks((tasks) =>
          tasks.map((t) =>
            t.bedBookingId === prevTaskState.task.bedBookingId
              ? { ...prevTaskState.task }
              : t
          )
        );
      }
      // Clear the previous task state and current editing booking when modal closes
      setPrevTaskState(null);
      setCurrentEditingBookingId(null);
      setWasEdited(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditModalOpen]);

  const [bedFilters] = useQueryState(
    "bedFilters",
    parseAsArrayOf(parseAsString).withDefault([
      "occupied",
      "warning",
      "available",
    ])
  );

  const wards = useMemo(() => {
    return isLoaded && organization && organization.publicMetadata.beds
      ? [
          ...new Set(
            (organization.publicMetadata.beds as BedInfo[]).map(
              (bed) => bed.ward
            )
          ),
        ].sort()
      : [];
  }, [isLoaded, organization]);

  const [wardFilters] = useQueryState(
    "wardFilters",
    parseAsArrayOf(parseAsString).withDefault(wards)
  );

  const [searchQuery] = useQueryState("search", parseAsString.withDefault(""));

  const allColumns: BedInfo[] = useMemo(() => {
    return isLoaded && organization && organization.publicMetadata.beds
      ? (organization.publicMetadata.beds as BedInfo[])
      : [];
  }, [isLoaded, organization]);

  const [clashMap, setClashMap] = useState(() =>
    Object.keys(getOverdueClashes(beds))
  );

  useEffect(() => {
    setClashMap(Object.keys(getOverdueClashes(beds)));
    const interval = setInterval(() => {
      setClashMap(Object.keys(getOverdueClashes(beds)));
    }, 60_000);

    return () => clearInterval(interval);
  }, [beds]);

  const columns: BedInfo[] = useMemo(() => {
    return allColumns.filter((col) => {
      if (!wardFilters.includes(col.ward)) {
        return false;
      }

      // Get bed patients and status
      const bedPatient = tasks.filter((task) => task.bedId === col.bed_id);
      const hasPatient = bedPatient.length > 0;
      const hasWarning = bedPatient.some((patient) =>
        clashMap.includes(patient.patient_id)
      );

      // Determine bed statuses (can have multiple)
      const bedStatuses: string[] = [];
      if (hasWarning) bedStatuses.push("warning");
      if (hasPatient) bedStatuses.push("occupied");
      if (!hasPatient) bedStatuses.push("available");

      // Check if any bed status matches selected filters
      if (!bedStatuses.some((status) => bedFilters.includes(status))) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();

        if (col.bed_id.toLowerCase().includes(searchLower)) {
          return true;
        }

        return bedPatient.some((patient) => {
          const patientName = bedPatients[patient.patient_id]?.name || "";
          return patientName.toLowerCase().includes(searchLower);
        });
      }

      return true;
    });
  }, [
    allColumns,
    wardFilters,
    bedFilters,
    tasks,
    searchQuery,
    bedPatients,
    clashMap,
  ]);

  const columnsId = useMemo(() => columns.map((col) => col.bed_id), [columns]);

  useEffect(() => {
    if (!loading) setTasks(structuredClone(beds));
  }, [beds, loading]);

  // Function to scroll to a specific bed and highlight it
  const [highlightedBed, setHighlightedBed] = useState<string | null>(null);
  const [highlightedBooking, setHighlightedBooking] = useState<string | null>(
    null
  );
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollToBed = (bedId: string) => {
    const bedElement = document.getElementById(`bed-${bedId}`);
    if (bedElement) {
      bedElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
      setHighlightedBed(bedId);
      highlightTimeoutRef.current = setTimeout(() => {
        setHighlightedBed(null);
        highlightTimeoutRef.current = null;
      }, 2000);
    }
  };

  const scrollToBooking = (bookingId: string) => {
    const bedElement = document.getElementById(`booking-${bookingId}`);
    if (bedElement) {
      bedElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
      setHighlightedBooking(bookingId);
      highlightTimeoutRef.current = setTimeout(() => {
        setHighlightedBooking(null);
        highlightTimeoutRef.current = null;
      }, 2000);
    }
  };

  return (
    <>
      {/* Bed Navigation Header */}
      <BedNavigationHeader
        beds={allColumns}
        patients={beds}
        bedPatients={bedPatients}
        onBedClick={scrollToBed}
        onWarningClick={scrollToBooking}
        openAddModal={openAddModal}
      />
      <div className="w-full min-h-[calc(100%-5rem)] flex flex-col max-w-[2000px] justify-self-center">
        {loading || !isLoaded ? (
          <div className="grid gap-3 px-1 sm:px-3 pb-16 pt-4 grid-cols-[repeat(auto-fit,minmax(250px,350px))] sm:grid-cols-[repeat(auto-fit,minmax(350px,350px))] justify-center">
            {[...Array(10)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-[500px] max-h-[500px] rounded-md"
              />
            ))}
          </div>
        ) : columns.length === 0 ? (
          <div className="flex flex-1 flex-col gap-4 justify-center items-center h-full min-h-96 py-5 px-2">
            <Image
              className="w-full max-w-[16rem]"
              src="/empty.svg"
              alt=""
              width={256}
              height={256}
              priority={true}
            />
            <p className="text-xs sm:text-sm text-center text-muted-foreground">
              No beds found. Please add beds to get started.
            </p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
          >
            <div className="h-full grid gap-3 px-1 sm:px-3 pb-16 pt-4 grid-cols-[repeat(auto-fit,minmax(250px,350px))] sm:grid-cols-[repeat(auto-fit,minmax(350px,350px))] justify-center">
              <SortableContext items={columnsId}>
                {columns.map((col) => (
                  <BoardColumn
                    key={col.bed_id}
                    column={col}
                    tasks={tasks.filter((task) => task.bedId === col.bed_id)}
                    openAddModal={openAddModal}
                    openEditModal={(bookingId, bedId) => {
                      // Set the current editing booking ID when opening edit modal
                      setCurrentEditingBookingId(bookingId);
                      openEditModal(bookingId, bedId);
                    }}
                    bedPatients={bedPatients}
                    isHighlighted={highlightedBed === col.bed_id}
                    highlightedBooking={highlightedBooking}
                  />
                ))}
              </SortableContext>
            </div>

            {"document" in window &&
              createPortal(
                <DragOverlay>
                  {activeTask && (
                    <TaskCard
                      task={activeTask}
                      bedPatientData={bedPatients[activeTask.patient_id]}
                      openEditModal={(bookingId, bedId) => {
                        // Set the current editing booking ID when opening edit modal from drag overlay
                        setCurrentEditingBookingId(bookingId);
                        openEditModal(bookingId, bedId);
                      }}
                    />
                  )}
                </DragOverlay>,
                document.body
              )}
          </DndContext>
        )}
      </div>
    </>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;

    if (data?.type === "Task") {
      setActiveTask(data.task);
      pickedUpTaskColumn.current = data.task.bedId;
      // Store the previous task state with its booking ID
      setPrevTaskState({
        task: { ...data.task },
        bookingId: data.task.bedBookingId,
      });
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over } = event;
    if (!over && prevTaskState) {
      // Only revert if no valid drop target and we have previous state
      setTasks((tasks) =>
        tasks.map((t) =>
          t.bedBookingId === prevTaskState.task.bedBookingId
            ? { ...prevTaskState.task }
            : t
        )
      );
      setPrevTaskState(null);
      return;
    }
    if (!over || !hasDraggableData(active)) return;

    const activeData = active.data.current;

    // ✅ Handle task being dropped into new column
    if (activeData?.type === "Task") {
      const task = activeData.task;
      const oldColumnId = pickedUpTaskColumn.current;
      const newColumnId = over.data.current?.task?.bedId || over.id;

      if (oldColumnId === newColumnId) {
        // Clear previous task state if dropped in same column
        setPrevTaskState(null);
        pickedUpTaskColumn.current = null;
        return;
      }

      if (oldColumnId !== newColumnId) {
        setTasks((tasks) =>
          tasks.map((t) =>
            t.bedBookingId === task.bedBookingId
              ? { ...t, bedId: newColumnId as ColumnId }
              : t
          )
        );

        // Set the current editing booking ID when opening edit modal after drag
        setCurrentEditingBookingId(task.bedBookingId);
        openEditModal(task.bedBookingId, task.bedId);
      }
    }

    pickedUpTaskColumn.current = null;
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === "Task";
    const isOverATask = overData?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.bedBookingId === activeId);
        const overIndex = tasks.findIndex((t) => t.bedBookingId === overId);
        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];
        if (activeTask && overTask && activeTask.bedId !== overTask.bedId) {
          activeTask.bedId = overTask.bedId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = overData?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.bedBookingId === activeId);
        const activeTask = tasks[activeIndex];
        if (activeTask) {
          activeTask.bedId = overId as ColumnId;
          return arrayMove(tasks, activeIndex, activeIndex);
        }
        return tasks;
      });
    }
  }
};

export default KanbanBoard;
