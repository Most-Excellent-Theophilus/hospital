import { useEffect } from "react";
import { usePostOps } from "./postop.queries";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { columns } from "./columns";
import { parseAsInteger, parseAsJson, parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";
import { type Table as TT } from "@tanstack/react-table"

import { Table, TableHeader, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableRow } from "@/components/ui/table";
import z from "zod";
import { DataTablePagination } from "../_components/data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { PostopSchema } from "@/lib/firebase/firebase.types";
// ─── ZOD SCHEMAS ─────────────────────────────────────────────────────────────
//
const SortingSchema = z.array(
  z.object({
    id: z.string(),
    desc: z.boolean(),
  })
);

const ColumnFiltersSchema = z.array(
  z.object({
    id: z.string(),
    value: z.any(),
  })
);

export const DateRangeSchema = z
  .object({
    from: z.string().nullable(),
    to: z.string().nullable(),
  })
  .refine((v) => !v.from || !v.to || new Date(v.from) <= new Date(v.to), {
    message: "From date must be before To date",
  });

export type DateRange = z.infer<typeof DateRangeSchema>;

//
// ─── REFRACTORED UPDATE HELPERS ─────────────────────────────────────────────
//
function resolveUpdater<T>(
  updater: T | ((old: T) => T),
  old: T
): T {
  return typeof updater === "function"
    ? (updater as (old: T) => T)(old)
    : updater;
}

const Post_operationModule = () => {
  const { data } = usePostOps()
  // ─── URL STATE ─────────────────────────────────────────────────────────────
  //
  const [globalFilterRaw, setGlobalFilterRaw] = useQueryState(
    "globalft",
    parseAsString.withDefault("")
  );

  const [sorting, setSorting] = useQueryState(
    "sort",
    parseAsJson(SortingSchema).withDefault([])
  );

  const [columnFilters, setColumnFilters] = useQueryState(
    "columnft",
    parseAsJson(ColumnFiltersSchema).withDefault([])
  );

  const [pageIndex, setPageIndex] = useQueryState(
    "page",
    parseAsInteger.withDefault(0)
  );

  const [pageSize, setPageSize] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10)
  );



  //
  // ─── TABLE INSTANCE ────────────────────────────────────────────────────────
  //
  const table = useReactTable({
    data: data || [],
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter: globalFilterRaw,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: (updater) => {
      const next = resolveUpdater(updater, columnFilters);
      setColumnFilters(next);
    },
    onGlobalFilterChange: setGlobalFilterRaw,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onPaginationChange: (updater: any) => {
      const next = resolveUpdater(updater, { pageIndex, pageSize });
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
  });

  useEffect(() => {
    if (!data) {
      toast.loading('Please Wait...')
    } else {
      toast.dismiss()
    }
  }, [data])
  return (
    <div className="grid mb-20">

      <DataTableToolbar
        search={setGlobalFilterRaw}
        value={globalFilterRaw}
        table={table as unknown as TT<PostopSchema & { id: string }>}
      >
        <div className="flex justify-between space-x-3.5">
          <div className="flex-1 flex items-center">
            <div className="pr-9" ><h1 className="text-3xl text-primary font-bold underline ">{data?.length} Patients </h1></div>
            <DataTablePagination count={Math.floor(Number(data?.length || 1) / pageSize)} table={table} />
          </div>
          {/* <Button onClick={() => fetchNextPage()} className="border">
            Get More Results <MoreVertical />
          </Button> */}
        </div>

      </DataTableToolbar>

      <div className="overflow-hidden rounded-md border my-4">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns?.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

    </div>
  );
};

export default Post_operationModule;