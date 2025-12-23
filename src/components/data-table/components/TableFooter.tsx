"use client";

import { Table } from "@tanstack/react-table";
import { TablePageSizeSelector } from "./TablePageSizeSelector";
interface TableFooterProps<T> {
  table: Table<T>;
}

export function TableFooter<T>({ table }: TableFooterProps<T>) {
  return (
    <div className="my-4 flex items-center">
      <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
 <TablePageSizeSelector table={table} />

          </div>
  );
}