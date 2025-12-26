"use client";
import { GenericDataTable } from "@/components/data-table/GenericDataTable";
import { GenericDataTableProps } from "@/components/data-table/types";
import { useUsers } from "@/features/users/users.queries";
import { UserSchema } from "@/lib/firebase/firebase.types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"


import { dateUtils } from "@/lib/utils/date"
import useCreateAction from "@/hooks/use-create-action";
import CreateAccountPage from "./doctors.form";
import { useState } from "react";
import { DoctorFormValues } from "@/features/users/users.types";
import DoctorViewer from "./viewer";

const Accounts = ({ action }: { action?: string, id?: string }) => {
    const { data } = useUsers();
    const [, setAction] = useCreateAction({ key: 'action', defaultValue: '' })
    const [, setId] = useCreateAction({ key: 'id', defaultValue: '' })
    const [url, setUrl] = useCreateAction({ key: 's', defaultValue: '' })
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedUser, setSelectedDoctor] = useState<DoctorFormValues | null>(null)



    const userResource: GenericDataTableProps<UserSchema> = {
        fields: [
            {
                key: "firstName",
                label: "First Name",

                sortable: true,
                searchable: true,
            },
            {
                key: "email",
                label: "Email",
                sortable: true,
                searchable: true,
            },
            {
                key: "userType",
                label: "User Group",
                sortable: true,
                searchable: true,
            },
            {
                key: "createdAt",
                label: "Date Created",
                sortable: true,
                searchable: true,
                render(_, row) {
                    return dateUtils.timeAgo(row.createdAt)
                },
            },
            {
                key: "updatedAt",
                label: "last Update",
                sortable: true,
                searchable: true,
                render(_, row) {
                    return dateUtils.timeAgo(row.updatedAt)
                },
            },
        ],

        createNewRecordLink: () => {
            setSelectedDoctor(null)
            setUrl('')
            setIsOpen(true)
        },
        data: data || [],
        searchConfig: {
            searchableFields: ["email", "firstName"],
            defaultSearchField: "email",
        },
        actionConfig: {
            onEdit(row) {

                setSelectedDoctor(row)
                setUrl('')

                setIsOpen(true)

            },
            onDelete(row) {
                setId(row.id)
                setAction('delete')
            },
            onView(row) {
                setId(row.id)

            },
        }
    };

    if (action == 'view')
        return (<>
            <GenericDataTable {...userResource} />
            <Dialog open={isOpen && url !== 'success'} onOpenChange={setIsOpen}   >


                <DialogContent className=" sm:max-w-[925px]">
                    <DialogHeader>
                        <DialogTitle className="hidden">Edit profile</DialogTitle>

                    </DialogHeader>
                    <>
                    {/* <CreateAccountPage data={selectedUser} />  */}
                    <DoctorViewer data={selectedUser as UserSchema} deletee /></>


                </DialogContent>

            </Dialog>
        </>);


}

export default Accounts;