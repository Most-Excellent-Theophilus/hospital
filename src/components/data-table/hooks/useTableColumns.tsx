import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { isEmpty } from "@/lib/utils";
import {
  ActionConfig,
  BaseTableItem,
  FieldConfig,
} from "../types";
import { SelectionCell, SelectionHeader } from "../components/TableSelectionCell";
import { TableActionsCell } from "../components/TableActionsCell";
import { DataTableColumnHeader } from "../components/TableColumnHeader";

interface Facet<T> {
  column: keyof T;
}

export function useTableColumns<T extends BaseTableItem>(
  fields: FieldConfig<T>[],
  actionConfig?: ActionConfig<T>,
  enableSelection = true,
  facets?: Facet<T>[]
) {
  return React.useMemo(() => {
    const cols: ColumnDef<T>[] = [];

    const facetedColumns = new Set(
      facets?.map((f) => String(f.column))
    );

    if (enableSelection) {
      cols.push({
        id: "select",
        header: ({ table }) => <SelectionHeader table={table} />,
        cell: ({ row }) => <SelectionCell row={row} />,
        enableSorting: false,
        enableHiding: false,
      });
    }

    fields.forEach((field) => {
      const columnId = String(field.key);
      const isFaceted = facetedColumns.has(columnId);

      cols.push({
        id: columnId,
        accessorKey: columnId,
        header: field.sortable
          ? ({ column }) => (
            <DataTableColumnHeader column={column} title={field.label} />
          )
          : field.label,
        cell: ({ row }) => {
          const value = row.getValue(columnId) as T[keyof T];
          return field.render
            ? field.render(value, row.original)
            : value;
        },
        enableSorting: field.sortable || false,
        filterFn: isFaceted ? "arrIncludesSome" : undefined,
        size: field.width ? parseInt(field.width) : undefined,
      });

    });

    if (!isEmpty(actionConfig)) {
      cols.push({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <TableActionsCell
            row={row.original}
            actionConfig={actionConfig!}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    return cols;
  }, [fields, actionConfig, enableSelection, facets]);
}
