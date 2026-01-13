import { DataTableColumnHeader } from "@/components/data-table/components/TableColumnHeader";
import { SelectionCell, SelectionHeader } from "@/components/data-table/components/TableSelectionCell";
import { PreopSchema } from "@/lib/firebase/firebase.types";
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

export const columns: ColumnDef<PreopSchema>[] = [
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
      const { original: data } = row
      return <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button variant="link">{data?.patient?.firstName} {data?.patient?.lastName}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[925px] max-h-11/12 overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{data?.patient?.firstName} {data?.patient?.lastName}</DialogTitle>

            </DialogHeader>
            <div className="grid gap-4">
              <Section title="Diagnosis">
                <article dangerouslySetInnerHTML={{ __html: data.diagnosis }} />
              </Section>
              <Section title="Vital Signs" className="grid sm:grid-cols-2 gap-2.5">
                {data.vitalSigns.map((sign, id) => <InfoField key={id + sign.name} label={`Sign ${id + 1}`} value={sign.name} />)}
              </Section>
              <Section title="" className="grid sm:grid-cols-2 gap-2.5"><InfoField label="BSA" value={data.bsa} />
                <InfoField label="Priority" value={data.riskPriority} />
                <InfoField label="Hospital" value={data.hospital} />
                <InfoField label="SATS" value={data.sats} />
                <InfoField label="TO DO" value={data.todo} />
                <InfoField label="Created By" value={data.staffId} />
              </Section>

              {/* <InfoField label="" value={data.} /> */}
              <Section title="Dental History">
                <article className={cn(
                  "min-h-[200px]  rounded border bg-background p-2",
                  "min-h-screen w-full overflow-y-auto rounded-lg border bg-background p-4 ",

                  "[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3",
                  "[&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-3",
                  "[&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2",
                  "[&_h4]:text-xl [&_h4]:font-medium [&_h4]:mt-4 [&_h4]:mb-2",
                  "[&_h5]:text-lg [&_h5]:font-medium [&_h5]:mt-3 [&_h5]:mb-1",
                  "[&_h6]:text-base [&_h6]:font-medium [&_h6]:mt-3 [&_h6]:mb-1 [&_h6]:text-muted-foreground",

                )} dangerouslySetInnerHTML={{ __html: data.dentalHistory }} />
              </Section>
              <Section title="Fersonal Info" className="grid sm:grid-cols-2 gap-2.5">
                <InfoField label="FullName" value={`${data?.patient?.firstName} ${data?.patient?.middleName} ${data?.patient?.lastName} `} />
                <InfoField label="Email" value={`${data?.patient?.email} `} />
                <InfoField label="Phone Number" value={`${data?.patient?.phoneNumber} `} />
                <InfoField label="Gender" value={`${data?.patient?.dateOfBirth} `} />
              </Section>
              <Section title="Supporting Documents" className="grid sm:grid-cols-2">
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
                    {doc.type.startsWith('image') && <Image src={`/api/image?url=${encodeURIComponent(doc.ufsUrl)}`} alt="" width={300} height={200} />}
                    <div className="flex items-center justify-between mt-4">
                      <Button size={'sm'} variant={'link'} className="text-xs"><Download />Download</Button>
                      <a
                        href={doc.ufsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(buttonVariants({ variant: "ghost" }), 'text-xs')}
                      >
                        View Document <ExternalLink className="w-3 h-3" />
                      </a></div>


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
        </form>
      </Dialog>
    }
  },


  {
    accessorKey: "gender",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Gender" />,
    cell: ({ row }) => {

      const Icon = genderOptions.findLast((gender) => gender.value == row.original?.patient?.gender)?.icon || MinusCircle
      return <Icon className={cn("size-5",
        row.original?.patient?.gender == 'male' && "text-blue-600",
        row.original?.patient?.gender == 'female' && "text-pink-500",
        row.original?.patient?.gender == 'other' && "text-accent",

      )} />
    },
    filterFn: (row, id, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.original?.patient?.gender) || false;

    }
  },
  {
    accessorKey: "hospital",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Hospital" />,
    cell: ({ row }) => row.original.hospital,

  }, {
    accessorKey: "dateOfBirth",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date Of Birth" />,

    cell: ({ row }) => dateUtils.formatDateLong(row.original?.patient?.dateOfBirth)


  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date " />,

    cell: ({ row }) => dateUtils.formatFull(row.original.createdAt),
  },



]

