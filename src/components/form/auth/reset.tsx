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
import { verificationSchema } from "@/schemas/user";

export default function ResetPage() {
  // const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      email: "",
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
            <h1 className="text-xl font-semibold text-primary">
              Reset Password
            </h1>
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
            <div className="flex justify-between">
              <Button type="submit" size={"lg"}>
                Reset Password
              </Button>
            </div>{" "}
          </div>
          <div className="bg-muted rounded-(--radius) border p-3 mt-4">
            <p className="text-accent-foreground text-center text-sm">
              Have an account?
              <Button asChild variant="link" className="px-2">
                <Link href="/login">Login</Link>
              </Button>
            </p>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
