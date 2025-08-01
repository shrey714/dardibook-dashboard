import { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { endOfDay, format, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
}

export function DataTableColumnFilter<TData, TValue>({
  column,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanFilter()) {
    return null;
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Filter column={column} />
    </div>
  );
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const { filterVariant } = column.columnDef.meta ?? {};

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = React.useMemo(
    () =>
      filterVariant === "range"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys())
            .sort()
            .slice(0, 5000),
    [column, filterVariant]
  );

  return filterVariant === "range" ? (
    <div>
      <div className="flex space-x-2">
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0] !== undefined
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
          className="w-24 border shadow rounded"
        />
      </div>
      <div className="h-1" />
    </div>
  ) : filterVariant === "select" ? (
    <Select
      onValueChange={(e) => column.setFilterValue(e === "all" ? "" : e)}
      value={columnFilterValue?.toString() || "all"}
    >
      <SelectTrigger className="min-w-[120px] w-min py-0 h-6">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        {sortedUniqueValues.map((value, index) => (
          <SelectItem value={value} key={index}>
            {value}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ) : filterVariant === "date-range" ? (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant="outline"
          className={cn(
            "justify-start text-left gap-1 py-0 px-2 h-6 font-normal w-auto min-w-[120px]",
            !(
              (columnFilterValue as [number, number])?.[0] &&
              (columnFilterValue as [number, number])?.[1]
            ) && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-1 !size-3.5" />
          {(columnFilterValue as [number, number])?.[0] ? (
            (columnFilterValue as [number, number])?.[1] ? (
              <>
                {format(
                  new Date((columnFilterValue as [number, number])?.[0] ?? 0),
                  "MMM dd, yy"
                )}{" "}
                -{" "}
                {format(
                  new Date((columnFilterValue as [number, number])?.[1] ?? 0),
                  "MMM dd, yy"
                )}
              </>
            ) : (
              format(
                new Date((columnFilterValue as [number, number])?.[0] ?? 0),
                "MMM dd, y"
              )
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={new Date()}
          selected={{
            from: (columnFilterValue as [number, number])?.[0]
              ? new Date((columnFilterValue as [number, number])[0])
              : undefined,
            to: (columnFilterValue as [number, number])?.[1]
              ? new Date((columnFilterValue as [number, number])[1])
              : undefined,
          }}
          onSelect={(value) => {
            if (value?.from && value?.to) {
              column.setFilterValue(() => [
                startOfDay(value.from || 0)?.getTime(),
                endOfDay(value.to || 0)?.getTime(),
              ]);
            } else if (value?.from) {
              column.setFilterValue(() => [
                startOfDay(value.from || 0)?.getTime(),
                endOfDay(value.from || 0)?.getTime(),
              ]);
            }
          }}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  ) : (
    <>
      {/* Autocomplete suggestions from faceted values feature */}
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(value) => column.setFilterValue(value)}
        placeholder={`Search... (${column.getFacetedUniqueValues().size})`}
        className="w-36 border shadow rounded"
        list={column.id + "list"}
      />
      <div className="h-1" />
    </>
  );
}

// A typical debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [debounce, onChange, value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
