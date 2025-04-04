import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import PatientList from "./PatientList";
import { BadgeMinusIcon, BadgePlus, BadgePlusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { BedInfo, OrgBed } from "@/types/FormTypes";


interface BedProps {
  bedInfo: BedInfo;
  admissionInfo: OrgBed[];
}

const Bed: React.FC<BedProps> = ({bedInfo,admissionInfo})=> {
  return (
    <div className="p-2">
      <Card>
        <CardHeader className="p-4">
          <Card>
            <CardHeader className="p-1">
              <CardTitle className="text-center">{bedInfo.id}</CardTitle>
              <CardContent className="p-2">
                <p className="flex justify-around items-center">
                  Admit Patient
                  <Button className="" variant="outline" size="sm">
                    <BadgePlusIcon />
                  </Button>
                </p>
              </CardContent>
            </CardHeader>
          </Card>
          <CardContent className="p-0 h-72 overflow-auto flex gap-2 flex-col">
            {
              admissionInfo.length>0?admissionInfo.map((admissionInfo,index)=>(<PatientList />)):<>noadmission</>
            }
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
}

export default Bed;
