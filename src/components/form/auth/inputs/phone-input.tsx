"use client";

import * as React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  // FormLabel,

  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { PhoneInput } from "@/components/ui/phone-input";
import type { Value as PhoneValue } from "react-phone-number-input";

type PhoneInputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: React.ReactNode;
  description?: string;
  disabled?: boolean;
  className?: string;
};

const PhoneInputField = <T extends FieldValues>({
  control,
  name,
  // label,
  description,
  disabled,
  className,
}: PhoneInputFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormControl>
            <div className="relative">
              <PhoneInput
                {...field}
                value={(field.value ?? "") as PhoneValue}
                // onChange={(val) => field.onChange(val ?? "")}
                error={fieldState.invalid}
                disabled={disabled}
                international
                defaultCountry="MW"
                className={cn("peer", className)}
              />

              {/* <FormLabel
                className={cn(
                  `absolute left-20 top-3 text-sm text-muted-foreground
                   transition-all duration-200 pointer-events-none
                   peer-focus:-top-2.5 peer-focus:text-xs peer-focus:bg-background
                   peer-focus:px-2 peer-not-placeholder-shown:-top-2.5
                   peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:bg-background
                   peer-not-placeholder-shown:px-2`,
                  fieldState.invalid
                    ? "text-destructive"
                    : "peer-focus:text-primary"
                )}
              >
                {label}
              </FormLabel> */}

              {description && (
                <FormDescription className="text-xs">
                  {description}
                </FormDescription>
              )}

              <FormMessage className="mt-1 text-xs" />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default PhoneInputField;
