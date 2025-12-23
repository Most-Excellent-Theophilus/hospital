"use client";

import { Table } from "@tanstack/react-table";
import { BaseTableItem, FieldConfig, SearchConfig } from "../types";
import { TableSearchBar } from "./TableSearchBar";
import { TableColumnVisibility } from "./TableColumnVisibility";

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
        <TableColumnVisibility table={table} fields={fields} />
      </div>
    </div>
  );
}
