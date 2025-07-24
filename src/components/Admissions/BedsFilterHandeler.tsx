import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  BanIcon,
  BedDoubleIcon,
  MapPinIcon,
  TriangleAlertIcon,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { useOrganization } from "@clerk/nextjs";
import { BedInfo } from "@/types/FormTypes";

export function BedsFilterHandeler() {
  const [bedFilters, setBedFilters] = useQueryState(
    "bedFilters",
    parseAsArrayOf(parseAsString).withDefault([
      "available",
      "occupied",
      "warning",
    ])
  );

  const { organization, isLoaded } = useOrganization();

  const wards = useMemo(() => {
    return isLoaded && organization && organization.publicMetadata
      ? [
          ...new Set(
            (organization.publicMetadata?.beds as BedInfo[]).map(
              (bed) => bed.ward
            )
          ),
        ].sort()
      : [];
  }, [isLoaded, organization]);

  const [wardFilters, setWardFilters] = useQueryState(
    "wardFilters",
    parseAsArrayOf(parseAsString).withDefault(wards)
  );

  const [open, setOpen] = useState(false);

  const handleWardSelect = (ward: string) => {
    setWardFilters(
      wardFilters.includes(ward)
        ? wardFilters.filter((w) => w !== ward).sort()
        : [...wardFilters, ward].sort()
    );
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-min justify-between gap-1 px-2"
          >
            <MapPinIcon className="h-4 w-4" />
            {wardFilters.length > 0
              ? `${wardFilters.length} selected`
              : "Select wards"}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0">
          <Command>
            <CommandInput placeholder="Search wards..." />
            <CommandEmpty>No ward found.</CommandEmpty>
            <CommandGroup>
              {wards.map((ward, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleWardSelect(ward)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      wardFilters.includes(ward) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {ward}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <ToggleGroup
        variant="outline"
        type="multiple"
        value={bedFilters}
        onValueChange={(val) => {
          setBedFilters(val.sort());
        }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ToggleGroupItem
                className="data-[state=on]:bg-red-500/20 data-[state=on]:text-red-600 data-[state=on]:border-red-600"
                value="occupied"
                aria-label="Occupied Beds"
              >
                <BanIcon />
              </ToggleGroupItem>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Filter Occupied Beds</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ToggleGroupItem
                className="data-[state=on]:bg-green-500/20 data-[state=on]:text-green-600 data-[state=on]:border-green-600"
                value="available"
                aria-label="Available Beds"
              >
                <BedDoubleIcon />
              </ToggleGroupItem>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Filter Available Beds</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ToggleGroupItem
                className="data-[state=on]:bg-yellow-500/20 data-[state=on]:text-yellow-600 data-[state=on]:border-yellow-600"
                value="warning"
                aria-label="Bed Warnings"
              >
                <TriangleAlertIcon />
              </ToggleGroupItem>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Filter Warnings Beds</p>
          </TooltipContent>
        </Tooltip>
      </ToggleGroup>
    </>
  );
}
