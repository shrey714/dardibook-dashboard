"use client";
import { FormEvent, memo, useCallback, useMemo, useState } from "react";
import { CirclePlus, SquarePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import CreatableSelect from "react-select/creatable";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useOrganization } from "@clerk/nextjs";
import { BedInfo } from "@/types/FormTypes";
import toast from "react-hot-toast";
import { updateBedDefaults } from "@/app/dashboard/settings/defaults/_actions";

const AddNewBedBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { organization, isLoaded } = useOrganization();
  const [bedAddLoader, setBedAddLoader] = useState<boolean>(false);

  const columns: BedInfo[] = useMemo(() => {
    return isLoaded && organization && organization.publicMetadata
      ? (organization.publicMetadata?.beds as BedInfo[])
      : [];
  }, [isLoaded, organization]);
  const wards = useMemo(() => {
    return [...new Set(columns.map((bed) => bed.ward))].sort().map((val) => ({
      label: val,
      value: val,
    }));
  }, [columns]);

  const AddNewBed = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!organization)
        return Promise.reject(new Error("No organization found"));

      const form = e.target as HTMLFormElement;
      const newBed: BedInfo = {
        bed_id: form.bed_id.value.trim(),
        ward: form.ward.value.trim(),
      };

      if (
        columns.find(
          (bed) =>
            bed.bed_id.toLowerCase() === form.bed_id.value.trim().toLowerCase()
        )
      ) {
        toast.error(
          `Bed with id ${form.bed_id.value.trim().toLowerCase()} already exists`
        );
        return Promise.reject(new Error("Bed already exists"));
      }

      setBedAddLoader(true);

      try {
        await new Promise((resolve, reject) => {
          toast
            .promise(
              updateBedDefaults(columns.concat(newBed)),
              {
                loading: "Adding new bed...",
                success: "Bed added successfully",
                error: "Error adding bed",
              },
              {
                position: "bottom-right",
              }
            )
            .then(resolve)
            .catch(reject);
        });

        organization.reload();
        form.reset();
        setBedAddLoader(false);
        setIsOpen(false);
        return Promise.resolve();
      } catch (error) {
        console.error("Operation failed. Please try again: ", error);
        setBedAddLoader(false);
        return Promise.reject(error);
      }
    },
    [columns, organization]
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} icon={SquarePlus} iconPlacement="right">
          <p className="hidden sm:block">Add Bed</p>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-medium">Add Bed</DialogTitle>
          <DialogDescription>Add bed with ward assignments</DialogDescription>
        </DialogHeader>
        <form onSubmit={AddNewBed} autoComplete="off">
          <fieldset
            disabled={bedAddLoader}
            className="w-full rounded-lg grid grid-cols-6 gap-4"
          >
            <div className="col-span-6 space-y-2">
              <Label htmlFor="bed_id">Bed Number/ID</Label>
              <Input
                name="bed_id"
                id="bed_id"
                placeholder="e.g., Bed 01"
                required
                pattern=".*\S.*"
                title="Should not empty"
              />
            </div>

            <div className="col-span-6 space-y-2">
              <Label htmlFor="ward">Ward</Label>
              <CreatableSelect
                name="ward"
                id="ward"
                className="h-min w-full block bg-transparent"
                backspaceRemovesValue={true}
                options={wards}
                placeholder="e.g., General"
                components={{
                  IndicatorSeparator: () => null,
                }}
                isClearable
                required
                autoFocus={false}
                classNames={{
                  control: (state) =>
                    `!shadow-sm !transition-all !duration-900 !rounded-md !h-9 !min-h-9 !bg-transparent dark:!bg-input/30 ${
                      state.isFocused
                        ? "!border-ring !ring-ring/50 !ring-[3px]"
                        : "!border-border"
                    }`,
                  placeholder: () =>
                    "!truncate !text-sm sm:!text-base !px-4 !text-muted-foreground",
                  singleValue: () => "!text-primary !px-4",
                  input: () => "!text-inherit !px-4",
                  menu: () =>
                    `!border-border !overflow-hidden !shadow-md !text-black !w-full !bg-popover !border !text-primary`,
                  menuList: () => "!py-1 md:!py-2",
                  option: (state) =>
                    `bg-background p-2 border-0 text-base hover:cursor-pointer ${
                      state.isFocused && !state.isSelected
                        ? "!bg-secondary"
                        : ""
                    } ${state.isSelected ? "" : "hover:!bg-secondary"}`,
                }}
              />
            </div>

            <Separator className="w-full col-span-6" />
            <div className="flex col-span-6 w-full items-center justify-between">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => setIsOpen(false)}
                aria-label="Close popover"
              >
                Close
              </Button>

              <Button
                tabIndex={0}
                role="button"
                type="submit"
                effect={"ringHover"}
                icon={CirclePlus}
                iconPlacement="right"
                loading={bedAddLoader}
                loadingText="Adding"
              >
                Add
              </Button>
            </div>
          </fieldset>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default memo(AddNewBedBtn);
