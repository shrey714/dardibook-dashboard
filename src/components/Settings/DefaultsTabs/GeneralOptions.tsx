import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";

const themes = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

const GeneralOptions = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Card className="w-full h-min mx-auto">
      <CardHeader>
        <CardTitle className="font-medium">Theme Preferences</CardTitle>
        <CardDescription>
          Select your preferred theme for the app interface.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          onValueChange={setTheme}
          value={theme}
          defaultValue="card"
          className="flex flex-row flex-wrap gap-4"
        >
          {themes.map((theme) => (
            <div key={theme.value} className="flex flex-1">
              <RadioGroupItem
                value={theme.value}
                id={theme.value}
                className="peer sr-only"
              />
              <Label
                htmlFor={theme.value}
                className="flex flex-1 gap-0 flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 sm:p-6 md:p-9 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                {/* Mini Display Preview */}
                <div className="relative w-full aspect-[5/3] rounded-md overflow-hidden border bg-muted shadow-inner">
                  {theme.value === "light" && (
                    <div className="absolute inset-0 bg-white text-xs flex flex-col p-2 gap-1">
                      <div className="h-3 w-full rounded-sm bg-gray-300" />{" "}
                      {/* Top Bar */}
                      <div className="flex gap-1 mt-1">
                        <div className="w-1/5 h-12 rounded-sm bg-gray-200" />{" "}
                        {/* Sidebar */}
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="h-2 w-3/4 rounded-sm bg-gray-300" />
                          <div className="h-2 w-2/3 rounded-sm bg-gray-200" />
                          <div className="h-2 w-1/2 rounded-sm bg-gray-100" />
                        </div>
                      </div>
                    </div>
                  )}

                  {theme.value === "dark" && (
                    <div className="absolute inset-0 bg-zinc-900 text-xs flex flex-col p-2 gap-1">
                      <div className="h-3 w-full rounded-sm bg-zinc-600" />
                      <div className="flex gap-1 mt-1">
                        <div className="w-1/5 h-12 rounded-sm bg-zinc-800" />
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="h-2 w-3/4 rounded-sm bg-zinc-600" />
                          <div className="h-2 w-2/3 rounded-sm bg-zinc-700" />
                          <div className="h-2 w-1/2 rounded-sm bg-zinc-800" />
                        </div>
                      </div>
                    </div>
                  )}

                  {theme.value === "system" && (
                    <div className="absolute inset-0 flex">
                      {/* Left Light */}
                      <div className="w-1/2 bg-white text-xs flex flex-col p-2 gap-1 border-r border-muted">
                        <div className="h-3 w-full rounded-sm bg-gray-300" />
                        <div className="flex gap-1 mt-1">
                          <div className="w-1/5 h-12 rounded-sm bg-gray-200" />
                          <div className="flex-1 flex flex-col gap-1">
                            <div className="h-2 w-3/4 rounded-sm bg-gray-300" />
                            <div className="h-2 w-2/3 rounded-sm bg-gray-200" />
                          </div>
                        </div>
                      </div>
                      {/* Right Dark */}
                      <div className="w-1/2 bg-zinc-900 text-xs flex flex-col p-2 gap-1">
                        <div className="h-3 w-full rounded-sm bg-zinc-600" />
                        <div className="flex gap-1 mt-1">
                          <div className="w-1/5 h-12 rounded-sm bg-zinc-800" />
                          <div className="flex-1 flex flex-col gap-1">
                            <div className="h-2 w-3/4 rounded-sm bg-zinc-600" />
                            <div className="h-2 w-2/3 rounded-sm bg-zinc-700" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-2 mb-1 sm:mb-0 sm:mt-5">{theme.label}</div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default GeneralOptions;
