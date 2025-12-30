"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import { Table } from "@tanstack/react-table";
import { TablePaginationControls } from "./TablePaginationControls";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface TableTopBarProps<T> {
  table: Table<T>;
  createNewRecordLink: () => void;
  enablePagination: boolean;
  children?: React.ReactNode
}

export function TableTopBar<T>({
  table,
  createNewRecordLink,
  
}: TableTopBarProps<T>) {
  return (
    <div className="flex px-4 py-3  w-full justify-between bg-accent border-b sticky top-0 z-50">
      <Button onClick={createNewRecordLink} size="lg" >

        <Plus />
        <span>New</span>

      </Button>

      <div className="flex items-center justify-between ">
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className=" hidden flex-1 items-center text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} result(s).
          </div>
          <TablePaginationControls table={table} />
          <div className="hidden items-center gap-2 lg:flex">

            <Select

              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger size="default" className=" bg-background" id="rows-per-page" >
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    Page Size: {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>


          </div>
        </div>
      </div>

    </div>
  );
}
