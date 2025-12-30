// src/components/data-table/filterFns.ts
import { FilterFn } from "@tanstack/react-table";

export const includesSome: FilterFn<any> = (
  row,
  columnId,
  filterValue
) => {
  if (!Array.isArray(filterValue) || filterValue.length === 0) {
    return true;
  }

  const rowValue = row.getValue(columnId);

  if (rowValue == null) return false;

  return filterValue.includes(rowValue);
};
