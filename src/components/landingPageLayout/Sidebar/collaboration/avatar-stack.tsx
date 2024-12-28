"use client";

import { useOthers, useSelf } from "@liveblocks/react/suspense";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PresenceAvatar = ({
  info,
}: {
  // biome-ignore lint/correctness/noUndeclaredVariables: Liveblocks is global
  info?: Liveblocks["UserMeta"]["info"];
}) => {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger>
        <Avatar className="h-7 w-7 bg-secondary ring-1 ring-background">
          <AvatarImage src={info?.photoURL} alt={info?.name} />
          <AvatarFallback className="text-xs">
            {info?.name?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </TooltipTrigger>
      <TooltipContent collisionPadding={4}>
        <p>{info?.name ?? ""}</p>
        <p>{info?.email ?? ""}</p>
        <span className="text-[7px] font-semibold border-[1.5px] border-[--border] px-2 rounded-full">
          {info?.role === "org:clinic_head"
            ? "Admin"
            : info?.role === "org:doctor"
            ? "Doctor"
            : info?.role === "org:assistant_doctor"
            ? "SubDoctor"
            : info?.role === "org:medical_staff"
            ? "Medical"
            : ""}
        </span>
      </TooltipContent>
    </Tooltip>
  );
};

export const AvatarStack = () => {
  const others = useOthers();
  const self = useSelf();
  const hasMoreUsers = others.length > 3;

  return (
    <div className="-space-x-1 flex items-center px-4">
      {others.slice(0, 3).map(({ connectionId, info }) => (
        <PresenceAvatar key={connectionId} info={info} />
      ))}

      {hasMoreUsers && (
        <PresenceAvatar
          info={{
            name: `+${others.length - 3}`,
            email: "",
            photoURL: undefined,
            role: "",
          }}
        />
      )}

      {self && <PresenceAvatar info={{ ...self.info, name: "me" }} />}
    </div>
  );
};
