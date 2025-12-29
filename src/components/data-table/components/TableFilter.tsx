import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Column, Table } from "@tanstack/react-table";
import { CalendarIcon, Filter, X } from "lucide-react";

// ==================== Type Definitions ====================

interface DateRange {
    from: Date | undefined;
    to: Date | undefined;
}

interface FilterOption {
    label: string;
    value: string;
}

interface FacetedFilterProps<TData> {
    column: Column<TData, unknown> | undefined;
    title: string;
    options: FilterOption[];
}

interface DateRangePickerProps {
    dateRange: DateRange;
    setDateRange: (range: DateRange) => void;
}

interface ColumnFilterConfig {
    columnId: string;
    title: string;
    options: FilterOption[];
}

interface DataTableFilterBarProps<TData> {
    table: Table<TData>;
    dateRange?: DateRange;
    setDateRange?: (range: DateRange) => void;
    columnFilters?: ColumnFilterConfig[];
    globalFilter?: string;
    setGlobalFilter?: (value: string) => void;
    showDateRangePicker?: boolean;
    showClearAll?: boolean;
}

// ==================== Sub-Components ====================

/**
 * Faceted Filter Component
 * Generic component for filtering table columns with checkboxes
 */
function FacetedFilter<TData>({ 
    column, 
    title, 
    options 
}: FacetedFilterProps<TData>) {
    const selectedValues = new Set(column?.getFilterValue() as string[] | undefined);

    const handleFilterChange = (optionValue: string, isSelected: boolean) => {
        if (isSelected) {
            selectedValues.delete(optionValue);
        } else {
            selectedValues.add(optionValue);
        }
        const filterValues = Array.from(selectedValues);
        column?.setFilterValue(filterValues.length ? filterValues : undefined);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 border-dashed">
                    <Filter className="mr-2 h-4 w-4" />
                    {title}
                    {selectedValues.size > 0 && (
                        <>
                            <Separator orientation="vertical" className="mx-2 h-4" />
                            <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                                {selectedValues.size}
                            </Badge>
                            <div className="hidden space-x-1 lg:flex">
                                {selectedValues.size > 2 ? (
                                    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                                        {selectedValues.size} selected
                                    </Badge>
                                ) : (
                                    options
                                        .filter((option) => selectedValues.has(option.value))
                                        .map((option) => (
                                            <Badge
                                                variant="secondary"
                                                key={option.value}
                                                className="rounded-sm px-1 font-normal"
                                            >
                                                {option.label}
                                            </Badge>
                                        ))
                                )}
                            </div>
                        </>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
                <div className="space-y-2 p-4">
                    {options.map((option) => {
                        const isSelected = selectedValues.has(option.value);
                        return (
                            <div key={option.value} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={`filter-${option.value}`}
                                    checked={isSelected}
                                    onChange={() => handleFilterChange(option.value, isSelected)}
                                    className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                                />
                                <label 
                                    htmlFor={`filter-${option.value}`}
                                    className="text-sm font-medium leading-none cursor-pointer"
                                >
                                    {option.label}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </PopoverContent>
        </Popover>
    );
}

/**
 * Date Range Picker Component
 * Allows users to select a date range for filtering
 */
function DateRangePicker({ dateRange, setDateRange }: DateRangePickerProps) {
    return (
        <div className="flex gap-2">
            
            <Popover>
                <PopoverTrigger asChild>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 min-w-[240px] justify-start text-left font-normal"
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                            dateRange.to ? (
                                <>
                                    {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
                                </>
                            ) : (
                                dateRange.from.toLocaleDateString()
                            )
                        ) : (
                            'Pick a date range'
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        selected={{ from: dateRange.from, to: dateRange.to }}
                        onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
            {dateRange.from && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 px-2"
                    onClick={() => setDateRange({ from: undefined, to: undefined })}
                    aria-label="Clear date range"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}

// ==================== Main Component ====================

/**
 * DataTableFilterBar Component
 * 
 * A reusable, generic filter bar for data tables with support for:
 * - Date range filtering
 * - Multiple column faceted filters
 * - Clear all functionality
 * 
 * @example
 * ```tsx
 * <DataTableFilterBar
 *   table={table}
 *   dateRange={dateRange}
 *   setDateRange={setDateRange}
 *   columnFilters={[
 *     { columnId: 'status', title: 'Status', options: statusOptions },
 *     { columnId: 'priority', title: 'Priority', options: priorityOptions }
 *   ]}
 *   globalFilter={globalFilter}
 *   setGlobalFilter={setGlobalFilter}
 * />
 * ```
 */
export function DataTableFilterBar<TData>({
    table,
    dateRange,
    setDateRange,
    columnFilters = [],
    setGlobalFilter,
    showDateRangePicker = true,
    showClearAll = true,
}: DataTableFilterBarProps<TData>) {
    const hasActiveFilters = 
        table.getState().columnFilters.length > 0 || 
        (dateRange?.from !== undefined);

    const handleClearAll = () => {
        table.resetColumnFilters();
        if (setDateRange) {
            setDateRange({ from: undefined, to: undefined });
        }
        if (setGlobalFilter) {
            setGlobalFilter('');
        }
    };
 
    return (
        <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border">
            <div className="text-sm font-medium text-gray-700 mr-2">Filters:</div>

            {/* Date Range Picker */}
            {showDateRangePicker && dateRange && setDateRange && (
                <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
            )}

            {/* Column Filters */}
            {columnFilters.map((filterConfig) => {
                const column = table.getColumn(filterConfig.columnId);
                if (!column) return null;

                return (
                    <FacetedFilter
                        key={filterConfig.columnId}
                        column={column}
                        title={filterConfig.title}
                        options={filterConfig.options}
                    />
                );
            })}

            {/* Clear All Button */}
            {showClearAll && hasActiveFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearAll}
                    className="h-9"
                >
                    <X className="h-4 w-4 mr-2" />
                    Clear all
                </Button>
            )}
        </div>
    );
}

// Export sub-components for standalone use if needed
export { FacetedFilter, DateRangePicker };
export type { 
    DataTableFilterBarProps, 
    ColumnFilterConfig, 
    FilterOption, 
    DateRange,
    FacetedFilterProps,
    DateRangePickerProps
};