import { Table } from "@tanstack/react-table";

export function useTableFilters<TData>(table: Table<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const resetFilters = () => {
    table.resetColumnFilters();
  };

  const getActiveFilters = () => {
    return table.getState().columnFilters;
  };

  return {
    isFiltered,
    resetFilters,
    activeFilters: getActiveFilters(),
  };
}