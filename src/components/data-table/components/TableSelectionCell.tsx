
"use client";

import { Row, Table } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";

interface SelectionHeaderProps<T> {
  table: Table<T>;
}

export function SelectionHeader<T>({ table }: SelectionHeaderProps<T>) {
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  );
}

interface SelectionCellProps<T> {
  row: Row<T>;
}

export function SelectionCell<T>({ row }: SelectionCellProps<T>) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  );
}