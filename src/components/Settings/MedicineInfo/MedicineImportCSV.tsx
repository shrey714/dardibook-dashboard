import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import {
  AlertCircle,
  CheckCircle,
  InboxIcon,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { processMedicinesCSVFile } from "@/lib/csv-utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@clerk/nextjs";
import uniqid from "uniqid";
import { Medicine } from "@/app/dashboard/settings/medicineinfo/page";

interface CSVImportDialogProps {
  medicines: Medicine[] | null;
  setmedicines: React.Dispatch<React.SetStateAction<Medicine[] | null>>;
}

export interface CSVMedicine {
  medicineName: string;
  type: string;
  instruction: string;
}

const MedicineImportCSV: React.FC<CSVImportDialogProps> = ({
  medicines,
  setmedicines,
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [validRows, setValidRows] = useState<CSVMedicine[] | null>(null);
  const [medValidationLoader, setMedValidationLoader] = useState(false);
  const { orgId } = useAuth();

  const onFileValidate = useCallback(
    (file: File): string | null => {
      if (files.length >= 1) {
        return "You can only upload up to 1 csv file";
      }
      if (!file.type.startsWith("text/csv")) {
        return "Only CSV files are allowed";
      }
      return null;
    },
    [files]
  );

  const onFileReject = useCallback((_file: File, message: string) => {
    toast.error(message);
  }, []);

  const handleFileChange = useCallback((files: File[]) => {
    setFiles(files);
    setErrors([]);
    setValidRows(null);
  }, []);

  const onUpload = useCallback(
    async (
      files: File[],
      {
        onProgress,
        onSuccess,
        onError,
      }: {
        onProgress: (file: File, progress: number) => void;
        onSuccess: (file: File) => void;
        onError: (file: File, error: Error) => void;
      }
    ) => {
      try {
        const uploadPromises = files.map(async (file) => {
          try {
            setMedValidationLoader(true);
            const result = await processMedicinesCSVFile(file, medicines || []);
            setErrors(result.errors);
            setValidRows(result.validRows);
            onProgress(file, 40);
            setMedValidationLoader(false);
            onSuccess(file);
          } catch (error) {
            onError(
              file,
              error instanceof Error ? error : new Error("Upload failed")
            );
          } finally {
            setTimeout(() => {
              onProgress(file, 100);
            }, 100);
          }
        });

        await Promise.all(uploadPromises);
      } catch (error) {
        console.error("Unexpected error during upload:", error);
      }
    },
    [medicines]
  );

  const handleImport = async () => {
    if (!orgId || !validRows) return;

    setMedValidationLoader(true);
    try {
      const batch = writeBatch(db);
      const newMedicines: Medicine[] = [];

      validRows.forEach((medicine) => {
        if (!medicine.medicineName) return;

        const newMedicine: Medicine = {
          medicineName: medicine.medicineName,
          type: medicine.type,
          instruction: medicine.instruction,
          searchableString: medicine.medicineName.toLowerCase(),
          id: uniqid(),
          active: true,
        };

        batch.set(
          doc(db, "doctor", orgId, "medicinesData", newMedicine.id),
          newMedicine
        );

        newMedicines.push(newMedicine);
      });

      await toast.promise(
        async () => {
          await batch.commit().then(() => {
            setmedicines((prev) => [...(prev || []), ...newMedicines]);
            setFiles([]);
            setErrors([]);
            setValidRows(null);
          });
        },
        {
          loading: "Saving...",
          success: `Successfully saved ${newMedicines.length} diseases`,
          error: "Failed to save",
        },
        {
          position: "bottom-right",
        }
      );
    } catch (error) {
      console.error("Import save error:", error);
      toast.error("Failed to save imported diseases", {
        position: "bottom-right",
      });
    } finally {
      setMedValidationLoader(false);
    }
  };

  return (
    <Dialog
      onOpenChange={(state) => {
        if (!state) {
          setFiles([]);
          setErrors([]);
          setValidRows(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Upload className="h-4 w-4" />
          <p className="hidden sm:block">Import CSV</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[95%] h-[90%] sm:max-w-[74%] sm:h-[90%] p-0 flex flex-col gap-0 overflow-hidden">
        <DialogHeader className="px-3 py-3 sm:px-5 sm:py-4 bg-border shadow-sm">
          <DialogTitle className="font-medium tracking-normal">
            Import Medicines from CSV
          </DialogTitle>
          <DialogDescription className="line-clamp-1">
            Upload a CSV file to import medicines data. Make sure your CSV
            follows the correct format.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-1 flex-col p-3 sm:p-5 items-center overflow-y-auto pb-20 sm:pb-20">
          <FileUpload
            value={files}
            onValueChange={handleFileChange}
            onFileValidate={onFileValidate}
            onFileReject={onFileReject}
            accept="text/csv"
            maxFiles={1}
            className="w-full max-w-md"
            onUpload={onUpload}
          >
            {files.length === 0 ? (
              <FileUploadDropzone className="border-muted-foreground/60">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center justify-center rounded-full border p-2.5">
                    <Upload className="size-6 text-muted-foreground" />
                  </div>
                  <p className="font-medium text-sm">Drag & drop file here</p>
                  <p className="text-muted-foreground text-xs">
                    Or click to browse (max 1 CSV file)
                  </p>
                </div>
                <FileUploadTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-2 w-fit">
                    Browse files
                  </Button>
                </FileUploadTrigger>
              </FileUploadDropzone>
            ) : (
              <FileUploadList>
                {files.map((file) => (
                  <FileUploadItem key={file.name} value={file}>
                    <FileUploadItemPreview />
                    <FileUploadItemProgress />
                    <FileUploadItemMetadata />
                    <FileUploadItemDelete asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        disabled={medValidationLoader}
                      >
                        <X />
                      </Button>
                    </FileUploadItemDelete>
                  </FileUploadItem>
                ))}
              </FileUploadList>
            )}
          </FileUpload>

          {files.length === 0 && (
            <div className="h-svh flex flex-col max-w-full md:max-w-xl lg:max-w-4xl w-full mt-3 md:mt-5">
              <div className="h-20 w-full border-dashed border-muted-foreground/80 border rounded-t-md"></div>
              <div className="h-20 w-full border-dashed border-muted-foreground/80 border-b border-x opacity-80"></div>
              <div className="h-20 w-full border-dashed border-muted-foreground/80 border-b border-x opacity-65"></div>
              <div className="h-20 w-full border-dashed border-muted-foreground/80 border-b border-x opacity-50"></div>
              <div className="min-h-20 flex flex-1 w-full border-dashed border-muted-foreground/80 border-x opacity-35"></div>
            </div>
          )}

          {/* Errors */}
          {errors.length > 0 && (
            <Alert className="mt-3 border-2 bg-red-300/10 border-destructive/50 dark:border-destructive">
              <AlertCircle className="h-5 w-5 !text-red-600" />
              <AlertTitle className="text-base text-red-600">
                Validation Errors
              </AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                  {errors.map((error, index) => (
                    <div key={index} className="text-xs">
                      {error}
                    </div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Success Summary */}
          {validRows && validRows.length > 0 && (
            <Alert className="mt-3 border-2 bg-green-300/10 border-green-500/50">
              <CheckCircle className="h-5 w-5 !text-green-500" />
              <AlertTitle className="text-base text-green-500">
                Ready to Import
              </AlertTitle>
              <AlertDescription className="text-xs">
                Found {validRows.length} valid medicines ready for import.
              </AlertDescription>
            </Alert>
          )}

          {/* diaplay imported medicine */}
          {validRows && (
            <div className="mt-3 w-full flex flex-col bg-sidebar/70 border rounded-md">
              {validRows.length === 0 ? (
                <>
                  <div className="flex flex-1 items-center justify-center text-muted-foreground min-h-40 gap-2 flex-col">
                    <InboxIcon />
                    No medicine data available to import
                  </div>
                </>
              ) : (
                <>
                  {validRows.map((medicine: CSVMedicine, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`grid grid-cols-12 gap-1 w-full px-2 sm:px-4 py-2 ${
                          index !== 0 ? "border-t" : "border-0"
                        }`}
                      >
                        <div className="col-span-4 h-auto flex justify-start items-start">
                          <p className="text-sm font-normal">
                            {medicine.medicineName}
                          </p>
                        </div>

                        <div className="col-span-2">
                          {medicine.type && (
                            <Badge
                              variant="outline"
                              className="text-xs font-medium"
                            >
                              {medicine.type}
                            </Badge>
                          )}
                        </div>

                        <div className="col-span-5 [&:empty]:invisible border rounded-md flex items-center h-min py-[0px] sm:py-[5.5px] px-2 text-muted-foreground bg-background border-border text-sm w-full">
                          {medicine.instruction || "No Instruction"}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          )}

          {validRows && validRows.length > 0 && (
            <Button
              onClick={handleImport}
              disabled={medValidationLoader}
              variant="default"
              className="max-w-md w-max md:w-full gap-2 absolute bottom-20"
            >
              {medValidationLoader ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Import {validRows.length} Medicines
                </>
              )}
            </Button>
          )}
        </div>
        <DialogFooter className="py-3 px-3 sm:px-5 bg-border">
          <DialogClose asChild>
            <Button type="submit" variant="default">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MedicineImportCSV;
