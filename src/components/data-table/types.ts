// ============================================================================
// FILE: types.ts
// ============================================================================

import React from "react";

export interface BaseTableItem {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface FieldConfig<T extends BaseTableItem> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  searchable?: boolean;
  hidden?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  width?: string;
}

export interface ActionConfig<T extends BaseTableItem> {
  onCopy?: (row: T) => void;
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  customActions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: (row: T) => void;
    variant?: "default" | "destructive";
  }>;
}

export interface SearchConfig<T extends BaseTableItem> {
  searchableFields: Array<keyof T>;
  placeholder?: string;
  defaultSearchField?: keyof T;
}

export interface GenericDataTableProps<T extends BaseTableItem> {
  data: T[];
  fields: FieldConfig<T>[];
  searchConfig?: SearchConfig<T>;
  actionConfig?: ActionConfig<T>;
  enableSelection?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  onSelectionChange?: (selectedRows: T[]) => void;
  createNewRecordLink: ()=> void;
}
