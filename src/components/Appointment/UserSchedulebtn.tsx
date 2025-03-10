import React, { useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { db } from "@/firebase/firebaseConfig";
import { Button } from "@/components/ui/button";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import Loader from "../common/Loader";
import { ArrowLeftRight } from "lucide-react";
import { useAuth } from "@clerk/nextjs";

const UserSchedulebtn = ({ patient }: any) => {
  const [loader, setLoader] = useState(false);
  const { orgId } = useAuth();

  const rescheduleFn = async () => {
    if (orgId) {
      setLoader(true);
      await updateDoc(
        doc(db, "doctor", orgId, "patients", patient.patient_unique_Id),
        { last_visited: Timestamp.fromMillis(new Date().getTime()) }
      );
      setLoader(false);
    }
  };

  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Button
          onClick={rescheduleFn}
          disabled={patient.attended}
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
