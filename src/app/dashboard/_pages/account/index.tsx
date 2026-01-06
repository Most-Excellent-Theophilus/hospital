"use client";
import { GenericDataTable } from "@/components/data-table/GenericDataTable";
import { usePatients as useUsers } from "@/features/patient/patient.queries";
import { PatientSchema as UserSchema } from "@/lib/firebase/firebase.types";




import { dateUtils } from "@/lib/utils/date"





const Accounts = () => {
    const { data, } = useUsers();






    return (<>


        <GenericDataTable<UserSchema>
            data={data || []}
            pageSize={30}

            createNewRecordLink={() => {


            }}
            actionConfig={{
                onEdit(row) {



                },
                onDelete(row) {



                },
                onView(row) {


                },
            }}
            facets={[{
                column: 'gender',
                title: 'Gender',
                options: [
                    {
                        label: 'Male',
                        value: 'male'
                    },
                    {
                        label: 'Female',
                        value: 'female'
                    },
                    {
                        label: 'Other',
                        value: 'other'
                    },
                ]
            }]}
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
                }, {
                    key: 'gender',
                    label: "Gender",
                    render: (value,) => {
                        return <>  {value}</>
                    },
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
                        return dateUtils.formatDate(row.createdAt)
                    },
                },
                {
                    key: "updatedAt",
                    label: "last Update",
                    sortable: true,
                    // searchable: true,
                    render(_, row) {
                        return dateUtils.formatDate(row.updatedAt)
                    },
                },
            ]}

        />

    </>);


}

export default Accounts;