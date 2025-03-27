import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { db } from "@/firebase/firebaseConfig";
import { Button } from "@/components/ui/button";
import { doc, updateDoc } from "firebase/firestore";
import Loader from "../common/Loader";
import { ArrowLeftRight } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { ScheduledPatientTypes } from "@/types/FormTypes";
import { getTime, startOfDay } from "date-fns";

interface UserSchedulebtnProps {
  patient: ScheduledPatientTypes;
  matchingDate: Date;
}

const UserSchedulebtn: React.FC<UserSchedulebtnProps> = ({
  patient,
  matchingDate,
}) => {
  const [loader, setLoader] = useState(false);
  const { orgId } = useAuth();

  const rescheduleFn = async () => {
    if (orgId && matchingDate) {
      setLoader(true);
      await updateDoc(
        doc(db, "doctor", orgId, "patients", patient.patient_id),
        {
          registered_date: patient.registered_date.map((date) =>
            new Date(date).toDateString() === matchingDate.toDateString()
              ? getTime(startOfDay(new Date()))
              : date
          ),
          registered_date_time: patient.registered_date_time.map((date_time) =>
            getTime(startOfDay(date_time)) === getTime(startOfDay(matchingDate))
              ? getTime(new Date())
              : date_time
          ),
        }
      );
      setLoader(false);
    }
  };
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Button
          onClick={rescheduleFn}
          variant="outline"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted border rounded-full"
        >
          {loader ? <Loader size="small" /> : <ArrowLeftRight />}
          <span className="sr-only">Schedule Now</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Schedule Now</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default UserSchedulebtn;
