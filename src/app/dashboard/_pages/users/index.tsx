"use client";
import { GenericDataTable } from "@/components/data-table/GenericDataTable";
import { GenericDataTableProps } from "@/components/data-table/types";
import { useUsers } from "@/features/users/users.queries";
import { UserSchema } from "@/lib/firebase/firebase.types";
import user from "@/data/users.json";


import { dateUtils } from "@/lib/utils/date"
import useCreateAction from "@/hooks/use-create-action";
import CreateAccountPage from "./doctors.form";
const Accounts = ({ action }: { action?: string, id?: string }) => {
    const { data } = useUsers();
    const [, setAction] = useCreateAction({ key: 'action', defaultValue: '' })



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
                    return dateUtils.timeAgo(row.updatedAt)
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

            setAction('new')

        },
        data: data ? data : user as unknown as UserSchema[],
        searchConfig: {
            searchableFields: ["email", "firstName"],
            defaultSearchField: "email",
        },
    };

    if (action == 'view')
        return (<GenericDataTable {...userResource} />);
    if (action == 'new')
        // create doctor form 
        return <CreateAccountPage />
}

export default Accounts;