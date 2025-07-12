import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import { Disease } from "@/app/dashboard/settings/diseaseinfo/page";
import { downloadCSV, exportDiseasesToCSV } from "@/lib/csv-utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BulkOperationsProps {
  diseases: Disease[];
  selectedDiseases: Set<string>;
  onSelectionChange: (selected: Set<string>) => void;
  onBulkDelete: (diseaseIds: string[]) => Promise<void>;
}

export const BulkOperations: React.FC<BulkOperationsProps> = ({
  diseases,
  selectedDiseases,
  onSelectionChange,
  onBulkDelete,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const selectedCount = selectedDiseases.size;
  const allSelected =
    diseases.length > 0 && selectedDiseases.size === diseases.length;
  const someSelected =
    selectedDiseases.size > 0 && selectedDiseases.size < diseases.length;

  // Toggle all selection
  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(diseases.map((d) => d.diseaseId)));
    }
  };

  // Export selected diseases
  const handleExportSelected = () => {
    const selectedDiseasesData = diseases.filter((d) =>
      selectedDiseases.has(d.diseaseId)
    );

    if (selectedDiseasesData.length === 0) {
      toast.error("No diseases selected for export");
      return;
    }

    try {
      const csvContent = exportDiseasesToCSV(selectedDiseasesData);
      const filename = `selected-diseases-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      downloadCSV(csvContent, filename);

      toast.success(
        `Exported ${selectedDiseasesData.length} selected diseases`
      );
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export selected diseases");
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await onBulkDelete(Array.from(selectedDiseases));
      onSelectionChange(new Set());
      setDeleteDialogOpen(false);
      toast.success(`Deleted ${selectedCount} diseases`);
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast.error("Failed to delete selected diseases");
    } finally {
      setIsDeleting(false);
    }
  };

  if (diseases.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between px-3 bg-muted/50 rounded-lg border min-h-12">
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={
                allSelected ? true : someSelected ? "indeterminate" : false
              }
              onCheckedChange={handleSelectAll}
              aria-label="Select all diseases"
            />
            <span className="text-sm font-medium">
              {selectedCount > 0 ? `${selectedCount} selected` : "Select all"}
            </span>
          </div>
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportSelected}>
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Selected Diseases</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedCount} selected disease
              {selectedCount > 1 ? "s" : ""}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
