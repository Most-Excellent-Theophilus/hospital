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
const htmlContentStyles = cn(
  "min-h-[200px] w-full overflow-y-auto rounded-lg border bg-background p-4",
  "[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3",
  "[&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-3",
  "[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2",
  "[&_h4]:text-xl [&_h4]:font-medium [&_h4]:mt-4 [&_h4]:mb-2",
  "[&_h5]:text-lg [&_h5]:font-medium [&_h5]:mt-3 [&_h5]:mb-1",
  "[&_h6]:text-base [&_h6]:font-medium [&_h6]:mt-3 [&_h6]:mb-1 [&_h6]:text-muted-foreground",
);

// Helper function to handle document downloads
const handleDownload = async (url: string, filename: string) => {
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
            
            <div className="grid gap-4 max-w-full overflow-x-clip">
              {/* Diagnosis Section */}
              <Section title="Diagnosis">
                <article 
                  className={htmlContentStyles}
                  dangerouslySetInnerHTML={{ __html: data.diagnosis }} 
                />
              </Section>

              {/* Vital Signs */}
              <Section title="Vital Signs" className="flex flex-wrap gap-2.5">
                {data.vitalSigns.map((sign, id) => (
                  <Badge
                    variant="outline"
                    key={id}
                    className="text-xs text-secondary-foreground"
                  >
                    {sign.name}
                  </Badge>
                ))}
              </Section>

              {/* General Information */}
              <Section title="General Information" className="grid sm:grid-cols-2 gap-2.5">
                <InfoField label="BSA" value={data.bsa} />
                <InfoField label="Priority" value={data.riskPriority} />
                <InfoField label="Hospital" value={data.hospital} />
                <InfoField label="SATS" value={data.sats} />
                <InfoField label="To Do" value={data.todo} />
                <InfoField label="Created By" value={data.staffId} />
              </Section>

              {/* Dental History */}
              <Section title="Dental History">
                <article 
                  className={htmlContentStyles}
                  dangerouslySetInnerHTML={{ __html: data.dentalHistory }} 
                />
              </Section>

              {/* Personal Information */}
              <Section title="Personal Information" className="grid sm:grid-cols-2 gap-2.5">
                <InfoField 
                  label="Full Name" 
                  value={`${data?.patient?.firstName} ${data?.patient?.middleName || ''} ${data?.patient?.lastName}`.trim()} 
                />
                <InfoField label="Email" value={data?.patient?.email} />
                <InfoField label="Phone Number" value={data?.patient?.phoneNumber} />
                <InfoField label="Gender" value={data?.patient?.gender} />
                <InfoField 
                  label="Date of Birth" 
                  value={dateUtils.formatFull(data?.patient?.dateOfBirth)} 
                />
              </Section>

              {/* Supporting Documents */}
              <Section title="Supporting Documents" className="grid sm:grid-cols-2 gap-4">
                {data.supportingDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="border p-3 rounded bg-muted/30 flex flex-col"
                  >
                    <div className="flex-1 mb-1.5">
                      <p className="font-medium text-sm mb-1">
                        {doc.name || `Document ${index + 1}`}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {doc.size}
                      </Badge>
                    </div>
                    
                    {doc.type.startsWith('image') && (
                      <div className="my-2">
                        <Image 
                          src={`/api/image?url=${encodeURIComponent(doc.ufsUrl)}`} 
                          alt={doc.name || `Document ${index + 1}`}
                          width={300} 
                          height={200}
                          className="rounded"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-4">
                      <Button 
                        size="sm" 
                        variant="link" 
                        className="text-xs"
                        onClick={() => handleDownload(doc.ufsUrl, doc.name || `document-${index + 1}`)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <a
                        href={doc.ufsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), 'text-xs')}
                      >
                        View Document 
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </div>
                  </div>
                ))}
              </Section>
            </div>
            
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