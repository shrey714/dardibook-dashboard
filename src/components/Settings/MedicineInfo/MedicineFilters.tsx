import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon, SlidersHorizontal } from "lucide-react";
import {
  FilterCriteria,
  Medicine,
} from "@/app/dashboard/settings/medicineinfo/page";

interface AdvancedFiltersProps {
  medicines: Medicine[];
  filters: FilterCriteria;
  onFiltersChange: (filters: FilterCriteria) => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  medicines,
  filters,
  onFiltersChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Get unique medicine types from the data
  const availableTypes = Array.from(
    new Set(medicines.map((medicine) => medicine.type))
  ).sort();

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const defaultFilters: FilterCriteria = {
      searchTerm: "",
      medicineTypes: [],
      activeStatus: "all",
      hasInstructions: "all",
      sortBy: "name",
      sortOrder: "asc",
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const activeFiltersCount = [
    localFilters.searchTerm,
    localFilters.medicineTypes.length > 0,
    localFilters.activeStatus !== "all",
    localFilters.hasInstructions !== "all",
    localFilters.sortBy !== "name" || localFilters.sortOrder !== "asc",
  ].filter(Boolean).length;

  const toggleMedicineType = (type: string) => {
    const newTypes = localFilters.medicineTypes.includes(type)
      ? localFilters.medicineTypes.filter((t) => t !== type)
      : [...localFilters.medicineTypes, type];

    setLocalFilters((prev) => ({
      ...prev,
      medicineTypes: newTypes,
    }));
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          startIcon={SearchIcon}
          placeholder="Search medicines..."
          value={localFilters.searchTerm}
          onChange={(e) => {
            setLocalFilters((prev) => ({
              ...prev,
              searchTerm: e.target.value,
            }));
            onFiltersChange({
              ...filters,
              searchTerm: e.target.value,
            });
          }}
          className="pl-10"
        />
      </div>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="max-w-80 sm:w-80 p-0 overflow-hidden"
          align="end"
        >
          <div className="flex items-center justify-between px-4 py-2 bg-border">
            <h4 className="font-medium">Advanced Filters</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-auto p-1 text-xs"
            >
              Reset
            </Button>
          </div>

          <div className="space-y-3 px-4 pb-4 pt-2">
            {/* Medicine Types Filter */}
            <div className="space-y-2">
              <Label>Medicine Types</Label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {availableTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`type-${type}`}
                      checked={localFilters.medicineTypes.includes(type)}
                      onCheckedChange={() => toggleMedicineType(type)}
                    />
                    <Label
                      htmlFor={`type-${type}`}
                      className="text-xs cursor-pointer"
                    >
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={localFilters.activeStatus}
                onValueChange={(value: "all" | "active" | "inactive") =>
                  setLocalFilters((prev) => ({ ...prev, activeStatus: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Medicines</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Instructions Filter */}
            <div className="space-y-2">
              <Label>Instructions</Label>
              <Select
                value={localFilters.hasInstructions}
                onValueChange={(value: "all" | "with" | "without") =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    hasInstructions: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Medicines</SelectItem>
                  <SelectItem value="with">With Instructions</SelectItem>
                  <SelectItem value="without">Without Instructions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <Label>Sort By</Label>
              <div className="flex gap-2">
                <Select
                  value={localFilters.sortBy}
                  onValueChange={(value: "name" | "type" | "recent") =>
                    setLocalFilters((prev) => ({ ...prev, sortBy: value }))
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                    <SelectItem value="recent">Recently Added</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={localFilters.sortOrder}
                  onValueChange={(value: "asc" | "desc") =>
                    setLocalFilters((prev) => ({ ...prev, sortOrder: value }))
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">A-Z</SelectItem>
                    <SelectItem value="desc">Z-A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={applyFilters} className="w-full">
              Apply Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

// Filter function to be used in the main component
export const applyMedicineFilters = (
  medicines: Medicine[],
  filters: FilterCriteria
): Medicine[] => {
  let filtered = [...medicines];

  // Search term filter
  if (filters.searchTerm) {
    filtered = filtered.filter(
      (medicine) =>
        medicine.medicineName
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        medicine.type
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        medicine.instruction
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase())
    );
  }

  // Medicine types filter
  if (filters.medicineTypes.length > 0) {
    filtered = filtered.filter((medicine) =>
      filters.medicineTypes.includes(medicine.type)
    );
  }

  // Active status filter
  if (filters.activeStatus !== "all") {
    filtered = filtered.filter((medicine) =>
      filters.activeStatus === "active" ? medicine.active : !medicine.active
    );
  }

  // Instructions filter
  if (filters.hasInstructions !== "all") {
    filtered = filtered.filter((medicine) => {
      const hasInstructions =
        medicine.instruction && medicine.instruction.trim().length > 0;
      return filters.hasInstructions === "with"
        ? hasInstructions
        : !hasInstructions;
    });
  }

  // Sorting
  filtered.sort((a, b) => {
    let comparison = 0;

    switch (filters.sortBy) {
      case "name":
        comparison = a.medicineName.localeCompare(b.medicineName);
        break;
      case "type":
        comparison = a.type.localeCompare(b.type);
        break;
      case "recent":
        comparison = a.id.localeCompare(b.id);
        break;
    }

    return filters.sortOrder === "desc" ? -comparison : comparison;
  });

  return filtered;
};
