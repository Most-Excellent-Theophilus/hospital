
"use client";

import * as React from "react";
import { Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SlidersHorizontal } from "lucide-react";

interface DataTableSliderFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function DataTableSliderFilter<TData, TValue>({
  column,
  title = "Range",
  min = 0,
  max = 100,
  step = 1,
}: DataTableSliderFilterProps<TData, TValue>) {
  const [value, setValue] = React.useState<[number, number]>(
    (column?.getFilterValue() as [number, number]) ?? [min, max]
  );

  const handleValueChange = (newValue: [number, number]) => {
    setValue(newValue);
    column?.setFilterValue(newValue);
  };

  const handleClear = () => {
    setValue([min, max]);
    column?.setFilterValue(undefined);
  };

  const isFiltered =
    value[0] !== min || value[1] !== max;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 border-dashed"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {title}
          {isFiltered && ` : ${value[0]} - ${value[1]}`}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">{title}</h4>
            <p className="text-sm text-muted-foreground">
              {value[0]} - {value[1]}
            </p>
          </div>
          <Slider
            min={min}
            max={max}
            step={step}
            value={value}
            onValueChange={handleValueChange}
            className="w-full"
          />
          {isFiltered && (
            <Button variant="outline" size="sm" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}