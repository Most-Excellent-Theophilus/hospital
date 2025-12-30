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

import CreateAccountPage from "./doctors.form";
import { useState } from "react";
import { DoctorFormValues } from "@/features/users/users.types";
import DoctorViewer from "./viewer";
import { useNavigationVariables } from "@/hooks/url-hooks";
import LoadingBar from "@/components/form/auth/feedback/loading.bar";

const Accounts = () => {
    const { data, } = useUsers();
    const { action, setAction, setStatus, status } = useNavigationVariables()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedUser, setSelectedDoctor] = useState<UserSchema | null>(null)



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
            setAction('new')
            setStatus('')
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
                setAction('edi')
                setStatus('')


                setIsOpen(true)

            },
            onDelete(row) {
                setSelectedDoctor(row)
                setAction('delete')
                setStatus('')


                setIsOpen(true)
            },
            onView(row) {
                setSelectedDoctor(row)
                setAction('view')
                setStatus('')


                setIsOpen(true)

            },
        }
    };


    return (<>


        {!data && <LoadingBar />}
        <GenericDataTable {...userResource} />
        <Dialog open={isOpen && status !== 'success'} onOpenChange={setIsOpen}   >


            <DialogContent className=" sm:max-w-[925px]">
                <DialogHeader>
                    <DialogTitle className="hidden">Edit profile</DialogTitle>

                </DialogHeader>
                <>
                    {action == "view" && <DoctorViewer data={selectedUser as UserSchema} onChange={setIsOpen} />}
                    {action == "delete" && <DoctorViewer data={selectedUser as UserSchema} deletee onChange={setIsOpen} />}
                    {"edit".includes(action) && <CreateAccountPage data={selectedUser as UserSchema} onChange={setIsOpen} />}
                    {action == "new" && <CreateAccountPage onChange={setIsOpen} />}
                </>


            </DialogContent>

        </Dialog>
    </>);


}

export default Accounts;