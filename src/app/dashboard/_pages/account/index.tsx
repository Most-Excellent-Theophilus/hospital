"use client";
import { GenericDataTable } from "@/components/data-table/GenericDataTable";
import { GenericDataTableProps } from "@/components/data-table/types";
import { usePatients as useUsers } from "@/features/patient/patient.queries";
import { PatientSchema as UserSchema } from "@/lib/firebase/firebase.types";


import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"


import { dateUtils } from "@/lib/utils/date"


import { useState } from "react";


import { useNavigationVariables } from "@/hooks/url-hooks";
import CreatePatientPage from "./patient.form";
import PatientViewer from "./patients.view";
import LoadingBar from "@/components/form/auth/feedback/loading.bar";


const Accounts = () => {
    const { data, } = useUsers();
    const { action, setAction, setStatus, status } = useNavigationVariables()
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedUser, setSelectedDoctor] = useState<UserSchema | null>(null)




    return (<>

        {!data && <LoadingBar />}
        <GenericDataTable data={data || []}
            pageSize={30}
            createNewRecordLink={()=>{}}
            actionConfig={{
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
            }}
            fields={[
                {
                    key: "firstName",
                    label: "First Name",

                    sortable: true,
                    // searchable: true,
                },
                {
                    key: "email",
                    label: "Email",
                    sortable: true,
                    // searchable: true,
                },

                {
                    key: "documents",
                    label: "Documents",
                    sortable: true,
                    // searchable: true,
                    render(_, row) {
                        return row.documents.length
                    },
                },
                // { key:'gender', label:'Gender'},
                {
                    key: "documents",
                    label: "Date Created",
                    sortable: true,
                    // searchable: true,
                    render(_, row) {
                        return dateUtils.formatDateShort(row.createdAt)
                    },
                },
                {
                    key: "updatedAt",
                    label: "last Update",
                    sortable: true,
                    // searchable: true,
                    render(_, row) {
                        return dateUtils.timeAgo(row.updatedAt)
                    },
                },
            ]} />
        <Dialog open={isOpen && status !== 'success'} onOpenChange={setIsOpen}   >


            <DialogContent className=" sm:max-w-[925px] max-h-[90dvh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="hidden">Edit profile</DialogTitle>

                </DialogHeader>
                <>
                    {action == "view" && <PatientViewer data={selectedUser as UserSchema} onChange={setIsOpen} />}
                    {action == "delete" && <PatientViewer data={selectedUser as UserSchema} deletee onChange={setIsOpen} />}
                    {/* {"edit".includes(action) && <CreatePatientPage data={selectedUser as PatientSchema} onChange={setIsOpen} />} */}
                    {action == "new" && <CreatePatientPage onChange={setIsOpen} />}
                </>


            </DialogContent>

        </Dialog>
    </>);


}

export default Accounts;