import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, CheckCircle, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Medicine } from "@/app/dashboard/settings/medicineinfo/page";
import { downloadCSV, exportMedicinesToCSV } from "@/lib/csv-utils";
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
  medicines: Medicine[];
  selectedMedicines: Set<string>;
  onSelectionChange: (selection: Set<string>) => void;
  onBulkStatusChange: (medicineIds: string[], active: boolean) => Promise<void>;
}

export const BulkOperations: React.FC<BulkOperationsProps> = ({
  medicines,
  selectedMedicines,
  onSelectionChange,
  onBulkStatusChange,
}) => {
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [targetStatus, setTargetStatus] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const selectedCount = selectedMedicines.size;
  const allSelected =
    medicines.length > 0 && selectedMedicines.size === medicines.length;
  const someSelected =
    selectedMedicines.size > 0 && selectedMedicines.size < medicines.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(medicines.map((m) => m.id)));
    }
  };

  const handleExportSelected = () => {
    const selectedMedicinesData = medicines.filter((m) =>
      selectedMedicines.has(m.id)
    );

    if (selectedMedicinesData.length === 0) {
      toast.error("No medicines selected for export");
      return;
    }

    try {
      const csvContent = exportMedicinesToCSV(selectedMedicinesData);
      const filename = `selected-medicines-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      downloadCSV(csvContent, filename);

      toast.success(
        `Exported ${selectedMedicinesData.length} selected medicines`
      );
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export selected medicines");
    }
  };

  const handleBulkStatusChange = async () => {
    setIsProcessing(true);
    try {
      await onBulkStatusChange(Array.from(selectedMedicines), targetStatus);
      onSelectionChange(new Set());
      setStatusDialogOpen(false);
      toast.success(`Updated status for ${selectedCount} medicines`);
    } catch (error) {
      console.error("Bulk status change error:", error);
      toast.error("Failed to update medicine status");
    } finally {
      setIsProcessing(false);
    }
  };

  const openStatusDialog = (active: boolean) => {
    setTargetStatus(active);
    setStatusDialogOpen(true);
  };

  if (medicines.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between px-3 bg-card rounded-lg border min-h-12">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={
              allSelected ? true : someSelected ? "indeterminate" : false
            }
            onCheckedChange={handleSelectAll}
            aria-label="Select all medicines"
          />
          <span className="text-sm font-medium">
            {selectedCount > 0 ? `${selectedCount} selected` : "Select all"}
          </span>
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              className="gap-2"
              size="sm"
              onClick={handleExportSelected}
            >
              <Download className="h-4 w-4" />
              <p className="hidden sm:block">Export Selected</p>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => openStatusDialog(true)}
              className="text-green-600 hover:text-green-700 gap-2"
            >
              <CheckCircle className="h-4 w-42" />
              <p className="hidden sm:block">Activate</p>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => openStatusDialog(false)}
              className="text-orange-600 hover:text-orange-700 gap-2"
            >
              <XCircle className="h-4 w-4 " />
              <p className="hidden sm:block">Deactivate</p>
            </Button>
          </div>
        )}
      </div>

      {/* Status Change Confirmation Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {targetStatus ? "Activate" : "Deactivate"} Selected Medicines
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to{" "}
              {targetStatus ? "activate" : "deactivate"} {selectedCount}{" "}
              selected medicine{selectedCount > 1 ? "s" : ""}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" disabled={isProcessing} variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleBulkStatusChange}
              disabled={isProcessing}
              className={
                targetStatus
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-red-600 text-white hover:bg-red-700"
              }
            >
              {isProcessing
                ? "Updating..."
                : targetStatus
                ? "Activate"
                : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
