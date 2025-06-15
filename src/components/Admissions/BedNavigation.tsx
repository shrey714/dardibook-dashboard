import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BedInfo, OrgBed } from "@/types/FormTypes";

const BedNavigationHeader = ({
  beds,
  patients,
  onBedClick,
}: {
  beds: BedInfo[];
  patients: OrgBed[];
  onBedClick: (bedId: string) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const accordionRef = useRef<HTMLDivElement>(null);
  const handleBedClick = (bedId: string) => {
    onBedClick(bedId);
  };

  const getBedStatus = (bed: (typeof beds)[0]) => {
    const assignedPatient = patients.find((p) => p.bedId === bed.bed_id);
    return assignedPatient ? "occupied" : "available";
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        accordionRef.current &&
        !accordionRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getStatusColor = (status: string) => {
    return status === "occupied"
      ? "bg-red-500/20 text-red-600 hover:text-primary hover:bg-red-500/40"
      : "bg-green-500/20 text-green-600 hover:text-primary hover:bg-green-500/40";
  };

  return (
    <Card
      ref={accordionRef}
      className="sticky top-0 z-[1] shadow-lg rounded-none bg-muted rounded-b-xl w-[calc(100%-10px)] sm:w-[calc(100%-40px)] max-w-7xl border-t-0 justify-self-center"
    >
      <CardContent className="p-0">
        <Accordion
          value={isExpanded ? "nav-header" : ""}
          onValueChange={(val) => setIsExpanded(val === "nav-header")}
          type="single"
          collapsible
          className="w-full"
        >
          <AccordionItem value="nav-header" className="border-b-0">
            <AccordionTrigger className="hover:no-underline px-4 py-3">
              <div className="flex items-center gap-2">
                <Badge variant="default">{beds.length} beds</Badge>
                <Badge variant="failure">
                  {
                    beds.filter((bed) =>
                      patients.find((patient) => patient.bedId === bed.bed_id)
                    ).length
                  }{" "}
                  Occupied
                </Badge>
                <Badge variant="success">
                  {beds.length -
                    beds.filter((bed) =>
                      patients.find((patient) => patient.bedId === bed.bed_id)
                    ).length}{" "}
                  Available
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0">
              {beds.length === 0 && (
                <p className="w-full text-center text-muted-foreground text-sm leading-none">
                  No beds found. Please add beds to get started.
                </p>
              )}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 p-2">
                {beds.map((bed, index) => {
                  const status = getBedStatus(bed);
                  return (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBedClick(bed.bed_id)}
                      className={`
                    relative h-12 flex flex-col items-center justify-center gap-1 p-1 text-xs transition-all duration-200 hover:shadow-md ${getStatusColor(
                      status
                    )}
                  `}
                    >
                      <Bed className="h-3 w-3" />
                      <span className="font-medium">{bed.bed_id}</span>
                    </Button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default BedNavigationHeader;
