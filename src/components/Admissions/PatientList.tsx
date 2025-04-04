import React from "react";
import { BadgeMinusIcon, LogIn, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { format } from "date-fns";

function PatientList() {
  return (
    <div className="container flex justify-between rounded-md border px-1 py-2 font-mono text-sm shadow-sm">
      <div>
      <p className="text-sm flex-[5]">Jeet Oza</p>
      <div className="flex flex-[5] flex-wrap md:gap-2">
        <p className="text-xs flex gap-1">
          <LogIn size={14} />
          {format(new Date(), "dd/MM HH:mm")}
        </p>
        <p className="text-xs flex gap-1">
          <LogOut size={14} />
          {format(new Date(), "dd/MM HH:mm")}
        </p>
      </div>
      </div>
      <Button className="" variant="outline" size="sm">
        <BadgeMinusIcon />
      </Button>
      
    </div>
  );
}

export default PatientList;
