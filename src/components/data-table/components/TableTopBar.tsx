"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Table } from "@tanstack/react-table";
import { TablePaginationControls } from "./TablePaginationControls";

interface TableTopBarProps<T> {
  table: Table<T>;
  createNewRecordLink: string;
  enablePagination: boolean;
}

export function TableTopBar<T>({
  table,
  createNewRecordLink,
  enablePagination,
}: TableTopBarProps<T>) {
  return (
    <div className="flex px-4 py-3 w-full justify-between bg-accent border-b sticky top-0 z-50">
      <Button className="bg-green-800" size="lg" asChild>
        <Link href={createNewRecordLink}>
          <Plus />
          <span>New</span>
        </Link>
      </Button>
      {enablePagination && <TablePaginationControls table={table} />}
    </div>
  );
}
