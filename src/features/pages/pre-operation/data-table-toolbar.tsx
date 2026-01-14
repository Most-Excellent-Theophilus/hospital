"use client"

import { type Table } from "@tanstack/react-table"
import { CalendarPlus, ChevronDownIcon, Eye, Pen, Search, Trash2, TrashIcon, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


import { ButtonGroup, } from "@/components/ui/button-group"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import { DataTableFacetedFilter } from "../_components/data-table-faceted-filter"
import { genderOptions } from "../_components/data"
import { deletePreopPatient } from "./preop.actions"
import { PreOpWithPath } from "./preop.repository"



interface DataTableToolbarProps<T> {
  table: Table<PreOpWithPath>
  search: (term: string) => void, value?: string,
  children: React.ReactNode
}

export function DataTableToolbar<T>({
  table,
  search, value,
  children



}: DataTableToolbarProps<T>) {
  const path = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState<boolean>(false)
  const isFiltered = table.getState().columnFilters.length > 0
  const toggleOpen = () => setOpen((prev) => !prev)
  const ids = table.getSelectedRowModel().rows.map(r => r.original.id!)
  const selectedCount = ids.length

  const enableActions = selectedCount == 0

  const goto = (destiny: "view" | "create" | "update" | "delete" | 'pre-op') => {
    toast.loading('Loading...')
    if (destiny === 'pre-op') {
      return router.push(`/dashboard/post-operation/create?id=${encodeURIComponent(JSON.stringify(ids))}`)
    }

    if (destiny == 'delete') {
      const id2 = table.getSelectedRowModel().rows?.[0].original
      const paths = id2.path.split('/')
      if (confirm(` Want to delete? ${id2?.patient?.firstName} ${id2?.patient?.lastName}`)) {
        const id = toast.loading('Loading...')
        deletePreopPatient(paths[1], paths[3]).then((res) => {
          toast[res.status](res.message, {
            id
          })
          if (res.status == 'success') {
            router['refresh']()
          }
          setTimeout(() => {
            toast.dismiss()
          }, 2_500)
        }).catch(() => toast.error('Unable to delete Record!', {
          id
        })).finally(() => {
          setTimeout(() => {
            toast.dismiss()
          }, 2_500)
        })
      }
      return
    }
    router.push(`${path}/${destiny}?id=${encodeURIComponent(JSON.stringify(ids))}`)
  }

  return (
    <div className=" bg-secondary  rounded   w-full sticky top-0 z-5 ">

      <div className="flex items-center justify-between  p-3">
        <div className="relative flex-1 mr-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-accent" />
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

      </div>

      <div className="flex mx-3 space-x-4 mb-1">
        <ButtonGroup>
          <Button variant="outline" size={'lg'} onClick={toggleOpen} disabled={enableActions}>Actions <Badge >{selectedCount}</Badge> /  {table.getFilteredRowModel().rows.length} </Button>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild disabled={enableActions}>
              <Button variant="outline" size={'icon-lg'} className="" >
                <ChevronDownIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center"  >
              <DropdownMenuGroup>


                <DropdownMenuItem onClick={() => goto('view')} >
                  <Eye />
                  View


                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => goto('update')} >
                  <Pen />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => goto('pre-op')} disabled={selectedCount > 1} >
                  <CalendarPlus />
                  Add to Post Op
                </DropdownMenuItem>


              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>

                <DropdownMenuItem variant="destructive" onClick={() => goto('delete')}>


                  <TrashIcon />
                  Delete : {selectedCount}


                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </ButtonGroup>
        <Button size={'lg'} variant={'outline'} onClick={() => table.resetRowSelection()} disabled={!table.getIsAllPageRowsSelected() && !table.getIsSomePageRowsSelected()}>
          <Trash2 />
          Clear
        </Button>



        <div>



        </div>
      </div>
      <div className="m-3 ">{children}</div>

    </div>
  )
}
