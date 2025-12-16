"use client";

import { Control, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils/index";

export type PasswordInputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: React.ReactNode;
  placeholder?: string;
  description?: React.ReactNode;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
const PasswordInput = <T extends FieldValues>({
  name,
  control,
  label,
  description,
  className,
  ...props
}: PasswordInputFieldProps<T>) => {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormControl>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="" // needed for peer-placeholder-shown
                className={cn(
                  "peer  h-10   focus-visible:ring-[1px]",
                  fieldState.invalid
                    ? " focus-visible:ring-destructive focus-visible:border-destructive border-destructive"
                    : "focus-visible:ring-primary focus-visible:border-primary border-muted-foreground ",
                  className
                )}
                {...props}
                {...field}
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
                variant={"link"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute border-primary inset-y-0.5 right-0.5 flex items-center px-2"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff
                    className={cn(
                      "h-4 w-4 text-muted-foreground",
                      fieldState.invalid && " text-destructive"
                    )}
                  />
                ) : (
                  <Eye
                    className={cn(
                      "h-4 w-4 text-muted-foreground",
                      fieldState.invalid && " text-destructive"
                    )}
                  />
                )}
              </Button>

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

export default PasswordInput;
