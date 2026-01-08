import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { CheckIcon, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/* -------------------------------------------------- */
/* Context for error state                             */
/* -------------------------------------------------- */

const PhoneInputErrorContext = React.createContext<boolean | undefined>(
  undefined
);

/* -------------------------------------------------- */
/* Main Component                                     */
/* -------------------------------------------------- */

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    value?: RPNInput.Value;
    onChange?: (value: RPNInput.Value) => void;
    error?: boolean;
  };

const PhoneInput = React.forwardRef<
  React.ElementRef<typeof RPNInput.default>,
  PhoneInputProps
>(({ className, value, onChange, error, ...props }, ref) => {
  return (
    <PhoneInputErrorContext.Provider value={error}>
      <RPNInput.default
        ref={ref}
        value={value || undefined}
        onChange={(val) => onChange?.(val!)}
        smartCaret={false}
        className={cn("flex h-10 space-x-3", className)}
        flagComponent={FlagComponent}
        inputComponent={InputComponent}
        countrySelectComponent={CountrySelect}
        {...props}
      />
    </PhoneInputErrorContext.Provider>
  );
});

PhoneInput.displayName = "PhoneInput";

/* -------------------------------------------------- */
/* Input Component (STABLE)                            */
/* -------------------------------------------------- */

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  const error = React.useContext(PhoneInputErrorContext);

  return (
    <Input
      ref={ref}
      placeholder=" "
      className={cn(
        "peer  h-10   focus-visible:ring-[1px] bg-accent/20",
        error
          ? " focus-visible:ring-destructive focus-visible:border-destructive border-destructive"
          : "focus-visible:ring-primary focus-visible:border-primary border-muted-foreground ",
        className
      )}
      {...props}
    />
  );
});

InputComponent.displayName = "InputComponent";

/* -------------------------------------------------- */
/* Country Select (STABLE)                             */
/* -------------------------------------------------- */

type CountryEntry = {
  label: string;
  value: RPNInput.Country | undefined;
};

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
  disabled,
  value,
  options,
  onChange,
}: CountrySelectProps) => {
  const error = React.useContext(PhoneInputErrorContext);
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-full border bg-muted focus-visible:ring-[1px] focus-visible:ring-primary focus-visible:border-primary border-muted-foreground",
            error ? "border-destructive" : "border-muted-foreground"
          )}
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown className="ml-1 size-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder="Search country..."
          />
          <CommandList>
            <ScrollArea ref={scrollRef} className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {options.map(
                  (opt) =>
                    opt.value && (
                      <CommandItem
                        key={opt.value}
                        className="gap-2"
                        onSelect={() => {
                          onChange(opt.value!||'MW');
                          setOpen(false);
                        }}
                      >
                        <FlagComponent
                          country={opt.value}
                          countryName={opt.label}
                        />
                        <span className="flex-1 text-sm">{opt.label}</span>
                        <span className="text-sm text-muted-foreground">
                          +{RPNInput.getCountryCallingCode(opt.value)}
                        </span>
                        <CheckIcon
                          className={cn(
                            "ml-auto size-4",
                            opt.value === value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    )
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

/* -------------------------------------------------- */
/* Flag Component                                     */
/* -------------------------------------------------- */

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];
  return (
    <span className="flex h-4  overflow-hidden rounded-sm ">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export { PhoneInput };
