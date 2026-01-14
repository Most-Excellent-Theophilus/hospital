"use client";


import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { DropDownDatePicker } from "@/components/form/auth/inputs/date-input";


import { toast } from "sonner";

import { Alerter } from "@/components/form/auth/feedback/alerter";

import { useTransition } from "react";
import {
    useQueryState,
} from "nuqs";
import { postOpSchema, PostOpSchema } from "../postop.types";
import { PreOpWithPath } from "../../pre-operation/preop.repository";
import { useSharedState } from "@/components/providers/dashboard-context";

import TextEditor from "@/components/form/auth/inputs/Text-editor";
import AddressInput from "@/components/form/auth/inputs/address-input";
import { toDate } from "@/lib/utils/date";
import { createPostOp } from "../postop.actions";


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
export default function CreatePostOp({ data, }: { data: PreOpWithPath }) {

    const [isPending, startTransition] = useTransition()
    const [status] = useQueryState('state',)
    const { doctorId, email, firstName, lastName, middleName } = useSharedState().value


    const form = useForm<PostOpSchema>({
        resolver: zodResolver(postOpSchema),
        defaultValues: {
            dosage: '',
            instructions: '',
            labResults: '',
            name: '',
            targetINR: "",
            procedure: "",
            preOpId: data.id,
            doctor: { doctorId, email, firstName, lastName, middleName },
            patient: { ...data.patient, dateOfBirth: toDate(data.patient.dateOfBirth) }

        },
    });

    const onSubmit = (dataT: PostOpSchema) => {
        const id = toast.loading("Please wait...", {
            position: 'top-center'
        })
        startTransition(() => {

            createPostOp(data.path, dataT).then((res) => {
                if (res.status == 'success') {
                    toast[res.status]('Succefully Created!', { id })
                }
                toast[res.status](res.message, { id })
            }).catch((err: Error) => toast.error(err?.message, { id })).finally(() => setTimeout(() => {
                toast.dismiss()
            }, 2500))
        })

    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full     mt-8"
            >
                <fieldset disabled={form.formState.isSubmitting || isPending}>
                    <div>
                        <div className=" items-center space-x-2.5">

                            <h1 className="text-xl font-semibold text-primary">
                                {data && ` ${data.patient.firstName} ${data.patient.lastName}`}
                            </h1>
                        </div>


                    </div>

                    {/* Grid layout */}
                    {/* {JSON.stringify(form.formState.errors)} */}
                    {status && <Alerter {...alertMap[status as "email-not-found" | "email-taken"]} />}
                    <div className="space-y-6 mb-4  ">

                        <div className="flex mt-2.5">

                            <DropDownDatePicker
                                control={form.control}
                                label="Echo Date"
                                name="echoDate"

                                from={0}

                            />
                            <DropDownDatePicker
                                control={form.control}
                                label="Date Of Operation"
                                name="operationDate"

                                from={0}

                            />
                        </div>
                        <div className="flex space-x-4 space-y-4 flex-wrap" >
                            <AddressInput control={form.control} name="procedure" label="Procedure" />
                            <AddressInput control={form.control} name="name" label="Name" />
                            <AddressInput control={form.control} name="targetINR" label="Target INR" />
                        </div>
                        <TextEditor control={form.control} name="dosage" placeholder="Dosage..." label={<p className="text-2xl font-bold">Dosage</p>} />
                        <TextEditor control={form.control} name="labResults" placeholder="Lab Results..." label={<p className="text-2xl font-bold">Lab Results</p>} />

                        <TextEditor control={form.control} name="instructions" placeholder="Instructions..." label={<p className="text-2xl font-bold">Instructions</p>} />
                    </div>


                    <div className="flex justify-between">
                        <Button type="button" size="lg" variant={'secondary'} onClick={() => form.reset()}>
                            Clear
                        </Button>
                        <Button type="submit" size="lg" className=" ">
                            Submit
                        </Button>
                    </div>
                </fieldset>
            </form>
        </Form>
    );
}