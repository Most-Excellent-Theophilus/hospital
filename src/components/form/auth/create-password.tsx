"use client";
import LogoIcon from "@/components/logo";
import z from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
// import { useTransition } from "react";

import { passwordCreateSchema } from "@/features/auth/auth.types";

import PasswordInput from "./inputs/password";
import { useTransition } from "react";
import { useQueryState } from "nuqs";
import { createPassword } from "@/features/auth/auth.actions";
import { toast } from "sonner";
import { Alerter } from "./feedback/alerter";
const alertMap: Record<"email-not-found" | "unable-to-verify", { title: string, message?: string }> = {
    "email-not-found": {
        title: 'Email Not Allowed'
    }
    ,
    "unable-to-verify": {
        title: 'Unable to connect to Our Servers'
    },

}
export default function CreatePasswordPage({ email }: { email: string }) {
    const [isPending, startTransition] = useTransition()
    const [name, setName] = useQueryState('s')

    const form = useForm<z.infer<typeof passwordCreateSchema>>({
        resolver: zodResolver(passwordCreateSchema),
        defaultValues: {
            email,
            password: "",
            passwordRepeat: '',
        },
    });
    const onSubmit = (data: z.infer<typeof passwordCreateSchema>) => {
        const id = toast.loading("Loading", {
            position: 'top-center'
        })
        startTransition(() => {
            createPassword(data).then((res) => {
                setName(res.message)
            }).finally(() => toast.dismiss(id))
        })


    };
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full items-center justify-center flex px-7"
            >
                <fieldset
                    disabled={
                        form.formState.isSubmitting
                        || isPending
                    }
                    className="min-w-[350px]"
                >
                    <div className="flex items-center space-x-2.5 ">
                        <LogoIcon className="size-9 text-primary" />
                        <h1 className="text-xl font-semibold text-primary">
                            {email} : Set Password
                        </h1>
                    </div>
                    <div className="mt-2.5 text-muted-foreground">
                        <h3 className="text-sm">Create Password</h3>
                    </div>
                    {name && <Alerter {...alertMap[name as "email-not-found" | "unable-to-verify"]} />}

                    <div className="space-y-6 mt-6">
                        <PasswordInput control={form.control} label="Password" name="password" />
                        <PasswordInput control={form.control} label="Confirm Password" name="passwordRepeat" />
                        <div className="flex justify-between">
                            <Button type="submit" size={"lg"}>
                                Continue
                            </Button>
                        </div>{" "}
                    </div>

                </fieldset>
            </form>
        </Form>
    );
}
