"use client";

import { Table } from "@tanstack/react-table";
import { BaseTableItem, FieldConfig, SearchConfig } from "../types";
import { TableSearchBar } from "./TableSearchBar";
import { TableColumnVisibility } from "./TableColumnVisibility";
import { useTableFilters } from "../hooks/useTableFilters";
import { DataTableFacetedFilter } from "./TableFacetedFilter";
import { DataTableDateFilter } from "./TableDateFilter";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TableToolbarProps<T extends BaseTableItem> {
  table: Table<T>;
  searchConfig?: SearchConfig<T>;
  fields: FieldConfig<T>[];
  searchField: keyof T;
  onSearchFieldChange: (field: keyof T) => void;
}

export function TableToolbar<T extends BaseTableItem>({
  table,
  searchConfig,
  fields,
  searchField,
  onSearchFieldChange,
}: TableToolbarProps<T>) {
  const { isFiltered, resetFilters } = useTableFilters(table);
  if (!searchConfig || searchConfig.searchableFields.length === 0) {
    return null;
  }

  return (
    <div className="w-full px-6">
      <div className="grid sm:flex items-center py-4 gap-4 justify-between">
        <TableSearchBar
          table={table}
          searchConfig={searchConfig}
          fields={fields}
          searchField={searchField}
          onSearchFieldChange={onSearchFieldChange}
        />
        <div className="flex flex-1 items-center space-x-2">
          {/* Search filter */}


          {/* Faceted filters */}
          {/* {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="Status"
            options={[
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
              { label: "Pending", value: "pending" },
            ]}
          />
        )} */}

          {table.getColumn("userType") && (
            <DataTableFacetedFilter
              column={table.getColumn("userType")}
              title="User Type"
              options={[
                { label: "Admin", value: "admin" },
                { label: "Inputer", value: "inputer" },
                { label: "Viewer", value: "viewer" },
              ]}
            />
          )}

          {/* Date filter */}
          {table.getColumn("createdAt") && (
            <DataTableDateFilter
              column={table.getColumn("createdAt")}
              title="Created"
            />
          )}

          {/* Reset filters button */}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <TableColumnVisibility table={table} fields={fields} />
      </div>
    </div>
  );
}
