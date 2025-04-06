import type { UniqueIdentifier } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import {
  BadgeMinusIcon,
  BedSingle,
  CircleX,
  GripVertical,
  LogIn,
  LogOut,
} from "lucide-react";
import { ColumnId } from "./KanbanBoard";
import { format, getTime } from "date-fns";
import { BedPatientTypes, OrgBed } from "@/types/FormTypes";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { db } from "@/firebase/firebaseConfig";
import { writeBatch, doc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/clerk-react";
import Loader from "../common/Loader";

export interface Task {
  id: UniqueIdentifier;
  columnId: ColumnId;
  content: string;
}

interface TaskCardProps {
  task: OrgBed;
  isOverlay?: boolean;
  bedPatientData: BedPatientTypes;
  setIsEditModalOpen:any;
  setbookingId:any;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: OrgBed;
  bedPatientData: BedPatientTypes;
  setIsEditModalOpen:any;
  setbookingId:any;
}

export function TaskCard({
  task,
  isOverlay,
  bedPatientData,
  setIsEditModalOpen,
  setbookingId
}: TaskCardProps) {
  const [dischargeLoader, setDischargeLoader] = useState(false);
  const {user} = useUser();
  const {orgId} = useAuth();
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
      setbookingId
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  useEffect(()=>{
      setbookingId(task.bedBookingId);
    },[])

  const dischargePatient = async (bedData: OrgBed) => {
      setDischargeLoader(true);
      if (!orgId || !user) return;
  
      try {
        const batch = writeBatch(db);
  
        const bedRef = doc(db, "doctor", orgId, "beds", bedData.bedBookingId);
        batch.update(bedRef, {
          dischargeMarked: true,
          discharge_at:
            bedData.discharge_at < getTime(new Date())
              ? bedData.discharge_at
              : getTime(new Date()),
          discharged_by: {
            id: user.id,
            name: user.fullName,
            email: user.primaryEmailAddress?.emailAddress,
          },
        });
  
        const patientRef = doc(
          db,
          "doctor",
          orgId,
          "patients",
          bedPatientData.patient_id
        );
        const updatedBedInfo = bedPatientData.bed_info.map((patient_bed) =>
          patient_bed.bedBookingId === bedData.bedBookingId
            ? {
                ...patient_bed,
                dischargeMarked: true,
                discharge_at:
                  bedData.discharge_at < getTime(new Date())
                    ? bedData.discharge_at
                    : getTime(new Date()),
                discharged_by: {
                  id: user.id,
                  name: user.fullName,
                  email: user.primaryEmailAddress?.emailAddress,
                },
              }
            : patient_bed
        );
  
        batch.update(patientRef, { bed_info: updatedBedInfo });
  
        await batch.commit();
      } catch (error) {
        void error;
        console.log(error)
        toast.error("Error discharging");
      } finally {
        setDischargeLoader(false);
      }
    };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`container flex justify-between rounded-md border px-1 py-2 font-mono text-sm shadow-sm ${variants(
        {
          dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
        }
      )}`}
    >
      <Button
        variant={"ghost"}
        {...attributes}
        {...listeners}
        className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
      >
        <span className="sr-only">Move task</span>
        <GripVertical />
      </Button>
      <div>
        <p className="text-sm flex-[5]">{bedPatientData.name}</p>
        <div className="flex flex-[5] flex-wrap md:gap-2">
          <p className="text-xs flex gap-1">
            <LogIn size={14} />
            {format(new Date(task.admission_at), "dd/MM HH:mm")}
          </p>
          <p className="text-xs flex gap-1">
            <LogOut size={14} />
            {format(new Date(task.discharge_at), "dd/MM HH:mm")}
          </p>
        </div>
      </div>
          <Button
            className=""
            variant="outline"
            size="sm"
            onClick={() => {
              setIsEditModalOpen(true);
              // dischargePatient(task);
            }}
          >
            {dischargeLoader?<Loader size="small" />:<BadgeMinusIcon />}
          </Button>
    </div>
  );
}
