import { ColumnDef } from "@tanstack/react-table";

import {  isEmpty } from "@/lib/utils";
import React from "react";
import {
  ActionConfig,
  BaseTableItem,
  FieldConfig,
} from "../types";
import { SelectionCell, SelectionHeader } from "../components/TableSelectionCell";
import { TableActionsCell } from "../components/TableActionsCell";
import { DataTableColumnHeader } from "../components/TableColumnHeader";

export function useTableColumns<T extends BaseTableItem>(
  fields: FieldConfig<T>[],
  actionConfig?: ActionConfig<T>,
  enableSelection = true
) {
  return React.useMemo(() => {
    const cols: ColumnDef<T>[] = [];

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
      cols.push({
        id: String(field.key),
        accessorKey: String(field.key),
        header: field.sortable
          ? ({ column }) => (
              <DataTableColumnHeader column={column} title={field.label} />
            )
          : field.label,
        cell: ({ row }) => {
          const value = row.getValue(String(field.key)) as T[keyof T];
          return field.render
            ? field.render(value, row.original)
            : value;
        },
        enableSorting: field.sortable || false,
        size: field.width ? parseInt(field.width) : undefined,
      });
    });

    if (!isEmpty(actionConfig)) {
      cols.push({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <TableActionsCell row={row.original} actionConfig={actionConfig!} />
        ),
        enableSorting: false,
        enableHiding: false,
      });
    }

    return cols;
  }, [fields, actionConfig, enableSelection]);
}