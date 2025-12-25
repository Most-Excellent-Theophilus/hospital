"use client";
import LogoIcon from "@/components/logo";
import z from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react"
import EmailUserNameInput from "./inputs/email-username";
import PasswordInput from "./inputs/password";
import { Login, loginSchema } from "@/features/auth/auth.types";
import { useQueryState } from "nuqs";
import { checkEmail, login } from "@/features/auth/auth.actions";

import { useTransition } from "react";

import { Alerter } from "./feedback/alerter";
const alertMap: Record<"password" | "something-wrong" | "email-not-found" | "verify" | "invalid-fields" | "email-not-found" | "email-or-password", { title: string, message?: string }> = {
  "email-not-found": { title: 'Email Not Allowed' },
  "something-wrong": { title: 'Unable to connect to Our Servers' },
  password: { title: "Proceed to login", message: 'Enter Password to complete this Process' },
  verify: { title: 'We Have Sent You an Email', message: 'Check Your InBox' },
  "email-or-password": {
    title: "Email or Password is Incorrect"
  },
  "invalid-fields": {
    title: "Invalid Email or Password"
  }
}
export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useQueryState('s')
  const form = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "", }, });
  const onSubmit = (data: Login) => {
    startTransition(() => {
      login(data).then((res) => {
        setName(res.message)
      }).catch(() => setName('something-wrong'))
    })

  }; const checkThisEmail = () => { startTransition(() => form.trigger('email').then(value => { if (value) { checkEmail(form.watch('email')).then(data => { setName(data.message) }) } })) }
  return (<Form {...form}> <form onSubmit={form.handleSubmit(onSubmit)} className="w-full items-center justify-center flex px-7" > <fieldset disabled={form.formState.isSubmitting || isPending} className="min-w-[350px]" > <div className="flex items-center space-x-2.5 "> <LogoIcon className="size-9 text-primary" /> <h1 className="text-xl font-semibold text-primary">Log In</h1> </div> <div className="mt-2.5 text-muted-foreground"> <h3 className="text-sm">Hearts 4 mission International</h3> </div> {name && <Alerter {...alertMap[name as "password" | "something-wrong" | "email-not-found" | "verify"]} />} <div className="space-y-6 mt-6"> {/* Username */} <EmailUserNameInput control={form.control} label="Email" name="email" className=" bg-accent" /> {name == 'password' && <div> <PasswordInput control={form.control} label={"Password"} className="bg-accent" name="password" /> </div>} <div className="flex justify-between"> {name == 'password' ? <Button type="submit" size={"lg"} className="w-full m-0"> Sign In </Button> : <Button type="button" className="w-1/2" onClick={checkThisEmail}>{isPending && <Loader2 className="animate-spin" />} Next</Button>} </div>{" "} </div> <div className="bg-muted rounded-(--radius) border p-3 mt-4"> <p className="text-accent-foreground text-center text-sm"> Forgot Password?{" "} <Link href="/reset" className={"text-sm underline text-primary"} > {" Reset"} </Link>
  </p>
  </div>
  </fieldset>
  </form>
  </Form>);
}


