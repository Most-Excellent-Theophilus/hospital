import { DataTableColumnHeader } from "@/components/data-table/components/TableColumnHeader";
import { SelectionCell, SelectionHeader } from "@/components/data-table/components/TableSelectionCell";
import { UserSchema } from "@/lib/firebase/firebase.types";
import { dateUtils } from "@/lib/utils/date";
import { ColumnDef } from "@tanstack/react-table";
import { genderOptions } from "../_components/data";
import { MinusCircle } from "lucide-react";
import { cn, trimAndEllipsis } from "@/lib/utils";

export const columns: ColumnDef<UserSchema>[] = [
  {
    id: "select",
    header: ({ table }) => <SelectionHeader table={table} />,
    cell: ({ row }) => <SelectionCell row={row} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="FirstName" />,
    cell: ({ row }) => (

      <div className="font-medium">{row.getValue("firstName")}</div>
    ),
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "gender",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Gender" />,
    cell: ({ row }) => {

      const Icon = genderOptions.findLast((gender) => gender.value == row.getValue('gender'))?.icon || MinusCircle
      return <Icon className={cn("size-5",
        row.getValue('gender') == 'male' && "text-blue-600",
        row.getValue('gender') == 'female' && "text-pink-500",
        row.getValue('gender') == 'other' && "text-accent",

      )} />
    },
    filterFn: (row, id, value: string[]) => {
      if (!value?.length) return true;
      return value.includes(row.getValue(id));
    }
  },
  {
    accessorKey: "doctorId",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Doctor" />,
    cell: ({ row }) => trimAndEllipsis(row.getValue('doctorId')),

  },
  {
    accessorKey: "dateOfBirth",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date Of Birth" />,

    cell: ({ row }) => dateUtils.formatDateLong(row.getValue("dateOfBirth"))


  },




]

