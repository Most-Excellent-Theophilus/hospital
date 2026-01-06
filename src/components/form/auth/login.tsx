"use client";

import LogoIcon from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useQueryState } from "nuqs";
import z from "zod";

import EmailUserNameInput from "./inputs/email-username";
import PasswordInput from "./inputs/password";
import { Alerter } from "./feedback/alerter";

import { Login, loginSchema } from "@/features/auth/auth.types";
import { checkEmail, login } from "@/features/auth/auth.actions";
import { useOtpTimer } from "@/hooks/use-otp-timer";
import { useDeviceInfo } from "@/hooks/use-device-info";
import { useDeviceVendor } from "@/hooks/use-device-vendor";

/* ---------------------------------- */
/* Alert Configuration */
/* ---------------------------------- */

type AlertKey =
  | "password"
  | "verify"
  | "email-not-found"
  | "email-or-password"
  | "invalid-fields"
  | "something-wrong";

const ALERTS: Record<AlertKey, { title: string; message?: string, variant: "destructive" | "default" }> = {
  password: {
    title: "Proceed to login",
    message: "Enter your password to continue",
    variant: "default"
  },
  verify: {
    title: "We have sent you an email",
    message: "Check your inbox to continue",
    variant: "default"

  },
  "email-not-found": {
    title: "Email not allowed",
    variant: "destructive"

  },
  "email-or-password": {
    title: "Email or password is incorrect",
    variant: "destructive"

  },
  "invalid-fields": {
    title: "Invalid email or password",
    variant: "destructive"

  },
  "something-wrong": {
    title: "Unable to connect to our servers",
    variant: "destructive"

  },
};

/* ---------------------------------- */
/* Component */
/* ---------------------------------- */

export default function LoginPage() {
  const [status, setStatus] = useQueryState("s");
  const [isPending, startTransition] = useTransition();
  const [timer, setTimer] = useState<number>(0)
  const info = useDeviceInfo()
  const vendor = useDeviceVendor()
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* ---------------------------------- */
  /* Email Validation + OTP Cooldown */
  /* ---------------------------------- */

  const validateEmail = async () => {
    const isValid = await form.trigger("email");

    if (!isValid) {
      setStatus("invalid-fields");
      return;
    }

    try {
      const res = await checkEmail(form.getValues("email"));
      if (res.message == 'verify') {
        setTimer(60)
      }
      setStatus(res.message as AlertKey);
    } catch {
      setStatus("something-wrong");
    }
  };

  const {
    timeLeft,
    isWaiting,
    isResending,
    resend: retryEmail,
  } = useOtpTimer({
    duration: timer,
    onResend: validateEmail,
  });

  /* ---------------------------------- */
  /* Login Submit */
  /* ---------------------------------- */

  const handleLogin = (data: Login) => {
    startTransition(async () => {
      try {
        const res = await login(data, { ...info, ...vendor });
        setStatus(res.message as AlertKey);
      } catch {
        setStatus("something-wrong");
      }
    });
  };

  /* ---------------------------------- */
  /* UI */
  /* ---------------------------------- */

  const isLocked =
    form.formState.isSubmitting ||
    isPending ||
    isResending ||
    (isWaiting && status !== "password");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleLogin)}
        className="flex justify-center px-7"
      >
        <fieldset disabled={isLocked} className="min-w-[350px]">
          {/* Header */}
            <LogoIcon className=" text-primary"  />
          <div className="flex items-center space-x-2.5">
            <h1 className="text-xl font-semibold text-primary">Log In</h1>
          </div>

          <p className="mt-2.5 text-sm text-muted-foreground">
            Hearts 4 Mission International
          </p>

          {/* Alert */}
          {status && <Alerter {...ALERTS[status as AlertKey]} />}

          {/* Inputs */}
          <div className="space-y-6 mt-6">
            <EmailUserNameInput
              control={form.control}
              name="email"
              label="Email"
              className="bg-accent"
            />

            {status === "password" && (
              <PasswordInput
                control={form.control}
                name="password"
                label="Password"
                className="bg-accent"
              />
            )}

            {/* Actions */}

            {/* Cooldown */}
            {isWaiting ? (
              <p className="text-sm text-destructive">
                Resend available in {timeLeft}s
              </p>
            ) : <div className="flex justify-between">
              {status === "password" ? (
                <Button type="submit" size="lg" className="w-full">
                  {isLocked && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign In
                </Button>
              ) : (
                <Button type="button" className="w-1/2" onClick={retryEmail}>
                  {isLocked && (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Next
                </Button>
              )}
            </div>
            }
          </div>

          {/* Footer */}
          <div className="mt-4 border bg-muted p-3 rounded-(--radius)">
            <p className="text-center text-sm text-accent-foreground" >
              Forgot Password?{" "}
              <Link href="/reset" className="underline text-primary">
                Reset
              </Link>
            </p>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
