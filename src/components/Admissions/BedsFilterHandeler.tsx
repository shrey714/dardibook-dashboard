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
  SearchIcon,
  UserPlus,
  Settings2Icon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { useOrganization } from "@clerk/nextjs";
import { BedInfo } from "@/types/FormTypes";
import { Input } from "../ui/input";
import AddNewBedBtn from "./AddNewBedDialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useBedsStore } from "@/lib/stores/useBedsStore";

export function BedsFilterHandeler({
  openAddModal,
}: {
  openAddModal: (bedId: string | null) => void;
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { loading, beds } = useBedsStore((state) => state);

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
  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );
  const [open, setOpen] = useState(false);

  const handleWardSelect = (ward: string) => {
    setWardFilters(
      wardFilters.includes(ward)
        ? wardFilters.filter((w) => w !== ward).sort()
        : [...wardFilters, ward].sort()
    );
  };

  const FilterOptions = () => {
    return (
      <>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-center gap-1 px-2 w-min"
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
  };

  return (
    <>
      <div className="relative flex-1">
        <Input
          startIcon={SearchIcon}
          placeholder="Search beds or patients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="truncate"
        />
      </div>

      {isDesktop && <FilterOptions />}

      {!isDesktop && (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size={"icon"}>
              <Settings2Icon />
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>Filter Beds</DrawerTitle>
                <DrawerDescription>
                  Use the options below to filter beds by status or ward.
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-2 pb-2 min-w-64 h-min flex flex-wrap gap-4 items-center flex-col-reverse">
                <FilterOptions />
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      )}

      <Button
        variant="outline"
        onClick={() => openAddModal(null)}
        disabled={loading || beds.length === 0}
        icon={UserPlus}
        iconPlacement="right"
        className="px-2 min-w-9"
      >
        <p className="hidden lg:block">Admit Patient</p>
      </Button>
      <AddNewBedBtn />
    </>
  );
}
