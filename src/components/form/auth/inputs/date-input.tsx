"use client";

import { useState, useEffect } from "react";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { dateUtils } from "@/lib/utils/date";
import {
  FormLabel,
  FormMessage,
  FormDescription,
  FormItem,
  FormControl,
  FormField,
} from "@/components/ui/form";
import { Control, FieldValues, Path, useController } from "react-hook-form";
import { cn } from "@/lib/utils";

type DropDownDatePickerProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  from?: number
  def?: {
    year: number,
    month: number,
    day: number
  } | null
};

export function DropDownDatePicker<T extends FieldValues>({
  control,
  name,
  label,
  description,
  from = 0,
  def
}: DropDownDatePickerProps<T>) {
  const {
    field: { onChange },
  } = useController({ control, name });

  const currentYear = new Date().getFullYear();
  const years = dateUtils.getYearsRange(currentYear - 120, currentYear - from);
  const months = dateUtils.getMonthNames("long");

  // All fields start EMPTY
  const [year, setYear] = useState<number | "">(def?.year || "");
  const [month, setMonth] = useState<number | "">(def?.month || "");
  const [day, setDay] = useState<number | "">(def?.day || "");

  const daysInMonth =
    year !== "" && month !== ""
      ? dateUtils.getDaysInMonth(Number(year), Number(month))
      : 31;

  // Construct Date only when all fields have values
  useEffect(() => {
    if (year !== "" && month !== "" && day !== "") {
      onChange(new Date(Number(year), Number(month), Number(day)));
    } else {
      onChange(undefined); // Form value is empty
    }
  }, [year, month, day, onChange]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ fieldState }) => (
        <FormItem className="w-full ">
          <FormLabel className="text-xs m-0 p-0 text-muted-foreground">
            {label}
          </FormLabel>

          <FormControl>
            <div className="flex space-x-2 w-full">
              {/* YEAR */}
              <NativeSelect
                className={cn(
                  "bg-accent/20 ",
                  fieldState.invalid && year == ""
                    ? " border-destructive "
                    : "border-muted-foreground"
                )}
                value={year}
                onChange={(e) => {
                  setYear(e.target.value !== "" ? Number(e.target.value) : "");
                  setDay(""); // reset day on year change
                }}
              >
                <NativeSelectOptGroup label="Years">
                  {years
                    .slice()
                    .reverse()
                    .map((y) => (
                      <NativeSelectOption key={y} value={y}>
                        {y}
                      </NativeSelectOption>
                    ))}
                </NativeSelectOptGroup>
              </NativeSelect>

              {/* MONTH */}
              <NativeSelect
                className={cn(
                  "bg-accent/20 ",
                  fieldState.invalid && month == ""
                    ? " border-destructive "
                    : "border-muted-foreground"
                )}
                value={month}
                onChange={(e) => {
                  setMonth(e.target.value !== "" ? Number(e.target.value) : "");
                  setDay(""); // reset day when month changes
                }}
              >
                <NativeSelectOptGroup label="Months">
                  {months.map((m, i) => (
                    <NativeSelectOption key={i} value={i}>
                      {m}
                    </NativeSelectOption>
                  ))}
                </NativeSelectOptGroup>
              </NativeSelect>

              {/* DAY */}
              <NativeSelect
                className={cn(
                  "bg-accent/20 ",
                  fieldState.invalid && day == ""
                    ? " border-destructive "
                    : "border-muted-foreground"
                )}
                value={day}
                onChange={(e) =>
                  setDay(e.target.value !== "" ? Number(e.target.value) : "")
                }
              >
                <NativeSelectOptGroup label="Days">
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                    (d) => (
                      <NativeSelectOption key={d} value={d}>
                        {d}
                      </NativeSelectOption>
                    )
                  )}
                </NativeSelectOptGroup>
              </NativeSelect>
            </div>
          </FormControl>
          {description && (
            <FormDescription className={"text-xs"}>
              {description}
            </FormDescription>
          )}
          <FormMessage className="text-xs" />
        </FormItem>
      )}
    />
  );
}
