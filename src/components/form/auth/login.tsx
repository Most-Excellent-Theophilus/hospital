"use client";
import LogoIcon from "@/components/logo";
import z from "zod";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
// import { useTransition } from "react";
import EmailUserNameInput from "./inputs/email-username";
import PasswordInput from "./inputs/password";
import { loginSchema } from "@/schemas/user";

export default function LoginPage() {
  // const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = () => {};
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full items-center justify-center flex px-7"
      >
        <fieldset
          disabled={
            form.formState.isSubmitting
            // || isPending
          }
          className="min-w-[350px]"
        >
          <div className="flex items-center space-x-2.5 ">
            <LogoIcon className="size-9 fill-primary" />
            <h1 className="text-xl font-semibold text-primary">Log In</h1>
          </div>
          <div className="mt-2.5 text-muted-foreground">
            <h3 className="text-sm">Connect With Clarity</h3>
          </div>
          <div className="space-y-6 mt-6">
            {/* Username */}
            <EmailUserNameInput
              control={form.control}
              label="Email"
              name="email"
              className=" bg-accent"
            />
            {/* Password */}
            <div>
              <PasswordInput
                control={form.control}
                label={"Password"}
                className="bg-accent"
                name="password"
              />
              <div className="flex w-full mt-1 justify-end">
                <Link
                  href="/reset"
                  className={"text-xs     underline   text-primary"}
                >
                  {" "}
                  Forgot Password?
                </Link>
              </div>
            </div>
            <div className="flex justify-between">
              <Button type="submit" size={"lg"} className="w-full m-0">
                Sign In
              </Button>
            </div>{" "}
          </div>
          <div className="bg-muted rounded-(--radius) border p-3 mt-4">
            <p className="text-accent-foreground text-center text-sm">
              <a href="https://samuelmkamamnga.tech" className="text-primary">
                {"Powereb by Samuel Mkamanga.tech"}
              </a>
            </p>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
