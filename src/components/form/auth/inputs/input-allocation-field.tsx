"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";


/* -------------------------------------------------
   Utilities
-------------------------------------------------- */



/* -------------------------------------------------
   Types
-------------------------------------------------- */

type AllocationInputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: React.ReactNode;
  description?: React.ReactNode;
  min?: number;
  max: number;
  step?: number;
  currency?: string;
  showSlider?: boolean;
  onValueChange?: (value: number) => void;
  validateValue?: (value: number) => string | null;
  className?: string;
  disabled?: boolean
};

/* -------------------------------------------------
   Component
-------------------------------------------------- */

export function AllocationInputField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  min = 0,
  max,
  step = 1,
  currency,
  showSlider = true,
  onValueChange,
  disabled,
  // validateValue,

  className,
}: AllocationInputFieldProps<T>) {
  const [focused, setFocused] = useState(false);

  const format = useCallback(
    (value: number) =>
      currency ? `${currency} ${value.toLocaleString()}` : value.toLocaleString(),
    [currency]
  );

  const parse = (value: string) =>
    Number(value.replace(/[^\d.-]/g, "")) || 0;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const numericValue = Number(field.value ?? 0);



        const sliderPercent = useMemo(() => {
          return ((numericValue - min) / (max - min)) * 100;
        }, [numericValue, min, max]);

        return (
          <FormItem className="space-y-2">

            <FormControl>
              <div className="space-y-4">
                {/* Input + Buttons */}
                <div className="flex items-center justify-between">
                  <FormLabel>{label}  </FormLabel>
                  <FormMessage />
                </div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    disabled={disabled}
                    value={
                      focused
                        ? String(numericValue)
                        : format(numericValue)
                    }
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(e) => {
                      const v = Math.min(
                        max,
                        Math.max(min, parse(e.target.value))
                      );
                      field.onChange(v);
                      onValueChange?.(v);
                    }}
                    className={cn(
                      "h-10 text-sm",
                      fieldState.invalid && "border-destructive",
                      className
                    )}
                  />


                </div>

                {showSlider && (


                  <div className="relative pt-4 pb-6">
                    <Slider
                      value={[numericValue]}
                      min={min}
                      max={max}
                      step={step}
                      disabled={disabled}

                      onValueChange={([v]) => {
                        field.onChange(v);
                        onValueChange?.(v);
                      }}
                      onPointerDown={() => setFocused(true)}
                      onPointerUp={() => setFocused(false)}
                    />

                    {focused && (
                      <div
                        className="absolute -top-4 outline rounded bg-popover px-2 py-1 text-xs shadow-md border animate-in fade-in-50"
                        style={{
                          left: `${sliderPercent}%`,
                          transform: "translateX(-50%)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {format(numericValue)} / {max}
                      </div>
                    )}
                  </div>


                )}
                {/* Slider */}
              </div>
            </FormControl>

            {description && (
              <FormDescription>{description}</FormDescription>
            )}
          </FormItem>
        );
      }}
    />
  );
}

// Usage examples and preset configurations
export const LoanAmountField = <T extends FieldValues>(
  props: Omit<AllocationInputFieldProps<T>, "max"> & { maxLoanAmount: number }
) => (
  <AllocationInputField
    {...props}
    max={props.maxLoanAmount}
    step={1000}
    currency="MWK"
    validateValue={(value) => {
      if (value < 0) return "Loan amount cannot be negative";
      if (value > props.maxLoanAmount)
        return `Loan amount cannot exceed ${props.maxLoanAmount.toLocaleString()}`;
      return null;
    }}
  />
);

export const PercentageAllocationField = <T extends FieldValues>(
  props: Omit<AllocationInputFieldProps<T>, "max" | "min" | "step">
) => (
  <AllocationInputField
    {...props}
    min={0}
    max={100}
    step={1}
    disabled={props.disabled}
    validateValue={(value) => {
      if (value < 0) return "Percentage cannot be negative";
      if (value > 100) return "Percentage cannot exceed 100%";
      return null;
    }}
  />
);

export const SharesAllocationField = <T extends FieldValues>(
  props: Omit<AllocationInputFieldProps<T>, "max"> & { maxShares: number }
) => (
  <AllocationInputField
    {...props}
    max={props.maxShares}

    validateValue={(value) => {
      if (value < 0) return "Number of shares cannot be negative";
      if (value > props.maxShares)
        return `Cannot exceed ${props.maxShares} shares`;
      if (value % 100 !== 0) return "Shares must be in increments of 100";
      return null;
    }}
  />
);
