"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import React from "react";
import { cn } from "@/lib/utils/index";
import { Textarea } from "@/components/ui/textarea";

type AddressInputFieldProps<T extends FieldValues> = {
    control: Control<T>;
    name: Path<T>;
    label: React.ReactNode;
    placeholder?: string;
    description?: string;
} & React.ComponentProps<"textarea">;
const AddressInput = <T extends FieldValues>({
    name,
    control,
    label,
    description,
    className,
    ...props
}: AddressInputFieldProps<T>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem className="w-full">
                    <FormControl>
                        <div className="relative">
                            <Textarea
                                id="name"

                                placeholder="" // needed for peer-placeholder-shown
                                className={cn(
                                    "peer  h-10   focus-visible:ring-[1px] resize-none",
                                    fieldState.invalid
                                        ? " focus-visible:ring-destructive focus-visible:border-destructive border-destructive"
                                        : "focus-visible:ring-primary focus-visible:border-primary border-muted-foreground ",
                                    className
                                )}
                                {...props}
                                {...field}
                            />
                            <FormLabel
                                htmlFor="email"
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
                            {/* Description */}
                            {description && (
                                <FormDescription className="text-xs">
                                    {description}
                                </FormDescription>
                            )}
                            <FormMessage className="mt-1 text-destructive text-xs" />
                        </div>
                    </FormControl>
                </FormItem>
            )}
        />
    );
};

export default AddressInput;
