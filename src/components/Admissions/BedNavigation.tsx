import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bed, User } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BedInfo, BedPatientTypes, OrgBed } from "@/types/FormTypes";
import { getOverdueClashes } from "./utils";
import { BedsFilterHandeler } from "./BedsFilterHandeler";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const getStatusColor = (status: string) => {
  return status === "warning"
    ? "bg-yellow-500/20 text-yellow-600 hover:text-accent-foreground hover:bg-yellow-400/40"
    : status === "occupied"
    ? "bg-red-500/20 text-red-600 hover:text-accent-foreground hover:bg-red-500/40"
    : "bg-green-500/20 text-green-600 hover:text-accent-foreground hover:bg-green-500/40";
};

const BedNavigationHeader = ({
  beds,
  patients,
  onBedClick,
  onWarningClick,
  bedPatients,
  openAddModal,
}: {
  beds: BedInfo[];
  patients: OrgBed[];
  onBedClick: (bedId: string) => void;
  onWarningClick: (bookingId: string) => void;
  bedPatients: Record<string, BedPatientTypes>;
  openAddModal: (bedId: string | null) => void;
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

  const groupBedsByWard = beds.reduce<Record<string, BedInfo[]>>((acc, bed) => {
    if (!acc[bed.ward]) {
      acc[bed.ward] = [];
    }
    acc[bed.ward].push(bed);
    return acc;
  }, {});

  return (
    <Card
      ref={accordionRef}
      className="sticky top-0 py-0 gap-0 z-[1] shadow-lg rounded-none overflow-hidden rounded-b-xl w-[calc(100%-10px)] sm:w-[calc(100%-40px)] max-w-7xl border-t-0 justify-self-center"
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
            <AccordionTrigger className="hover:no-underline px-4 py-2.5">
              <div className="flex flex-1 items-center">
                <Badge
                  className="shadow-none text-sm font-medium border-0 rounded-r-none"
                  variant="default"
                >
                  {beds.length} <p className="ml-1 hidden sm:block">beds</p>
                </Badge>
                <Badge
                  className="shadow-none text-sm font-medium border-0 rounded-none"
                  variant="failure"
                >
                  {
                    beds.filter((bed) =>
                      patients.find((patient) => patient.bedId === bed.bed_id)
                    ).length
                  }
                  <p className="ml-1 hidden sm:block">Occupied</p>
                </Badge>
                <Badge
                  className="shadow-none text-sm font-medium border-0 rounded-l-none"
                  variant="success"
                >
                  {beds.length -
                    beds.filter((bed) =>
                      patients.find((patient) => patient.bedId === bed.bed_id)
                    ).length}
                  <p className="ml-1 hidden sm:block">Available</p>
                </Badge>
                {Object.keys(clashMap).length > 0 && (
                  <Badge className="shadow-none text-sm font-medium border-0 bg-yellow-500/10 text-yellow-600  hover:bg-yellow-500/20 ml-2">
                    {Object.keys(clashMap).length}
                    <p className="ml-1 hidden sm:block">warning</p>
                  </Badge>
                )}
              </div>
              <p className="mr-2 text-[10px] sm:text-xs text-muted-foreground">
                Navigation
              </p>
            </AccordionTrigger>
            <AccordionContent className="pb-0 max-h-[440px] overflow-y-auto">
              {beds.length === 0 && (
                <p className="w-full text-center text-muted-foreground text-sm leading-none py-5">
                  No beds found. Please add beds to get started.
                </p>
              )}
              {Object.entries(groupBedsByWard).map(([wardName, bedsInWard]) => (
                <div key={wardName}>
                  <h3 className="text-sm py-1 px-2 bg-muted/50 text-muted-foreground leading-none">
                    {wardName}
                  </h3>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 p-2">
                    {bedsInWard.map((bed, index) => {
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
                </div>
              ))}

              {Object.entries(clashMap).length > 0 && (
                <h3 className="text-sm py-1 px-2 bg-yellow-500/20 text-yellow-600 leading-none">
                  Warnings
                </h3>
              )}
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 p-2 empty:p-0">
                {Object.entries(clashMap).map(
                  ([overdueId, clashingIds], index) => {
                    return (
                      <Popover key={index}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onWarningClick(overdueId)}
                            className={`relative h-12 flex flex-col items-center justify-center gap-1 text-xs transition-all duration-200 hover:shadow-md ${getStatusColor(
                              "warning"
                            )}`}
                          >
                            <User className="h-3 w-3" />
                            <span className="font-medium">
                              {bedPatients[overdueId].name}
                            </span>
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="mt-2 p-0 w-[340px] sm:w-[420px] bg-card rounded-lg">
                          <div className="p-3">
                            <div className="p-3 bg-yellow-500/20 rounded-lg border border-yellow-800 flex flex-row gap-3 items-start">
                              <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-600" />
                              <div className="flex flex-col gap-1">
                                <p className="font-medium text-yellow-600 leading-tight">
                                  Overdue Clash Detected
                                </p>
                                <p className="text-sm text-yellow-600 leading-tight">
                                  The following bookings are clashing with{" "}
                                  <span className="font-semibold underline">
                                    {bedPatients[overdueId].name}
                                  </span>
                                  . Please update them accordingly.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 border-t p-2">
                            {clashingIds.map((ids, index) => (
                              <Button
                                key={index}
                                variant="ghost"
                                size="sm"
                                onClick={() => onWarningClick(ids)}
                                className={`relative h-12 flex flex-col gap-1 items-center justify-center ${getStatusColor(
                                  "occupied"
                                )}`}
                              >
                                <User className="h-4 w-4" />
                                <span className="font-medium">
                                  {bedPatients[ids].name}
                                </span>
                              </Button>
                            ))}
                          </div>
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
      <CardFooter className="flex-row p-2.5 gap-2 border-t justify-end">
        <BedsFilterHandeler openAddModal={openAddModal} />
      </CardFooter>
    </Card>
  );
};

export default BedNavigationHeader;
