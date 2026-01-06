"use client";


import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import TextInput from "@/components/form/auth/inputs/text-input";
import { DropDownDatePicker } from "@/components/form/auth/inputs/date-input";
import { RadioGroupField } from "@/components/form/auth/inputs/gender";
import EmailUserNameInput from "@/components/form/auth/inputs/email-username";
import { DoctorFormValues, registrationSchema, } from "@/features/users/users.types";
import { useCreateUser } from "@/features/users/users.mutations";

import { toast } from "sonner";

import { Alerter } from "@/components/form/auth/feedback/alerter";
import { checkUserEmail, updateDoctor } from "@/features/users/users.actions";
import { useTransition } from "react";
import { toDate } from "@/lib/utils/date";
import { UserSchema } from "@/lib/firebase/firebase.types";
import {
    useQueryState,
    parseAsArrayOf,
    parseAsString,
} from "nuqs";



const alertMap: Record<"email-not-found" | "email-taken" | 'failed-to-update' | 'success', { title: string, message?: string, variant?: "default" | "destructive" | null | undefined }> = {
    "email-not-found": {
        title: 'Email Not Allowed',
        variant: 'destructive',
    }
    ,
    "email-taken": {
        variant: 'destructive',
        title: 'Email is taken'
    },
    "success": {
        variant: 'default',
        title: 'Updated Succefully'
    },
    "failed-to-update": {
        variant: 'destructive',
        title: 'Unable to Update'
    },

}
export default function CreateAccountPage({ data, onChange }: { data?: UserSchema | null, onChange: (value: boolean) => void; }) {
    const createUser = useCreateUser()
    const [isPending, startTransition] = useTransition()
    const [status, setStatus] = useQueryState('state',)



    const form = useForm<DoctorFormValues>({
        resolver: zodResolver(registrationSchema),
        defaultValues: data ? { ...data, dateOfBirth: toDate(data.dateOfBirth) } : {
            firstName: "",
            lastName: "",
            customGender: '',
            email: "",
            doctorId: '',
            middleName: '',
            dateOfBirth: undefined,
            userType: "viewer",
        },
    });

    const onSubmit = (dataT: DoctorFormValues) => {
        const id = toast.loading("Please wait...", {
            position: 'top-center'
        })
        startTransition(() => {
            const fn = () => {
                if (data) {
                    updateDoctor(data.id, { ...dataT, dateOfBirth: dataT.dateOfBirth.toISOString() } as UserSchema).then((res) => {

                        if (res.data?.id) {
                            setStatus("success")
                            onChange(false)
                        } else {
                            setStatus("failed-to-update")
                        }
                    }).finally(() => toast.dismiss(id))
                } else {
                    checkUserEmail(dataT.email).then((da) => {
                        if (da.data?.[0]) {
                            setStatus("email-taken")
                            toast.dismiss(id)
                            return
                        }

                        createUser.mutate({ ...dataT, dateOfBirth: dataT.dateOfBirth.toISOString() }, {
                            onSuccess: (value) => {
                                const { status, message } = value

                                toast[status](message, { id })
                                setStatus("success")

                            },
                            onError: () => {
                                toast.error("Something went wrong", { id })
                            },
                            onSettled: () => {
                                toast.dismiss(id)

                            },
                        })
                    }).finally(() => toast.dismiss(id))
                }
            }
            fn()
        })

    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full items-center justify-center flex px-7   mt-8"
            >
                <fieldset disabled={form.formState.isSubmitting || isPending}>
                    <div>
                        <div className="flex items-center space-x-2.5">

                            <h1 className="text-xl font-semibold text-primary">
                                {data ? "Update" : "Create"} Doctor {data && `: ${data.firstName} ${data.lastName}`}
                            </h1>
                        </div>

                        <div className="mt-2.5 text-muted-foreground">
                            <h3 className="text-sm">{data ? "Update Fields" : "Get started"}</h3>
                        </div>
                    </div>

                    {/* Grid layout */}
                    {status && <Alerter {...alertMap[status as "email-not-found" | "email-taken"]} />}

                    <div className="mt-6 mb-7 grid sm:grid-cols-2 gap-6 ">
                        <div className="space-y-3 flex flex-col ">
                            <div className="flex space-x-3">
                                <TextInput
                                    control={form.control}
                                    label="First Name"
                                    name="firstName"
                                    className="bg-accent"
                                />

                                <TextInput
                                    control={form.control}
                                    label="Last Name"
                                    name="lastName"
                                    className="bg-accent"
                                />
                            </div>
                            <TextInput
                                control={form.control}
                                label="Middle Name"
                                name="middleName"
                                className="bg-accent"
                            />


                            <DropDownDatePicker
                                control={form.control}
                                label="BirthDay"
                                name="dateOfBirth"
                                def={data?.dateOfBirth ? {
                                    year: toDate(data.dateOfBirth)?.getFullYear() || 2007,
                                    month: toDate(data.dateOfBirth)?.getMonth() || 1,
                                    day: toDate(data.dateOfBirth)?.getDay() || 1,
                                } : null}
                                from={18}

                            />
                        </div>

                        <div className="space-y-3 flex flex-col ">
                            <div>
                                <EmailUserNameInput
                                    control={form.control}
                                    label="Email"
                                    name="email"
                                    className="bg-accent"
                                />
                            </div>
                            <TextInput
                                control={form.control}
                                label="Doctor Id"
                                name="doctorId"
                                className="bg-accent "
                            />
                            <RadioGroupField<typeof registrationSchema>
                                layout="row"
                                label="Rights"
                                name="userType"
                                control={form.control}
                                options={[
                                    { value: "admin", label: "Administrator" },
                                    { value: "inputer", label: "Editor" },
                                    { value: "viewer", label: "Readonly" },
                                ]}
                            />
                            <RadioGroupField<typeof registrationSchema>
                                layout="row"
                                label="Gender"
                                name="gender"
                                control={form.control}
                                options={[
                                    { value: "male", label: "Male" },
                                    { value: "female", label: "Female" },
                                    { value: "other", label: "Other" },
                                ]}
                            />

                            {form.watch("gender") == "other" && (
                                <div className="mt-1">
                                    <TextInput
                                        control={form.control}
                                        label="Specify Gender"
                                        name="customGender"
                                        className="bg-accent"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-between">
                        <Button type="button" size="lg" variant={'secondary'} onClick={() => form.reset()}>
                            Clear
                        </Button>
                        <Button type="submit" size="lg" className=" ">
                            {data ? "Update" : "Create"} Account
                        </Button>
                    </div>
                </fieldset>
            </form>
        </Form>
    );
}