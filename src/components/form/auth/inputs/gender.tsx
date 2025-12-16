// src/components/ui/radio-group-field.tsx
"use client";

import React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UseFormReturn, Path, FieldValues } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

type RadioOption = {
  value: string;
  label: string;
  icon?: React.ReactNode; // optional icon
};

type RadioGroupFieldProps<T extends z.ZodTypeAny> = {
  control: UseFormReturn<
    z.infer<T> extends FieldValues ? z.infer<T> : never
  >["control"];
  name: Path<z.infer<T> extends FieldValues ? z.infer<T> : never>;
  label: string;
  options: RadioOption[];
  description?: string;
  className?: string;
  disabled?: boolean;

  // layout modes
  layout?: "column" | "row" | "grid";

  // grid config
  gridCols?: number;

  optional?: boolean;
};

const RadioGroupField = <T extends z.ZodTypeAny>({
  control,
  name,
  label,
  options,
  description,

  className,
  disabled,
  layout = "column",
  gridCols = 3,
}: RadioGroupFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className={cn("", className)}>
          <FormLabel className="text-muted-foreground text-xs">
            {label}{" "}
         
          </FormLabel>

          <FormControl>
            <RadioGroup
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={disabled}
              className={cn(
                layout === "column" && "flex flex-col space-y-2",
                layout === "row" &&
                  "flex flex-row space-x-4 items-center flex-wrap",
                layout === "grid" &&
                  `grid grid-cols-${gridCols} gap-3`
              )}
            >
              {options.map((option, index) => {
                const checked = field.value === option.value;

                return (
                  <label
                    key={index}
                    htmlFor={`${name}-${index}`}
                    className={cn(
                      "flex items-center space-x-2 border rounded-md px-3 py-2  cursor-pointer transition-all",

                      // selected styles
                      checked
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-muted-foreground bg-muted",

                      // error border
                      fieldState.invalid &&
                        !checked &&
                        "border-destructive/80",

                      // hover
                      "hover:bg-accent"
                    )}
                  >
                    <RadioGroupItem
                      id={`${name}-${index}`}
                      value={option.value}
                    />

                    {option.icon && (
                      <span className="text-muted-foreground">
                        {option.icon}
                      </span>
                    )}

                    <span className="text-sm capitalize">{option.label}</span>
                  </label>
                );
              })}
            </RadioGroup>
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
};

export { RadioGroupField };
