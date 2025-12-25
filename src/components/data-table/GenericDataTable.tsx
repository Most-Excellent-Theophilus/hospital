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
import React from "react";
import { GenericDataTableProps, BaseTableItem } from "./types";
import { useTableColumns } from "./hooks/useTableColumns";
import { TableTopBar } from "./components/TableTopBar";
import { TableToolbar } from "./components/TableToolbar";

import { TableContent } from "./components/TableContent";
import { TableFooter } from "./components/TableFooter";


export function GenericDataTable<T extends BaseTableItem>({
  data,
  fields,
  searchConfig,
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
  
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(
      fields.reduce((acc, field) => {
        if (field.hidden) acc[String(field.key)] = false;
        return acc;
      }, {} as VisibilityState)
    );
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchField, setSearchField] = React.useState<keyof T>(
    searchConfig?.defaultSearchField ||
      searchConfig?.searchableFields[0] ||
      ("id" as keyof T)
  );

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
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
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

      <TableToolbar
        table={table}
        searchConfig={searchConfig}
        fields={fields}
        searchField={searchField}
        onSearchFieldChange={setSearchField}
      />

     {/* <DataTableFilterToolbar  table={table}/> */}

      <div className=" px-6">
        <TableContent table={table} columnCount={columns.length} />
        {(enablePagination || enableSelection) && <TableFooter table={table} />}
      </div>
    </div>
  );
}
