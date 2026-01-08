"use client"
import { Table } from "@tanstack/react-table";
import { PatientSchema } from "../firebase/firebase.types";

export function exportCSVTable(table: Table<PatientSchema>, name: string, ids?: string[]) {
    const rows = table.getSelectedRowModel().rows.length
        ? table.getSelectedRowModel().rows.filter(f => ids?.includes(f.original.id)).map(r => r.original)
        : table.getRowModel().rows.map(r => r.original);

    const headers = Object.keys(rows[0] ?? {});
    const csv = [
        headers.join(","),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...rows.map(r => headers.map(h => JSON.stringify((r as any)[h] ?? "")).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.csv`;
    a.click();
}
