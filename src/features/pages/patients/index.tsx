"use client";

import { useQueryState, parseAsJson, parseAsString, parseAsInteger } from "nuqs";
import { usePatients } from "./patient.queries";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,

  useReactTable,

} from "@tanstack/react-table";
import { z } from "zod";
import { columns } from "./columns";
import { DataTableToolbar } from "../_components/data-table-toolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "../_components/data-table-pagination";
import { toast } from "sonner";
import { useEffect } from "react";
import LoadingPage from "@/components/loadingpage";
// import { PatientCards } from "./card-display";

const sortingSchema = z.array(
  z.object({
    id: z.string(),
    desc: z.boolean(),
  })
);


const columnFiltersSchema = z.array(
  z.object({
    id: z.string(),
    value: z.any(),
  })
);


// 1. Define a zod schema for your query state
export const DateRangeSchema = z
  .object({
    from: z.string().nullable(),
    to: z.string().nullable(),
  })
  .refine((v) => !v.from || !v.to || new Date(v.from) <= new Date(v.to), {
    message: "From date must be before To date",
  });


export type DateRange = z.infer<typeof DateRangeSchema>;
const PatientsModule = () => {
  const { data } = usePatients();

  const [globalFilterRaw, setGlobalFilterRaw] = useQueryState(
    "globalft",
    parseAsString.withDefault("")
  );


  const [sorting, setSorting] = useQueryState(
    "sort",
    parseAsJson(sortingSchema).withDefault([])
  );




  const [columnFilters, setColumnFilters] = useQueryState(
    "columnft",
    parseAsJson(columnFiltersSchema).withDefault([])
  );

  const [pageIndex, setPageIndex] = useQueryState(
    "page",
    parseAsInteger.withDefault(0)
  );
  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10)
  );



  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: globalFilterRaw, // note: use RAW
      pagination: { pageIndex, pageSize }
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: (value) => setGlobalFilterRaw(value), // debounced
    onPaginationChange: (updater) => {
      const next = typeof updater === "function"
        ? updater({ pageIndex, pageSize })
        : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),


  });



  if (!data) return <LoadingPage />


  return <div className="grid mb-20">
{/* <PatientCards table={table}/> */}
    <DataTableToolbar search={setGlobalFilterRaw} value={globalFilterRaw} table={table} />
    <div className="overflow-hidden rounded-md border my-4">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <DataTablePagination table={table} />
  </div>

  
};

export default PatientsModule;
