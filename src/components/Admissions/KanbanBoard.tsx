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
  KeyboardSensor,
  Announcements,
  UniqueIdentifier,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { TaskCard } from "./TaskCard";
import { hasDraggableData } from "./utils";
import { coordinateGetter } from "./multipleContainersKeyboardPreset";
import { db } from "@/firebase/firebaseConfig";
import { BedInfo, OrgBed } from "@/types/FormTypes";
import { useUser, useAuth, useOrganization } from "@clerk/nextjs";
import { doc, writeBatch } from "firebase/firestore";
import { useBedsStore } from "@/lib/stores/useBedsStore";
import { getTime } from "date-fns";
import toast from "react-hot-toast";
import { updateOrgMetadata } from "@/app/dashboard/settings/clinic/_actions";
import Loader from "../common/Loader";

export type ColumnId = string;

export const KanbanBoard = ({
  setIsModalOpen,
  openAddModal,
  openEditModal,
  setIsEditModalOpen,
  refresh
}: any) => {
  const { organization, isLoaded } = useOrganization();
  const { beds, bedPatients, loading } = useBedsStore((state) => state);
  const [columns, setColumns] = useState<BedInfo[]>([]);
  const pickedUpTaskColumn = useRef<ColumnId | null>(null);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [tasks, setTasks] = useState<OrgBed[]>([]);
  const [activeColumn, setActiveColumn] = useState<BedInfo | null>(null);
  const [activeTask, setActiveTask] = useState<OrgBed | null>(null);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    })
  );

  useEffect(() => {
    console.log("isloaded : ",isLoaded)
    const fetchBedMetaData = () => {
      console.log("fetching again")
      if (organization && organization.publicMetadata) {
        const bedMetaData: BedInfo[] =
          (organization.publicMetadata?.bedMetaData as BedInfo[]) || [];
          console.log(bedMetaData)
        setColumns(bedMetaData);
      }
    };

    if (isLoaded && organization) {
      fetchBedMetaData();
      // setTasks(beds);
    }
  }, [isLoaded, organization,refresh]);

  useEffect(() => {
    if(!loading)
      setTasks(beds);
  }, [beds,bedPatients,loading]);

  function getDraggingTaskData(taskId: UniqueIdentifier, columnId: ColumnId) {
    const tasksInColumn = tasks.filter((task) => task.bedId === columnId);
    const taskPosition = tasksInColumn.findIndex(
      (task) => task.bedBookingId === taskId
    );
    const column = columns.find((col) => col.id === columnId);
    return {
      tasksInColumn,
      taskPosition,
      column,
    };
  }

  const deleteBed = async (bedIdToRemove: string) => {
    if (!organization) return;
    try {
      console.log(bedIdToRemove);
      const currentBeds = (organization.publicMetadata?.bedMetaData ||
        []) as BedInfo[];

      const updatedBeds = currentBeds.filter(
        (bed: BedInfo) => bed.id !== bedIdToRemove
      );

      const data = await updateOrgMetadata({ bedMetaData: updatedBeds });
      organization.reload();
      setColumns(updatedBeds)
      // setRefresh((prev)=>!prev);

      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error("Error in deleting bed");
    }
  };

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === "Column") {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.id} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      } else if (active.data.current?.type === "Task") {
        pickedUpTaskColumn.current = active.data.current.task.bedId;
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id,
          pickedUpTaskColumn.current
        );
        return `Picked up Task ${
          active.data.current.task.patient_id
        } at position: ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.id}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.id} was moved over ${
          over.data.current.column.id
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.bedId
        );
        if (over.data.current.task.bedId !== pickedUpTaskColumn.current) {
          return `Task ${
            active.data.current.task.patient_id
          } was moved over column ${column?.id} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was moved over position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.id}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === "Column" &&
        over.data.current?.type === "Column"
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${
          active.data.current.column.id
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      } else if (
        active.data.current?.type === "Task" &&
        over.data.current?.type === "Task"
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id,
          over.data.current.task.bedId
        );
        if (over.data.current.task.bedId !== pickedUpTaskColumn.current) {
          return `Task was dropped into column ${column?.id} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was dropped into position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.id}`;
      }
      pickedUpTaskColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  return (
    <>
      {columns.length==0?<div className="flex justify-center items-center h-full">No Beds are adeed</div>:<DndContext
      accessibility={{
        announcements,
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <BoardContainer>
        <SortableContext items={columnsId}>
          {columns.map((col) => (
            <BoardColumn
              key={col.id}
              column={col}
              tasks={tasks.filter((task) => task.bedId === col.id)}
              setIsModalOpen={setIsModalOpen}
              setIsEditModalOpen={setIsEditModalOpen}
              openAddModal={openAddModal}
              openEditModal={openEditModal}
              bedPatients={bedPatients}
              deleteBed={deleteBed}
            />
          ))}
        </SortableContext>
      </BoardContainer>

      {"document" in window &&
        createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                isOverlay
                column={activeColumn}
                tasks={tasks.filter((task) => task.bedId === activeColumn.id)}
                setIsModalOpen={setIsModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                openAddModal={openAddModal}
                openEditModal={openEditModal}
                bedPatients={bedPatients}
                deleteBed={deleteBed}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                isOverlay
                bedPatientData={bedPatients[activeTask.patient_id]}
                setIsEditModalOpen={setIsEditModalOpen}
                openEditModal={openEditModal}
              />
            )}
          </DragOverlay>,
          document.body
        )}
    </DndContext>}
    </>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === "Column") {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === "Task") {
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === "Column";
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
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
