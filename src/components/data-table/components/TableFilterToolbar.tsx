"use client";

import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

import { DataTableFacetedFilter } from "./TableFacetedFilter";
import { DataTableDateFilter} from "./TableDateFilter";
import { useTableFilters } from "./../hooks/useTableFilters";

interface DataTableFilterToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableFilterToolbar<TData>({
  table,
}: DataTableFilterToolbarProps<TData>) {
  const { isFiltered, resetFilters } = useTableFilters(table);

  return (
    <div className="flex items-center justify-between">
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
    </div>
  );
}
