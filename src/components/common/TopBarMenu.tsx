"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Maximize,
  Minimize,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";

export function TopBarMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="p-2 aspect-square text-muted-foreground h-min w-min ml-2 rounded-full shadow-none focus-visible:ring-0"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-32 sm:w-56 bg-card" align="end">
        <ModeToggle />
        <FullscreenToggle />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const FullscreenToggle = () => {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <DropdownMenuItem onClick={toggleFullscreen}>
      {document.fullscreenElement ? (
        <>
          <Minimize size={20} /> Minimize
        </>
      ) : (
        <>
          <Maximize size={20} /> Maximize
        </>
      )}
    </DropdownMenuItem>
  );
};

import { useTheme } from "next-themes";

const themes = [
  { label: "Light", value: "light", Icon: Sun },
  { label: "Dark", value: "dark", Icon: Moon },
  { label: "System", value: "system", Icon: Monitor },
];

export const ModeToggle = () => {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        {theme === "light" && (
          <Sun size={16} className="mr-2 text-muted-foreground" />
        )}
        {theme === "dark" && (
          <Moon size={16} className="mr-2 text-muted-foreground" />
        )}
        {theme === "system" && (
          <Monitor size={16} className="mr-2 text-muted-foreground" />
        )}
        <p className="line-clamp-1 truncate">Toggle theme</p>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent
          sideOffset={6}
          className="bg-card"
          alignOffset={2}
        >
          {themes.map(({ label, value, Icon }) => (
            <DropdownMenuItem key={value} onClick={() => setTheme(value)}>
              <Icon /> {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
