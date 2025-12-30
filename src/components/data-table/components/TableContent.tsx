"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, Table as TableType } from "@tanstack/react-table";
import { BaseTableItem } from "../types";
import { Search } from "lucide-react";


interface TableContentProps<T extends BaseTableItem> {
  table: TableType<T>;
  columnCount: number;
}

export function TableContent<T extends BaseTableItem>({
  table,
  columnCount,
}: TableContentProps<T>) {

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader className="border-b sticky top-0">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="font-bold">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <tr>
              <td colSpan={columnCount} className="px-4 py-12 text-center">
                <div className="flex flex-col items-center justify-center ">
                  <Search className="h-12 w-12 mb-2 opacity-40" />
                  <p className="text-sm font-medium">No results found</p>
                  <p className="text-xs">Try adjusting your filters or search terms</p>
                </div>
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
