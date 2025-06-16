import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { BoardColumn, BoardContainer } from "./BoardColumn";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  UniqueIdentifier,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { hasDraggableData } from "./utils";
import { BedInfo, OrgBed } from "@/types/FormTypes";
import { useOrganization } from "@clerk/nextjs";
import { useBedsStore } from "@/lib/stores/useBedsStore";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import Loader from "../common/Loader";
import BedNavigationHeader from "./BedNavigation";
import { AlertTriangle, Bed, PlusCircleIcon, X } from "lucide-react";
import { updateOrgBedMetaData } from "@/app/dashboard/admissions/_actions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "../ui/skeleton";

export type ColumnId = string;

interface DeleteState {
  deleteModalOpen: boolean;
  deleteLoader: boolean;
  bedToDelete: null | string;
}

export const KanbanBoard = ({
  openAddModal,
  openEditModal,
  setIsEditModalOpen,
  refresh,
  isEditModalOpen,
  setWasEdited,
  wasEdited,
  addNewBedHandler,
  bedAddLoader,
}: any) => {
  const { organization, isLoaded } = useOrganization();
  const { beds, bedPatients, loading } = useBedsStore((state) => state);
  console.log("beddata just after zustand : ",beds);
  const [columns, setColumns] = useState<BedInfo[]>([]);
  const pickedUpTaskColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.bed_id), [columns]);
  const [tasks, setTasks] = useState<OrgBed[]>([]);
  const [activeTask, setActiveTask] = useState<OrgBed | null>(null);
  const [prevTaskState, setPrevTaskState] = useState<OrgBed | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  useEffect(() => {
    if (isEditModalOpen == false) {
      if (!wasEdited && prevTaskState) {
        setTasks((tasks) =>
          tasks.map((t) =>
            t.bedBookingId === prevTaskState.bedBookingId
              ? { ...prevTaskState }
              : t
          )
        );
        setPrevTaskState(null);
      }
      setWasEdited(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditModalOpen]);

  useEffect(() => {
    const fetchBedMetaData = () => {
      if (organization && organization.publicMetadata) {
        const bedMetaData: BedInfo[] =
          (organization.publicMetadata?.beds as BedInfo[]) || [];
        setColumns(bedMetaData);
      }
    };

    if (isLoaded && organization) {
      fetchBedMetaData();
      // setTasks(beds);
    }
  }, [isLoaded, organization, refresh]);

  useEffect(() => {
    if (!loading) setTasks(structuredClone(beds));
    console.log("beds : ",beds);
  }, [beds,loading]);

  // Function to scroll to a specific bed and highlight it
  const [highlightedBed, setHighlightedBed] = useState<string | null>(null);
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

  // Delete Bed
  const [deleteState, setDeleteState] = useState<DeleteState>({
    deleteModalOpen: false,
    deleteLoader: false,
    bedToDelete: null,
  });

  const deleteBed = async (bedIdToRemove: string) => {
    if (!organization) return;

    setDeleteState({ ...deleteState, deleteLoader: true });
    const currentBeds = (organization.publicMetadata?.beds ||
      []) as BedInfo[];
    const updatedBeds = currentBeds.filter(
      (bed: BedInfo) => bed.bed_id !== bedIdToRemove
    );

    toast.promise(
      async () => {
        await updateOrgBedMetaData(updatedBeds).then(
          () => {
            organization.reload();
            setColumns(updatedBeds);
            setDeleteState({
              ...deleteState,
              deleteModalOpen: false,
              deleteLoader: false,
            });
          },
          (error) => {
            console.error("Error Adding New Bed:", error);
            setDeleteState({ ...deleteState, deleteLoader: false });
          }
        );
      },
      {
        loading: `Removing bed-${bedIdToRemove}...`,
        success: `Bed-${bedIdToRemove} removed`,
        error: `Error when removing bed-${bedIdToRemove}`,
      },
      {
        position: "bottom-right",
      }
    );
  };

  const DoNotAllowToDeleteBed = !!beds.find(
    (bed) => bed.bedId === deleteState.bedToDelete
  );
  return (
    <>
      {/* Bed delete dialog */}
      <Dialog
        open={deleteState.deleteModalOpen}
        onOpenChange={(state) => {
          setDeleteState({ ...deleteState, deleteModalOpen: state });
        }}
      >
        <DialogContent showCloseBtn={false} className="pt-3 pb-5 px-5">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <p className="flex flex-1 text-left">Delete Bed</p>
              <DialogClose type="button" asChild>
                <Button type="button" variant="link" size={"icon"}>
                  <X />
                </Button>
              </DialogClose>
            </DialogTitle>
            <DialogDescription hidden />
          </DialogHeader>

          <div className="flex items-center gap-3 p-3 bg-red-500/20 rounded-lg border border-red-800">
            <Bed className="h-5 w-5 shrink-0 text-red-600" />
            <div>
              <p className="font-medium text-red-600">
                Bed - {deleteState.bedToDelete}
              </p>
            </div>
          </div>

          {DoNotAllowToDeleteBed ? (
            <div className="space-y-3">
              <div className="p-3 bg-yellow-500/20 rounded-lg border border-yellow-800 flex flex-row gap-3 items-start">
                <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600" />
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-yellow-600 leading-tight">
                    Warning: Bed Occupied
                  </p>
                  <p className="text-sm text-yellow-600 leading-none">
                    This bed is currently assigned to a patient.
                  </p>
                </div>
              </div>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Reason:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>
                    This bed is either occupied or scheduled for a patient.
                  </li>
                  <li>Please make the bed available before deletion.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-muted-foreground leading-normal font-semibold">
                Are you sure you want to delete this bed ?
              </p>

              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> The bed is currently unoccupied and can
                be safely deleted.
              </p>

              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>What happens next:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>The bed will be permanently deleted.</li>
                  <li>This action cannot be undone.</li>
                </ul>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <DialogClose type="button" asChild>
              <Button type="button" variant="outline" className="flex-1">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (deleteState.bedToDelete) {
                  deleteBed(deleteState.bedToDelete);
                }
              }}
              className="flex-1"
              disabled={DoNotAllowToDeleteBed || deleteState.deleteLoader}
            >
              Delete Bed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bed Navigation Header */}
      <BedNavigationHeader
        beds={columns}
        patients={beds}
        onBedClick={scrollToBed}
      />

      <div className="w-[calc(100%-10px)] sm:w-[calc(100%-40px)] max-w-7xl mt-4 justify-self-center">
        <Button
          className="w-full border"
          type="submit"
          variant="secondary"
          onClick={addNewBedHandler}
        >
          {bedAddLoader ? (
            <Loader />
          ) : (
            <>
              <PlusCircleIcon /> Add New Bed
            </>
          )}
        </Button>
      </div>

      <div className="w-full min-h-[calc(100%-5rem)] flex flex-col max-w-[2000px] justify-self-center">
        {loading || !isLoaded ? (
          <div className="grid gap-3 px-1 sm:px-3 pb-16 pt-4 grid-cols-[repeat(auto-fit,minmax(250px,350px))] sm:grid-cols-[repeat(auto-fit,minmax(350px,350px))] justify-center">
            {[...Array(10)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-[500px] max-h-[500px] rounded-md bg-primary-foreground"
              />
            ))}
          </div>
        ) : columns.length === 0 ? (
          <div className="flex flex-1 flex-col gap-4 justify-center items-center h-full min-h-96 py-5 px-2">
            <img className="w-full max-w-[16rem]" src="/empty.svg" alt="" />
            <p className="text-center text-muted-foreground">
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
            <BoardContainer>
              <SortableContext items={columnsId}>
                {columns.map((col) => (
                  <BoardColumn
                    key={col.bed_id}
                    column={col}
                    tasks={tasks.filter((task) => task.bedId === col.bed_id)}
                    setIsEditModalOpen={setIsEditModalOpen}
                    openAddModal={openAddModal}
                    openEditModal={openEditModal}
                    bedPatients={bedPatients}
                    setDeleteState={setDeleteState}
                    isHighlighted={highlightedBed === col.bed_id}
                  />
                ))}
              </SortableContext>
            </BoardContainer>

            {"document" in window &&
              createPortal(
                <DragOverlay>
                  {activeTask && (
                    <TaskCard
                      task={activeTask}
                      bedPatientData={bedPatients[activeTask.patient_id]}
                      setIsEditModalOpen={setIsEditModalOpen}
                      openEditModal={openEditModal}
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
      setPrevTaskState({ ...data.task });
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveTask(null);

    const { active, over } = event;
    if (!over || !hasDraggableData(active)) return;

    const activeData = active.data.current;

    // ✅ Handle task being dropped into new column
    if (activeData?.type === "Task") {
      const task = activeData.task;
      const oldColumnId = pickedUpTaskColumn.current;
      const newColumnId = over.data.current?.task?.bedId || over.id;

      if (oldColumnId === newColumnId) {
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
