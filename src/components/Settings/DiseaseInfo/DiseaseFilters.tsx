import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, SearchIcon } from "lucide-react";
import {
  Disease,
  FilterCriteria,
} from "@/app/dashboard/settings/diseaseinfo/page";

interface AdvancedFiltersProps {
  diseases: Disease[];
  filters: FilterCriteria;
  onFiltersChange: (filters: FilterCriteria) => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  diseases,
  filters,
  onFiltersChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterCriteria>(filters);

  // Get all unique medicines for filtering
  const allMedicines = Array.from(
    new Set(diseases.flatMap((disease) => disease.medicines))
  ).sort();

  // Apply filters
  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsOpen(false);
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters: FilterCriteria = {
      searchTerm: "",
      medicineCountMin: null,
      medicineCountMax: null,
      specificMedicines: [],
      sortBy: "name",
      sortOrder: "asc",
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  // Count active filters
  const activeFiltersCount = [
    localFilters.searchTerm,
    localFilters.medicineCountMin !== null,
    localFilters.medicineCountMax !== null,
    localFilters.specificMedicines.length > 0,
    localFilters.sortBy !== "name" || localFilters.sortOrder !== "asc",
  ].filter(Boolean).length;

  // Handle medicine selection
  const toggleMedicine = (medicine: string) => {
    const newMedicines = localFilters.specificMedicines.includes(medicine)
      ? localFilters.specificMedicines.filter((m) => m !== medicine)
      : [...localFilters.specificMedicines, medicine];

    setLocalFilters((prev) => ({
      ...prev,
      specificMedicines: newMedicines,
    }));
  };

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Search Input */}
      <div className="relative flex-1">
        <Input
          startIcon={SearchIcon}
          placeholder="Search diseases..."
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
        />
      </div>

      {/* Advanced Filters Popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <SlidersHorizontal className="h-4 w-4" />
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
            {/* Medicine Count Range */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Medicine Count</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={localFilters.medicineCountMin ?? ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      medicineCountMin: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    }))
                  }
                  className="w-full"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={localFilters.medicineCountMax ?? ""}
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      medicineCountMax: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    }))
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Specific Medicines */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Contains Medicines ({allMedicines.length})
              </Label>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {allMedicines.map((medicine) => (
                  <div key={medicine} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`medicine-${medicine}`}
                      checked={localFilters.specificMedicines.includes(
                        medicine
                      )}
                      onChange={() => toggleMedicine(medicine)}
                      className="rounded"
                    />
                    <label
                      htmlFor={`medicine-${medicine}`}
                      className="text-sm cursor-pointer truncate"
                    >
                      {medicine}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Sorting */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sort By</Label>
              <div className="flex gap-2">
                <Select
                  value={localFilters.sortBy}
                  onValueChange={(value: "name" | "medicineCount") =>
                    setLocalFilters((prev) => ({ ...prev, sortBy: value }))
                  }
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="medicineCount">
                      Medicine Count
                    </SelectItem>
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

            {/* Apply Button */}
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
export const applyDiseaseFilters = (
  diseases: Disease[],
  filters: FilterCriteria
): Disease[] => {
  let filtered = [...diseases];

  // Search term filter
  if (filters.searchTerm) {
    filtered = filtered.filter(
      (disease) =>
        disease.diseaseDetail
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase()) ||
        disease.medicines.some((medicine) =>
          medicine.toLowerCase().includes(filters.searchTerm.toLowerCase())
        )
    );
  }

  // Medicine count filters
  if (filters.medicineCountMin !== null) {
    filtered = filtered.filter(
      (disease) => disease.medicines.length >= filters.medicineCountMin!
    );
  }
  if (filters.medicineCountMax !== null) {
    filtered = filtered.filter(
      (disease) => disease.medicines.length <= filters.medicineCountMax!
    );
  }

  // Specific medicines filter
  if (filters.specificMedicines.length > 0) {
    filtered = filtered.filter((disease) =>
      filters.specificMedicines.every((medicine) =>
        disease.medicines.includes(medicine)
      )
    );
  }

  // Sorting
  filtered.sort((a, b) => {
    let comparison = 0;

    switch (filters.sortBy) {
      case "name":
        comparison = a.diseaseDetail.localeCompare(b.diseaseDetail);
        break;
      case "medicineCount":
        comparison = a.medicines.length - b.medicines.length;
        break;
    }

    return filters.sortOrder === "desc" ? -comparison : comparison;
  });

  return filtered;
};
