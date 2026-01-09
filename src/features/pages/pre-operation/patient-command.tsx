"use client"

import * as React from "react"
import {
    Plus,
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,

} from "@/components/ui/command"
import { Button } from "@/components/ui/button"

import { usePatientsCommand } from "./preop.queries"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { usePathname, useRouter } from "next/navigation"
import LoadingPage from "@/components/loadingpage"
export function PatientCommand() {
    const [open, setOpen] = React.useState(false)
    const { data } = usePatientsCommand()
    const path = usePathname()
    const router = useRouter()
    React.useEffect(() => {

        const down = (e: KeyboardEvent) => {
            if (e.key === "a" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])


    const navigate = (id: string) => {
        toast.loading('Please wait')
        router.push(`${path}/create?id=${id}`)
    }
  if (!data) return <div><LoadingPage /></div> 

    return (
        <>
            <Button onClick={() => {
                setOpen(true)
            }} size={'lg'}> <Plus />Add Patient<kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
                    <span className="text-xs">⌘</span>A
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput

                    placeholder="Search First Name, Last Name , email or Phone number..." />
                <CommandList>
                    <CommandEmpty> Start Typing..</CommandEmpty>
                    <CommandGroup heading={`${data?.length} Patients `}>

                        {data?.map((row, i) => <CommandItem key={row?.id} className="cursor-pointer"

                            value={`${row.firstName} ${row.lastName} ${row.phoneNumber} ${row.id}`}>
                            <button onClick={() => { return confirm(`Want to add ${row.firstName} ${row.lastName} to Pre Operation`) && navigate(row.id) }} className="space-x-1.5 justify-between w-full items-center ">
                                <div className="flex  gap-1  justify-between">

                                    <Label className="cursor-pointer font-medium">
                                        <span className="   text-xs">{1 + i}.</span>
                                        {row.firstName} {row.lastName}
                                    </Label>
                                    <Badge variant={'outline'}>
                                        {row.phoneNumber}
                                    </Badge>
                                </div>
                                <span className="text-xs justify-between flex-row-reverse text-muted-foreground flex">
                                    {row.email}
                                    <i className="text-xs">Id: {row.id}</i>
                                </span>
                            </button>


                        </CommandItem>)}




                    </CommandGroup>


                </CommandList>
            </CommandDialog>
        </>
    )
}
