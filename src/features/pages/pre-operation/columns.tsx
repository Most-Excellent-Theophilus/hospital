"use client"
import { DataTableColumnHeader } from "@/components/data-table/components/TableColumnHeader";
import { SelectionCell, SelectionHeader } from "@/components/data-table/components/TableSelectionCell";
import { dateUtils } from "@/lib/utils/date";
import { ColumnDef } from "@tanstack/react-table";
import { genderOptions } from "../_components/data";
import { Download, ExternalLink, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { InfoField, Section } from "@/components/review-componemts";
import { Badge } from "@/components/ui/badge";
import { PreOpWithPath } from "./preop.repository";

// Shared className for HTML content styling
export const htmlContentStyles = cn(
  "min-h-[200px] w-full overflow-y-auto rounded-lg border bg-background p-4",
  "[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3",
  "[&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-3",
  "[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2",
  "[&_h4]:text-xl [&_h4]:font-medium [&_h4]:mt-4 [&_h4]:mb-2",
  "[&_h5]:text-lg [&_h5]:font-medium [&_h5]:mt-3 [&_h5]:mb-1",
  "[&_h6]:text-base [&_h6]:font-medium [&_h6]:mt-3 [&_h6]:mb-1 [&_h6]:text-muted-foreground",
);

// Helper function to handle document downloads
export const handleDownload = async (url: string, filename: string) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download failed:', error);
  }
};

export const columns: ColumnDef<PreOpWithPath>[] = [
  {
    id: "select",
    header: ({ table }) => <SelectionHeader table={table} />,
    cell: ({ row }) => <SelectionCell row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "patient",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Full Name" />,
    cell: ({ row }) => {
      const { original: data } = row;
      const fullName = `${data?.patient?.firstName} ${data?.patient?.lastName}`;
      
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link">{fullName}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[925px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{fullName}</DialogTitle>
            </DialogHeader>
            
     
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }
  },

  {
    accessorKey: "gender",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Gender" />,
    cell: ({ row }) => {
      const gender = row.original?.patient?.gender;
      const Icon = genderOptions.find((g) => g.value === gender)?.icon || MinusCircle;
      
      return (
        <Icon 
          className={cn(
            "size-5",
            gender === 'male' && "text-blue-600",
            gender === 'female' && "text-pink-500",
            gender === 'other' && "text-accent",
          )} 
          aria-label={gender || 'Unknown gender'}
        />
      );
    },
    filterFn: (row, id, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original?.patient?.gender);
    }
  },

  {
    accessorKey: "hospital",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Hospital" />,
    cell: ({ row }) => row.original.hospital,
  },

  {
    accessorKey: "dateOfBirth",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date of Birth" />,
    cell: ({ row }) => dateUtils.formatDateLong(row.original?.patient?.dateOfBirth)
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date Created" />,
    cell: ({ row }) => dateUtils.formatFull(row.original.createdAt),
  },
]