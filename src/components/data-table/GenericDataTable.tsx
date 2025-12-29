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
} from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import { GenericDataTableProps, BaseTableItem } from "./types";
import { useTableColumns } from "./hooks/useTableColumns";
import { TableTopBar } from "./components/TableTopBar";


import { TableContent } from "./components/TableContent";
import { TableFooter } from "./components/TableFooter";

import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { DataTableFilterBar } from "./components/TableFilter";
import { toDate } from "@/lib/utils/date";


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
  const [dateRange, setDateRange] = useState<{ from: Date | undefined, to: Date | undefined }>({ from: undefined, to: undefined });


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
  const filteredPatients = useMemo(() => {
    if (!dateRange.from && !dateRange.to) return data;

    return data.filter((patient) => {
      const createdDate = toDate(patient.createdAt);
      if (dateRange.from && createdDate! < dateRange.from) return false;
      if (dateRange.to && createdDate! > dateRange.to) return false;
      return true;
    });
  }, [data, dateRange]);
  const table = useReactTable({
    data: filteredPatients,
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

      <div className="flex items-center gap-2 px-6 py-2">
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

      <div className="px-6 py-2">  <DataTableFilterBar
        table={table}
        dateRange={dateRange}
        setDateRange={setDateRange}
        columnFilters={[
          { columnId: 'gender', title: 'Status', options: [{ label: "Male", value: "male" }, { value: "female", label: "Female" }] },
          // { columnId: 'doctorEmail', title: 'Priority', options: [{}] }
        ]}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      /></div>

      <div className=" px-6">
        <TableContent table={table} columnCount={columns.length} />
        {(enablePagination || enableSelection) && <TableFooter table={table} />}
      </div>
    </div>
  );
}



