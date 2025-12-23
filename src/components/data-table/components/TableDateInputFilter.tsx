
"use client";

import * as React from "react";
import { Column } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

export type DateRange = {
  from?: Date;
  to?: Date;
};

interface DataTableDateInputFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
}

export function DataTableDateInputFilter<TData, TValue>({
  column,
  title = "Date",
}: DataTableDateInputFilterProps<TData, TValue>) {
  const value = (column?.getFilterValue() as DateRange) ?? {};

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {title}
          {(value.from || value.to) && " : Filtered"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Date Range</h4>
            <p className="text-sm text-muted-foreground">
              Filter by date range
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="from">From</Label>
              <Input
                id="from"
                type="date"
                value={value.from?.toISOString().slice(0, 10) ?? ""}
                onChange={(e) =>
                  column?.setFilterValue({
                    ...value,
                    from: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="to">To</Label>
              <Input
                id="to"
                type="date"
                value={value.to?.toISOString().slice(0, 10) ?? ""}
                onChange={(e) =>
                  column?.setFilterValue({
                    ...value,
                    to: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
              />
            </div>
          </div>
          {(value.from || value.to) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => column?.setFilterValue(undefined)}
            >
              Clear
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}