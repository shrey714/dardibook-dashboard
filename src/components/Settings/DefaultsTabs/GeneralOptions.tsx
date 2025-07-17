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
import { MonitorIcon } from "lucide-react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

const themes = [
  { label: "Light", value: "light", icon: SunIcon },
  { label: "Dark", value: "dark", icon: MoonIcon },
  { label: "System", value: "system", icon: MonitorIcon },
];

const GeneralOptions = () => {
  const { setTheme, theme } = useTheme();

  return (
    <Card className="rounded-md w-full shadow-none border h-min mx-auto">
      <CardHeader className="border-b p-4">
        <CardTitle className="font-medium tracking-normal">
          Theme Preferences
        </CardTitle>
        <CardDescription hidden></CardDescription>
      </CardHeader>
      <CardContent className="py-4 px-3 md:px-8">
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
                className="flex flex-1 flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 sm:p-6 md:p-9 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                <theme.icon className="mb-3 h-6 w-6" />
                {theme.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default GeneralOptions;
