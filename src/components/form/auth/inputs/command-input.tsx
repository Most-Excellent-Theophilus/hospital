"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Path, FieldValues, UseFormReturn } from "react-hook-form";

type CommandOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

type CommandSelectFieldProps<T extends z.ZodTypeAny> = {
  control: UseFormReturn<
    z.infer<T> extends FieldValues ? z.infer<T> : never
  >["control"];
  name: Path<z.infer<T> extends FieldValues ? z.infer<T> : never>;
  label: string;
  options: CommandOption[];
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function CommandSelectField<T extends z.ZodTypeAny>({
  control,
  name,
  label,
  options,
  description,
  placeholder = "Select an option",
  disabled,
  className,
}: CommandSelectFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selected = options.find(
          (option) => option.value === field.value
        );

        return (
          <FormItem className={className}>
            <FormLabel className="text-xs text-muted-foreground">
              {label}
            </FormLabel>

            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    className={cn(
                      "w-full justify-between h-10 bg-accent",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      {selected?.icon}
                      {selected?.label ?? placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>

              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>

                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => {
                            field.onChange(option.value);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === option.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />

                          {option.icon && (
                            <span className="mr-2">{option.icon}</span>
                          )}

                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {description && (
              <FormDescription>{description}</FormDescription>
            )}
            <FormMessage className="text-xs" />
          </FormItem>
        );
      }}
    />
  );
}
