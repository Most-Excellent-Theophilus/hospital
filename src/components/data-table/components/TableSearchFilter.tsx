
"use client";

import * as React from "react";
import { Column } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableSearchFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  placeholder?: string;
  debounceMs?: number;
}

export function DataTableSearchFilter<TData, TValue>({
  column,
  placeholder = "Search...",
  debounceMs = 300,
  className,
  ...props

}: DataTableSearchFilterProps<TData, TValue> & React.ComponentProps<"input">) {
  const [value, setValue] = React.useState(
    (column?.getFilterValue() as string) ?? ""
  );

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      column?.setFilterValue(value || undefined);
    }, debounceMs);

    return () => clearTimeout(timeout);
  }, [value, column, debounceMs]);

  return (
    <div className="relative flex items-center">
      <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={cn("h-8 w-[150px] pl-8 pr-8 lg:w-[250px]", className)}
        {...props}
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-0 h-full px-2 hover:bg-transparent"
          onClick={() => setValue("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
