import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@clerk/nextjs";
import { useLogStore } from "@/utility/activityLogging/useActivityLogStore";
import { Clock12Icon, OctagonAlertIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function NavHospital() {
  const { isLoaded, organization } = useOrganization();
  const { isLoading, error } = useLogStore();

  return (
    <div className="rounded-full p-0.5 bg-secondary flex items-center h-min overflow-auto">
      {!isLoaded ? (
        <div className="flex items-center gap-1">
          <Skeleton className="size-6 rounded-full" />
          <Skeleton className="h-3 w-[50px]" />
        </div>
      ) : (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="relative rounded-full size-7 bg-secondary ring-0">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <motion.span
                      key="loading"
                      className="absolute bg-black/80 size-full flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Clock12Icon className="size-6 shrink-0 text-green-600 animate-spin" />
                    </motion.span>
                  ) : error ? (
                    <motion.span
                      key="error"
                      className="absolute bg-black/80 size-full flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                    >
                      <OctagonAlertIcon className="size-6 shrink-0 text-red-600" />
                    </motion.span>
                  ) : null}
                </AnimatePresence>

                <AvatarImage src={organization?.imageUrl} alt="D" />
                <AvatarFallback>D</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {isLoading
                  ? "Logging activity..."
                  : error
                  ? "Failed to log activity"
                  : "Activity log is up to date"}
              </p>
            </TooltipContent>
          </Tooltip>
          <p
            className="truncate leading-none text-xs sm:text-sm ml-1.5 mr-1.5"
            title={organization?.name}
          >
            {organization?.name}
          </p>
        </>
      )}
    </div>
  );
}
