"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Eye, MoreHorizontal, Pen, Trash } from "lucide-react";
import { ActionConfig, BaseTableItem } from "../types";

interface TableActionsCellProps<T extends BaseTableItem> {
  row: T;
  actionConfig: ActionConfig<T>;
}

export function TableActionsCell<T extends BaseTableItem>({
  row,
  actionConfig,
}: TableActionsCellProps<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actionConfig.onCopy && (
          <DropdownMenuItem onClick={() => actionConfig.onCopy!(row)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </DropdownMenuItem>
        )}
        <DropdownMenuLabel>Menu</DropdownMenuLabel>
        {(actionConfig.onView ||
          actionConfig.onEdit ||
          actionConfig.onDelete) && <DropdownMenuSeparator />}

        {actionConfig.onView && (
          <DropdownMenuItem onClick={() => actionConfig.onView!(row)}>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
        )}

        {actionConfig.onEdit && (
          <DropdownMenuItem onClick={() => actionConfig.onEdit!(row)}>
            <Pen className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
        )}

        {actionConfig.onDelete && (
          <DropdownMenuItem
            onClick={() => actionConfig.onDelete!(row)}
            className="text-destructive focus:text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        )}

        {actionConfig.customActions && actionConfig.customActions.length > 0 && (
          <>
            <DropdownMenuSeparator />
            {actionConfig.customActions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => action.onClick(row)}
                className={
                  action.variant === "destructive"
                    ? "text-destructive focus:text-destructive"
                    : ""
                }
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
