"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Column } from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

interface DataTableDateFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
}

export function DataTableDateFilter<TData, TValue>({
  column,
  title = "Date",
}: DataTableDateFilterProps<TData, TValue>) {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    (column?.getFilterValue() as DateRange) ?? undefined
  );

  const handleSelect = (range: DateRange | undefined) => {
    setDateRange(range);
    column?.setFilterValue(range);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 border-dashed",
            dateRange && "border-solid"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {title}
          {dateRange?.from && (
            <>
              {" : "}
              {format(dateRange.from, "MMM dd, yyyy")}
              {dateRange.to && ` - ${format(dateRange.to, "MMM dd, yyyy")}`}
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={handleSelect}
          initialFocus
          numberOfMonths={2}
        />
        {dateRange && (
          <div className="border-t p-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleSelect(undefined)}
            >
              Clear
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
