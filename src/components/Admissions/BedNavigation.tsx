import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, User } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BedInfo, BedPatientTypes, OrgBed } from "@/types/FormTypes";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { getOverdueClashes } from "./utils";

const BedNavigationHeader = ({
  beds,
  patients,
  onBedClick,
  onWarningClick,
  bedPatients
}: {
  beds: BedInfo[];
  patients: OrgBed[];
  onBedClick: (bedId: string) => void;
  onWarningClick: (bookingId: string)=> void;
  bedPatients: Record<string, BedPatientTypes>;
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

  const [clashMap, setClashMap] = useState(() => getOverdueClashes(patients));

  useEffect(() => {
    setClashMap(getOverdueClashes(patients));
    const interval = setInterval(() => {
      setClashMap(getOverdueClashes(patients));
    }, 60_000);

    return () => clearInterval(interval);
  }, [patients]);

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
                {Object.keys(clashMap).length > 0 && (
                  <Badge className="hover:shadow-md bg-yellow-500/20 text-yellow-600  hover:bg-yellow-500/40">
                    {Object.keys(clashMap).length} warning
                  </Badge>
                )}
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
                {Object.entries(clashMap).map(
                  ([overdueId, clashingIds], index) => {
                    return (
                      <Popover key={index}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onWarningClick(overdueId)}
                            className="relative h-12 flex flex-col items-center justify-center gap-1 text-xs transition-all duration-200 hover:shadow-md bg-yellow-500/20 text-yellow-700 hover:text-yellow-900 hover:bg-yellow-400/40"
                          >
                            <User className="h-3 w-3" />
                            <span className="font-medium">{bedPatients[overdueId].name}</span>
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="mt-2 p-0 w-[340px] sm:w-[420px] rounded-xl shadow-lg border border-red-300">
                          <Card className="bg-primary-foreground">
                            <div className="p-4 border-b border-red-200">
                              <h3 className="text-base font-semibold text-red-800">
                                Overdue Clash Detected
                              </h3>
                              <p className="text-sm text-red-700 mt-1">
                                The following bookings are clashing with{" "}
                                <span className="font-semibold">
                                  {overdueId}
                                </span>
                                . Please update them accordingly.
                              </p>
                            </div>

                            <CardContent className="p-4">
                              <div className="flex flex-wrap gap-2">
                                {clashingIds.map((ids, index) => (
                                  <Button
                                    key={index}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onWarningClick(ids)}
                                    className="relative h-12 flex flex-col items-center justify-center gap-1 text-xs transition-all duration-200 hover:shadow-md bg-red-200 text-red-800 hover:bg-red-300"
                                  >
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">
                                      {bedPatients[ids].name}
                                    </span>
                                  </Button>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </PopoverContent>
                      </Popover>
                    );
                  }
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default BedNavigationHeader;
