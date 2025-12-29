"use client";

import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  VisibilityState,
  Column,
} from "@tanstack/react-table";
import React, { useState } from "react";
import { GenericDataTableProps, BaseTableItem } from "./types";
import { useTableColumns } from "./hooks/useTableColumns";
import { TableTopBar } from "./components/TableTopBar";


import { TableContent } from "./components/TableContent";
import { TableFooter } from "./components/TableFooter";

import { CalendarIcon, Filter, Search, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Label } from "../ui/label";
import { DataTableSearchFilter } from "./components/TableSearchFilter";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";


export function GenericDataTable<T extends BaseTableItem>({
  data,
  fields,

  actionConfig,
  enableSelection = true,
  enablePagination = true,
  pageSize = 10,
  onSelectionChange,
  createNewRecordLink,
}: GenericDataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
    const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });
  

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(
      fields.reduce((acc, field) => {
        if (field.hidden) acc[String(field.key)] = false;
        return acc;
      }, {} as VisibilityState)
    );
  const [rowSelection, setRowSelection] = React.useState({});

  const [globalFilter, setGlobalFilter] = useState('');

  const columns = useTableColumns(fields, actionConfig, enableSelection);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination
      ? getPaginationRowModel()
      : undefined,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: enablePagination ? { pageSize } : undefined,
    },
  });

  React.useEffect(() => {
    if (onSelectionChange) {
      const selectedRows = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original);
      onSelectionChange(selectedRows);
    }
  }, [rowSelection, onSelectionChange, table]);

  return (
    <div className=" ">
      <TableTopBar
        table={table}
        createNewRecordLink={createNewRecordLink}
        enablePagination={enablePagination}
      />

      <div className="flex items-center gap-2 px-6 py-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or ID..."
            value={globalFilter ?? ''}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 h-10"
          />
        </div>
      </div>



      <div className=" px-6">
        <TableContent table={table} columnCount={columns.length} />
        {(enablePagination || enableSelection) && <TableFooter table={table} />}
      </div>
    </div>
  );
}



// Faceted Filter Component
function FacetedFilter<TData, TValue>({ column, title, options }: { column: Column<TData, TValue>, title: string, options: { value: string, label: string }[] }) {
  const selectedValues = new Set(column?.getFilterValue() as string);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-dashed">
          <Filter className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="space-y-2 p-4">
          {options.map((option) => {
            const isSelected = selectedValues.has(option.value);
            return (
              <div key={option.value} className="flex items-center space-x-2">
                <DataTableSearchFilter column={column}  />
                <Checkbox

                  checked={isSelected}
                  onChange={() => {
                    if (isSelected) {
                      selectedValues.delete(option.value);
                    } else {
                      selectedValues.add(option.value);
                    }
                    const filterValues = Array.from(selectedValues);
                    column?.setFilterValue(
                      filterValues.length ? filterValues : undefined
                    );
                  }}

                />
                <Label className="text-sm font-medium leading-none">
                  {option.label}
                </Label>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}
function DateRangePicker({dateRange , setDateRange }:{ dateRange:DateRange, setDateRange: (range: DateRange) => void}) {
  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 min-w-[240px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                </>
              ) : (
                dateRange.from.toLocaleDateString()
              )
            ) : (
              'Pick a date range'
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      {dateRange.from && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-2"
          onClick={() => setDateRange({ from: undefined, to: undefined })}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
