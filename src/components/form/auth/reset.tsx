"use client";

import LogoIcon from "@/components/logo";
import z from "zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import EmailUserNameInput from "./inputs/email-username";
import { Alerter } from "./feedback/alerter";

import { verificationSchema } from "@/features/auth/auth.types";
import { setResetPassword } from "@/features/auth/auth.actions";
import { useQueryState } from "nuqs";
import { toast } from "sonner";
import { useOtpTimer } from "@/hooks/use-otp-timer";

/* ---------------------------------- */
/* Alerts */
/* ---------------------------------- */

type AlertKey =
  | "email-not-found"
  | "email-sent"
  | "unable-to-send"
  | "unable-to-set"
  | "something-wrong";

const ALERTS: Record<
  AlertKey,
  { title: string; message?: string; variant: "default" | "destructive" }
> = {
  "email-not-found": {
    title: "Email Not Allowed",
    variant: "destructive",
  },
  "email-sent": {
    title: "We have sent you an email",
    message: "Check your inbox to continue",
    variant: "default",
  },
  "unable-to-send": {
    title: "Unable to send email",
    variant: "destructive",
  },
  "unable-to-set": {
    title: "Unable to process request",
    variant: "destructive",
  },
  "something-wrong": {
    title: "Unable to connect to our servers",
    variant: "destructive",
  },
};

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */

export default function ResetPage() {
  const [timer, setTimer] = useState<number>(0)
  const [status, setStatus] = useQueryState("s");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { email: "" },
  });

  /* ---------------------------------- */
  /* Reset logic (single source of truth) */
  /* ---------------------------------- */

  const requestReset = async () => {
    const valid = await form.trigger("email");
    if (!valid) return;

    const toastId = toast.loading("Please wait...", {
      position: "top-center",
    });

    try {
      const res = await setResetPassword(form.getValues("email"));
      setStatus(res.message as AlertKey);
    } catch {
      setStatus("something-wrong");
    } finally {
      toast.dismiss(toastId);
    }
  };

  /* ---------------------------------- */
  /* OTP cooldown */
  /* ---------------------------------- */

  const {
    timeLeft,
    isWaiting,
    isResending,

  } = useOtpTimer({
    duration: timer,
    onResend: requestReset,
  });

  /* ---------------------------------- */
  /* Submit */
  /* ---------------------------------- */

  const onSubmit = () => {
    startTransition(async () => {

      await requestReset().finally(() => setTimer(60));
    });
  };

  const isLocked =
    form.formState.isSubmitting ||
    isPending ||
    isResending || isWaiting;

  /* ---------------------------------- */
  /* UI */
  /* ---------------------------------- */

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-center px-7"
      >
        <fieldset disabled={isLocked} className="min-w-[350px]">
          {/* Header */}
            <LogoIcon className=" text-primary" />
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-semibold text-primary">
              Reset Password
            </h1>
          </div>

          <p className="mt-2.5 text-sm text-muted-foreground">
            Reset Password
          </p>

          {/* Alert */}
          {status && <Alerter {...ALERTS[status as AlertKey]} />}

          {/* Form */}
          <div className="mt-6 space-y-6">
            <EmailUserNameInput
              control={form.control}
              name="email"
              label="Email"
              className="bg-accent"
            />

            <div className="flex justify-between">
              {isWaiting ? (
                <p className="text-sm text-destructive">
                  Resend available in {timeLeft}s
                </p>
              ) : (
                <Button type="submit" size="lg">
                  {(isPending || isResending) && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Reset Password
                </Button>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 border bg-muted p-3 rounded-(--radius)">
            <p className="text-center text-sm text-accent-foreground">
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
