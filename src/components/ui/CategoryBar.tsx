// Tremor CategoryBar [v0.0.3]

"use client";

import React from "react";

const getMarkerBgColor = (
  marker: number | undefined,
  values: number[],
  colors: AvailableChartColorsKeys[]
): string => {
  if (marker === undefined) return "";

  if (marker === 0) {
    for (let index = 0; index < values.length; index++) {
      if (values[index] > 0) {
        return getColorClassName(colors[index], "bg");
      }
    }
  }

  let prefixSum = 0;
  for (let index = 0; index < values.length; index++) {
    prefixSum += values[index];
    if (prefixSum >= marker) {
      return getColorClassName(colors[index], "bg");
    }
  }

  return getColorClassName(colors[values.length - 1], "bg");
};

const getPositionLeft = (value: number | undefined, maxValue: number): number =>
  value ? (value / maxValue) * 100 : 0;

const sumNumericArray = (arr: number[]) =>
  arr.reduce((prefixSum, num) => prefixSum + num, 0);

const formatNumber = (num: number): string => {
  const base = startOfDay(new Date()); // 00:00 of today
  const date = addMinutes(base, num);
  return format(date, "HH:mm");
  // if (Number.isInteger(num)) {
  //   return num.toString()
  // }
  // return num.toFixed(1)
};

const BarLabels = ({ values }: { values: number[] }) => {
  const sumValues = React.useMemo(() => sumNumericArray(values), [values]);
  let prefixSum = 0;
  let sumConsecutiveHiddenLabels = 0;

  return (
    <div
      className={cx(
        // base
        "relative mb-2 flex h-5 w-full text-sm font-medium",
        // text color
        "text-gray-700 dark:text-gray-300"
      )}
    >
      <div className="absolute bottom-0 left-0 flex items-center">0</div>
      {values.map((widthPercentage, index) => {
        prefixSum += widthPercentage;

        const showLabel =
          (widthPercentage >= 0.1 * sumValues ||
            sumConsecutiveHiddenLabels >= 0.09 * sumValues) &&
          sumValues - prefixSum >= 0.1 * sumValues &&
          prefixSum >= 0.1 * sumValues &&
          prefixSum < 0.9 * sumValues;

        sumConsecutiveHiddenLabels = showLabel
          ? 0
          : (sumConsecutiveHiddenLabels += widthPercentage);

        const widthPositionLeft = getPositionLeft(widthPercentage, sumValues);

        return (
          <div
            key={`item-${index}`}
            className="flex items-center justify-end pr-0.5"
            style={{ width: `${widthPositionLeft}%` }}
          >
            {showLabel ? (
              <span
                className={cx("block translate-x-1/2 text-sm tabular-nums")}
              >
                {formatNumber(prefixSum)}
              </span>
            ) : null}
          </div>
        );
      })}
      <div className="absolute right-0 bottom-0 flex items-center">
        {formatNumber(sumValues)}
      </div>
    </div>
  );
};

interface CategoryBarProps extends React.HTMLAttributes<HTMLDivElement> {
  values: number[];
  bookingDetails: (OrgBed | undefined)[];
  colors?: AvailableChartColorsKeys[];
  marker?: { value: number; tooltip?: string; showAnimation?: boolean };
  showLabels?: boolean;
  bedPatients: Record<string, BedPatientTypes>;
}

const CategoryBar = React.forwardRef<HTMLDivElement, CategoryBarProps>(
  (
    {
      values = [],
      colors = AvailableChartColors,
      marker,
      showLabels = true,
      className,
      bookingDetails,
      bedPatients,
      ...props
    },
    forwardedRef
  ) => {
    const markerBgColor = React.useMemo(
      () => getMarkerBgColor(marker?.value, values, colors),
      [marker, values, colors]
    );

    const maxValue = React.useMemo(() => sumNumericArray(values), [values]);

    const adjustedMarkerValue = React.useMemo(() => {
      if (marker === undefined) return undefined;
      if (marker.value < 0) return 0;
      if (marker.value > maxValue) return maxValue;
      return marker.value;
    }, [marker, maxValue]);

    const markerPositionLeft: number = React.useMemo(
      () => getPositionLeft(adjustedMarkerValue, maxValue),
      [adjustedMarkerValue, maxValue]
    );
    const isMobile = useIsMobile();

    return (
      <div
        ref={forwardedRef}
        className={cx(className)}
        aria-label="Category bar"
        aria-valuenow={marker?.value}
        tremor-id="tremor-raw"
        {...props}
      >
        {showLabels ? <BarLabels values={values} /> : null}
        <div className="relative flex h-8 w-full items-center">
          <div className="flex h-full flex-1 items-center gap-0.5 overflow-hidden rounded-none">
            {values.map((value, index) => {
              const barColor = colors[index] ?? "gray";
              const percentage = (value / maxValue) * 100;
              const bed = bookingDetails[index];
              const matchingPatient = bed?.patient_id
                ? bedPatients[bed.patient_id]
                : undefined;
              return isMobile?(
                <Popover key={index}>
                <PopoverTrigger asChild>
                  <div
                    key={`item-${index}`}
                    className={cx(
                      `h-full ${matchingPatient && bed ? "cursor-pointer":""}`,
                      getColorClassName(
                        barColor as AvailableChartColorsKeys,
                        "bg"
                      ),
                      percentage === 0 && "hidden"
                    )}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </PopoverTrigger>
                {matchingPatient && bed && (
                  <PopoverContent
                    className="w-auto bg-muted p-2 z-[1000]"
                    sideOffset={20}
                    asChild={false}
                  >
                    <div className="flex flex-row gap-x-4">
                      <div className="flex flex-col items-start space-y-1">
                        <h4 className="text-sm font-semibold">
                          Id : {bed.patient_id}
                        </h4>
                        <h4 className="text-sm font-semibold">
                          Name : {matchingPatient.name}
                        </h4>
                        <h4 className="text-sm font-semibold">
                          Gender : {matchingPatient.gender}
                        </h4>
                        <h4 className="text-sm font-semibold">
                          Age : {matchingPatient.age}
                        </h4>
                        <p className="flex text-sm items-center gap-2">
                          <PhoneIcon size={16} className="text-primary" />{" "}
                          {matchingPatient.mobile}
                        </p>
                      </div>
                      <div className="flex flex-col items-start space-y-1">
                        <p className="flex bg-blue-600/10 text-blue-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-t-sm">
                          <PencilLineIcon size={16} /> {bed.admission_by.name}
                        </p>
                        <p className="!mt-0 flex bg-green-500/10 text-green-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-b-sm">
                          <BriefcaseMedicalIcon size={16} />{" "}
                          {bed.admission_for.name}
                        </p>
                        <p className="flex bg-green-500/10 text-green-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-t-sm">
                          <CalendarPlusIcon size={16} />{" "}
                          {bed.admission_at &&
                            format(bed.admission_at, "dd-MM-yyyy hh:mm aa")}
                        </p>
                        <p className="!mt-0 bg-red-500/10 text-red-600 flex text-sm items-center gap-2 px-2 py-1 w-full rounded-b-sm">
                          <CalendarMinusIcon size={16} />{" "}
                          {bed.discharge_at &&
                            format(bed.discharge_at, "dd-MM-yyyy hh:mm aa")}
                        </p>
                      </div>
                    </div>
                    {bed.dischargeMarked ? (
                      <div className="bg-red-500/10 mt-2 w-full rounded-md text-red-600 flex flex-row gap-4 px-3 py-1 items-center">
                        <LogOut className="w-5 h-5" /> Discharged by{" "}
                        {bed?.discharged_by?.name ?? ""}
                      </div>
                    ) : (
                      <></>
                    )}
                  </PopoverContent>
                )}
              </Popover>
              ):(
                <HoverCard key={index}>
                  <HoverCardTrigger asChild>
                    <div
                      key={`item-${index}`}
                      className={cx(
                        "h-full",
                        getColorClassName(
                          barColor as AvailableChartColorsKeys,
                          "bg"
                        ),
                        percentage === 0 && "hidden"
                      )}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </HoverCardTrigger>
                  {matchingPatient && bed && (
                    <HoverCardContent
                      className="w-auto bg-muted p-2 z-[1000]"
                      sideOffset={20}
                      asChild={false}
                    >
                      <div className="flex flex-row gap-x-4">
                        <div className="flex flex-col items-start space-y-1">
                          <h4 className="text-sm font-semibold">
                            Id : {bed.patient_id}
                          </h4>
                          <h4 className="text-sm font-semibold">
                            Name : {matchingPatient.name}
                          </h4>
                          <h4 className="text-sm font-semibold">
                            Gender : {matchingPatient.gender}
                          </h4>
                          <h4 className="text-sm font-semibold">
                            Age : {matchingPatient.age}
                          </h4>
                          <p className="flex text-sm items-center gap-2">
                            <PhoneIcon size={16} className="text-primary" />{" "}
                            {matchingPatient.mobile}
                          </p>
                        </div>
                        <div className="flex flex-col items-start space-y-1">
                          <p className="flex bg-blue-600/10 text-blue-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-t-sm">
                            <PencilLineIcon size={16} /> {bed.admission_by.name}
                          </p>
                          <p className="!mt-0 flex bg-green-500/10 text-green-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-b-sm">
                            <BriefcaseMedicalIcon size={16} />{" "}
                            {bed.admission_for.name}
                          </p>
                          <p className="flex bg-green-500/10 text-green-600 text-sm items-center gap-2 px-2 py-1 w-full rounded-t-sm">
                            <CalendarPlusIcon size={16} />{" "}
                            {bed.admission_at &&
                              format(bed.admission_at, "dd-MM-yyyy hh:mm aa")}
                          </p>
                          <p className="!mt-0 bg-red-500/10 text-red-600 flex text-sm items-center gap-2 px-2 py-1 w-full rounded-b-sm">
                            <CalendarMinusIcon size={16} />{" "}
                            {bed.discharge_at &&
                              format(bed.discharge_at, "dd-MM-yyyy hh:mm aa")}
                          </p>
                        </div>
                      </div>
                      {bed.dischargeMarked ? (
                        <div className="bg-red-500/10 mt-2 w-full rounded-md text-red-600 flex flex-row gap-4 px-3 py-1 items-center">
                          <LogOut className="w-5 h-5" /> Discharged by{" "}
                          {bed?.discharged_by?.name ?? ""}
                        </div>
                      ) : (
                        <></>
                      )}
                    </HoverCardContent>
                  )}
                </HoverCard>
              );
            })}
          </div>

          {marker !== undefined ? (
            <div
              className={cx(
                "absolute w-2 -translate-x-1/2",
                marker.showAnimation &&
                  "transform-gpu transition-all duration-300 ease-in-out"
              )}
              style={{
                left: `${markerPositionLeft}%`,
              }}
            >
              {marker.tooltip ? (
                <Tooltip open={isMobile?true:undefined}>
                  <TooltipContent className="bg-white">
                    <div className="text-red-500">{marker.tooltip}</div>
                  </TooltipContent>
                  <TooltipTrigger asChild>
                    <div
                      aria-hidden="true"
                      className={cx(
                        "relative mx-auto h-12 w-1 rounded-full ring-2",
                        "ring-white dark:ring-gray-950",
                        markerBgColor
                      )}
                    >
                      <div
                        aria-hidden
                        className="absolute size-7 -translate-x-[45%] -translate-y-[15%]"
                      ></div>
                    </div>
                  </TooltipTrigger>
                </Tooltip>
              ) : (
                <div
                  className={cx(
                    "mx-auto h-4 w-1 rounded-full ring-2",
                    "ring-white dark:ring-gray-950",
                    markerBgColor
                  )}
                />
              )}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
);

import clsx, { type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
import { addMinutes, format, startOfDay } from "date-fns";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import { BedPatientTypes, OrgBed } from "@/types/FormTypes";
import {
  BriefcaseMedicalIcon,
  CalendarMinusIcon,
  CalendarPlusIcon,
  LogOut,
  PencilLineIcon,
  PhoneIcon,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useIsMobile } from "@/hooks/use-mobile";

export function cx(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

CategoryBar.displayName = "CategoryBar";

export { CategoryBar, type CategoryBarProps };

// Tremor Raw chartColors [v0.1.0]

type ColorUtility = "bg" | "stroke" | "fill" | "text";

export const chartColors = {
  blue: {
    bg: "bg-blue-500",
    stroke: "stroke-blue-500",
    fill: "fill-blue-500",
    text: "text-blue-500",
  },
  emerald: {
    bg: "bg-emerald-500",
    stroke: "stroke-emerald-500",
    fill: "fill-emerald-500",
    text: "text-emerald-500",
  },
  violet: {
    bg: "bg-violet-500",
    stroke: "stroke-violet-500",
    fill: "fill-violet-500",
    text: "text-violet-500",
  },
  amber: {
    bg: "bg-amber-500",
    stroke: "stroke-amber-500",
    fill: "fill-amber-500",
    text: "text-amber-500",
  },
  gray: {
    bg: "bg-gray-500",
    stroke: "stroke-gray-500",
    fill: "fill-gray-500",
    text: "text-gray-500",
  },
  cyan: {
    bg: "bg-cyan-500",
    stroke: "stroke-cyan-500",
    fill: "fill-cyan-500",
    text: "text-cyan-500",
  },
  pink: {
    bg: "bg-pink-500",
    stroke: "stroke-pink-500",
    fill: "fill-pink-500",
    text: "text-pink-500",
  },
  lime: {
    bg: "bg-lime-500",
    stroke: "stroke-lime-500",
    fill: "fill-lime-500",
    text: "text-lime-500",
  },
  fuchsia: {
    bg: "bg-fuchsia-500",
    stroke: "stroke-fuchsia-500",
    fill: "fill-fuchsia-500",
    text: "text-fuchsia-500",
  },
} as const satisfies {
  [color: string]: {
    [key in ColorUtility]: string;
  };
};

type AvailableChartColorsKeys = keyof typeof chartColors;

const AvailableChartColors: AvailableChartColorsKeys[] = Object.keys(
  chartColors
) as Array<AvailableChartColorsKeys>;

const getColorClassName = (
  color: AvailableChartColorsKeys,
  type: ColorUtility
): string => {
  const fallbackColor = {
    bg: "bg-gray-500",
    stroke: "stroke-gray-500",
    fill: "fill-gray-500",
    text: "text-gray-500",
  };
  return chartColors[color]?.[type] ?? fallbackColor[type];
};
