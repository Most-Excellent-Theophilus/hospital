"use client";

import { Table } from "@tanstack/react-table";

interface TableFooterProps<T> {
  table: Table<T>;
}

export function TableFooter<T>({ table }: TableFooterProps<T>) {
  return (
    <div className="my-4">
      <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
    </div>
  );
}