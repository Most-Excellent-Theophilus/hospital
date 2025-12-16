"use client";

import { useId, useState } from "react";
import { FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, CheckIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PasswordInputFieldProps } from "./password";

const requirements = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  { regex: /[0-9]/, text: "At least 1 number" },
  {
    regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/,
    text: "At least 1 special character",
  },
];

const CreatePasswordInput = <T extends FieldValues>({
  name,
  control,
  label,
  description,
  className,
  ...props
}: PasswordInputFieldProps<T>) => {
  const [isVisible, setIsVisible] = useState(false);
  const id = useId();

  return (
    <div className="w-full space-y-2">
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const strength = requirements.map((req) => ({
            met: req.regex.test(field.value ?? ""),
            text: req.text,
          }));

          return (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    id={id}
                    type={isVisible ? "text" : "password"}
                    placeholder=""
                    className={cn(
                      "peer h-10 focus-visible:ring-[1px] bg-accent",
                      fieldState.invalid
                        ? "focus-visible:ring-destructive focus-visible:border-destructive border-destructive"
                        : "focus-visible:ring-primary focus-visible:border-primary border-muted-foreground",
                      className
                    )}
                    {...props}
                    {...field} // IMPORTANT: use RHF value correctly
                  />

                  <FormLabel
                    htmlFor="password"
                    className={cn(
                      `absolute left-3 top-3 text-sm text-muted-foreground
                                 transition-all duration-200 pointer-events-none
                                 peer-focus:-top-2.5
                                 peer-focus:border-b-2
                                 
                                 
                                 peer-focus:text-xs peer-focus:text-primary
                                 peer-focus:bg-background peer-focus:px-2 
                                 peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm
                                 peer-focus:font-medium 
                                 peer-not-placeholder-shown:-top-2.5    
                                 peer-not-placeholder-shown:text-xs 
                                 peer-not-placeholder-shown:px-2
                                 peer-not-placeholder-shown:bg-background
                                 peer-not-placeholder-shown:border-b
                 
                               `,
                      fieldState.invalid
                        ? " peer-not-placeholder-shown:border-destructive peer-focus:border-destructive "
                        : " peer-not-placeholder-shown:border-primary peer-focus:border-primary"
                    )}
                  >
                    {label}
                  </FormLabel>

                  <Button
                    type="button"
                    size="icon"
                    variant="link"
                    onClick={() => setIsVisible((v) => !v)}
                    className="absolute inset-y-0.5 right-0.5 flex items-center px-2"
                  >
                    {isVisible ? (
                      <EyeOff
                        className={cn(
                          "h-4 w-4 text-muted-foreground",
                          fieldState.invalid && "text-destructive"
                        )}
                      />
                    ) : (
                      <Eye
                        className={cn(
                          "h-4 w-4 text-muted-foreground",
                          fieldState.invalid && "text-destructive"
                        )}
                      />
                    )}
                  </Button>

                  {description && (
                    <FormDescription className="text-xs">
                      {description}
                    </FormDescription>
                  )}
                  <FormMessage className="mt-1 text-destructive text-xs" />

                  {/* Password Strength */}
                  <ul className="mt-3 space-y-0.5">
                    {strength.map((req, index) => (
                      <li key={index} className="flex items-center gap-2">
                        {req.met ? (
                          <CheckIcon className="size-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <XIcon className="size-4 text-muted-foreground" />
                        )}
                        <span
                          className={cn(
                            "text-xs",
                            req.met
                              ? "text-green-600 dark:text-green-400"
                              : "text-muted-foreground"
                          )}
                        >
                          {req.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FormControl>
            </FormItem>
          );
        }}
      />
    </div>
  );
};

export default CreatePasswordInput;
