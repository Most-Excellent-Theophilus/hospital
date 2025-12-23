"use client";

import z from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import TextInput from "@/components/form/auth/inputs/text-input";
import { DropDownDatePicker } from "@/components/form/auth/inputs/date-input";
import { RadioGroupField } from "@/components/form/auth/inputs/gender";
import EmailUserNameInput from "@/components/form/auth/inputs/email-username";
import { registrationSchema as userSchema } from "@/features/users/users.types";
import { useCreateUser } from "@/features/users/users.mutations";

import { toast } from "sonner";
import useCreateAction from "@/hooks/use-create-action";

export default function CreateAccountPage({ data }: { data?: z.infer<typeof userSchema> }) {
    const createUser = useCreateUser()
    const [_, setAction] = useCreateAction({ key: 'action', defaultValue: '' })

    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: data || {
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

    const onSubmit = (data: z.infer<typeof userSchema>) => {
        const id = toast.loading("Please wait...", {
            position: 'top-center'
        })

        createUser.mutate(data, {
            onSuccess: (value) => {
                const { status, message } = value

                toast[status](message, { id })
                setAction('view')
            },
            onError: () => {
                toast.error("Something went wrong", { id })
            },
            onSettled: () => {
                toast.dismiss(id)

            },
        })
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full items-center justify-center flex px-7   mt-8"
            >
                <fieldset disabled={form.formState.isSubmitting}>
                    <div>
                        <div className="flex items-center space-x-2.5">

                            <h1 className="text-xl font-semibold text-primary">
                                Create Doctor account
                            </h1>
                        </div>

                        <div className="mt-2.5 text-muted-foreground">
                            <h3 className="text-sm">Get started</h3>
                        </div>
                    </div>
                    {/* <pre
                        className="whitespace-pre-wrap text-sm leading-relaxed"
                        suppressHydrationWarning
                    >{JSON.stringify(form.watch(), null, 2)}</pre> */}

                    {/* Grid layout */}
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
                            <RadioGroupField<typeof userSchema>
                                layout="row"
                                label="Rights"
                                name="userType"
                                control={form.control}
                                options={[
                                    { value: "admin", label: "Administrator" },
                                    { value: "inputer", label: "Editor" },
                                    { value: "view", label: "Readonly" },
                                ]}
                            />
                            <RadioGroupField<typeof userSchema>
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
                        <Button type="submit" size="lg" className="">
                            Create Account
                        </Button> <Button type="button" size="lg" variant={'secondary'} onClick={() => form.reset()}>
                            Clear
                        </Button>

                    </div>


                </fieldset>
            </form>
        </Form>
    );
}
