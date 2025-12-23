"use client";

import * as React from "react";
import { Column } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DataTableBooleanFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  trueLabel?: string;
  falseLabel?: string;
}

export function DataTableBooleanFilter<TData, TValue>({
  column,
  title = "Status",
  trueLabel = "Yes",
  falseLabel = "No",
}: DataTableBooleanFilterProps<TData, TValue>) {
  const filterValue = column?.getFilterValue() as boolean | undefined;

  const handleToggle = (value: boolean | undefined) => {
    if (filterValue === value) {
      column?.setFilterValue(undefined);
    } else {
      column?.setFilterValue(value);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">{title}:</span>
      <Button
        variant={filterValue === true ? "default" : "outline"}
        size="sm"
        className="h-8"
        onClick={() => handleToggle(true)}
      >
        <Check className="mr-1 h-3 w-3" />
        {trueLabel}
      </Button>
      <Button
        variant={filterValue === false ? "default" : "outline"}
        size="sm"
        className="h-8"
        onClick={() => handleToggle(false)}
      >
        <X className="mr-1 h-3 w-3" />
        {falseLabel}
      </Button>
    </div>
  );
}
