import * as React from "react";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface InputProps extends React.ComponentProps<"input"> {
  startIcon?: LucideIcon;
  endIcon?: LucideIcon;
}

function Input({ className, type, startIcon, endIcon, ...props }: InputProps) {
  const StartIcon = startIcon;
  const EndIcon = endIcon;

  return (
    <div className="relative w-full">
      {StartIcon && (
        <div
          className={
            "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
          }
        >
          <StartIcon className="size-4" strokeWidth={2.25} />
        </div>
      )}

      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          startIcon ? "ps-9" : "",
          endIcon ? "pe-9" : "",
          className
        )}
        {...props}
      />

      {EndIcon && (
        <div
          className={
            "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 end-0 pe-3"
          }
        >
          <EndIcon className="size-4" strokeWidth={2.25} />
        </div>
      )}
    </div>
  );
}

export { Input };
