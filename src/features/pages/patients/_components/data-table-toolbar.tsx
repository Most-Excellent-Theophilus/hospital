"use client"

import { type Table } from "@tanstack/react-table"
import { AlertTriangleIcon, Archive, CheckIcon, ChevronDownIcon, CopyIcon, Eye, Pen, Plus, Search, ShareIcon, TrashIcon, UserRoundXIcon, VolumeOffIcon, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { genderOptions } from "./data"
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText, } from "@/components/ui/button-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { FaFileExcel } from "react-icons/fa"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { PatientSchema } from "@/lib/firebase/firebase.types"
import { exportCSVTable } from "@/lib/utils/export-table.csv"


interface DataTableToolbarProps {
  table: Table<PatientSchema>
}

export function DataTableToolbar({
  table,
  search, value


}: DataTableToolbarProps & { search: (term: string) => void, value?: string, }) {

  const [open, setOpen] = useState<boolean>(false)
  const isFiltered = table.getState().columnFilters.length > 0
  const toggleOpen = () => setOpen((prev) => !prev)
  const ids = table.getSelectedRowModel().rows.map(r => r.original.id)
  const selectedCount = ids.length

  const showActions = !!selectedCount
  const path = usePathname()
  return (
    <div className=" bg-secondary  rounded   w-full sticky top-0 z-5 ">

      <div className="flex items-center justify-between  p-3">
        <div className="relative flex-1 mr-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or ID..."
            value={value ?? ''}
            onChange={(e) => search(e.target.value)}
            className="pl-10 h-10 bg-accent/40"
          />
        </div>
        <div className="flex flex-1 items-center gap-2">

          {table.getColumn("gender") && (
            <DataTableFacetedFilter
              column={table.getColumn("gender")}
              title="Gender"
              options={genderOptions}
            />
          )}


          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.resetColumnFilters()}
            >
              Reset
              <X />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">

          <Button size="lg" >
            <Plus />
            Add
          </Button>
        </div>
      </div>

      {showActions && <div className="flex mx-3 mb-1"><ButtonGroup>
        <Button variant="outline" onClick={toggleOpen}>Actions <Badge >{selectedCount}</Badge></Button>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="!pl-2">
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center"  >
            <DropdownMenuGroup>


              <DropdownMenuItem asChild>
                <Link href={`${path}/view?id=${encodeURIComponent(JSON.stringify(ids))}`}><Eye />
                  View
                </Link>

              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`${path}/update?id=${encodeURIComponent(JSON.stringify(ids))}`}>
                  <Pen />
                  Edit
                </Link>

              </DropdownMenuItem>
              {selectedCount > 1 ? <DropdownMenuItem onClick={() => {
                exportCSVTable(table, "patients",ids)
              }}>
                <FaFileExcel />
                Export to Excel
              </DropdownMenuItem> : null}

            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>


                <span><Archive />Archive : {selectedCount}</span>

              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" asChild>


                <span>
                  <TrashIcon />
                  Delete : {selectedCount}
                </span>

              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup></div>}
    </div>
  )
}
