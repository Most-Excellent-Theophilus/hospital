// src/components/data-table/filterFns.ts
import { FilterFn } from "@tanstack/react-table";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
