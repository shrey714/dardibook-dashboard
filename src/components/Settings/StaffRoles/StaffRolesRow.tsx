import React, { useState } from "react";
import Loader from "@/components/common/Loader";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DisplayStaffProps {
  staff: Staff;
  index: number;
  deleteHandler: any;
}

interface Staff {
  email: string;
  role: string;
}

const StaffRolesRow: React.FC<DisplayStaffProps> = ({
  index,
  staff,
  deleteHandler,
}) => {
  const [deleteLoader, setdeleteLoader] = useState(false);
  return (
    <div className="grid grid-cols-10 gap-1 w-full mb-1">
      <div className="col-span-1 h-8 md:h-auto flex justify-center items-center rounded-md">
        {index + 1}
      </div>
      <div className="col-span-8 h-8 md:h-auto w-full flex items-center justify-start form-input py-[4px] md:py-1 rounded-md border-border bg-background text-sm md:text-base font-normal leading-4 flex-1">
        {staff.email}
      </div>
      <div className="col-span-1 flex justify-center items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="h-8 w-auto min-w-0"
              role="button"
              variant={"destructive"}
            >
              {deleteLoader ? (
                <>
                  <Loader
                    size="small"
                  />
                </>
              ) : (
                <Trash height={15} width={15} />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>
              Are you sure you want to delete this member?
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-1 gap-2 justify-center items-center mt-1">
                <Button
                  variant={"destructive"}
                  onClick={async () => {
                    setdeleteLoader(true);
                    await deleteHandler(staff.email);
                    setdeleteLoader(false);
                  }}
                >
                  <a>Yes</a>
                </Button>
                <Button
                  variant={"default"}
                >
                  <a>No</a>
                </Button>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default StaffRolesRow;
