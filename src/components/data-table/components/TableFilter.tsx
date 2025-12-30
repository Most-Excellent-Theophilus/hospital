import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Column, Table } from "@tanstack/react-table";
import { CalendarIcon, Filter, X } from "lucide-react";
import { DataTableFacetedFilter as FacetedFilter } from "./TableFaceted";
import { dateUtils } from "@/lib/utils/date";
import { DataTableMultiSelectFilter } from "./TableMultiSelectFilter";

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
    facets?: FacetedFilterProps<TData>[]

    globalFilter?: string;
    setGlobalFilter?: (value: string) => void;
    showDateRangePicker?: boolean;
    showClearAll?: boolean;
}

// ==================== Sub-Components ====================

/**
 * Faceted Filter Component
 * Generic component for filtering table columns with checkboxes

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
                                    From:    {dateUtils.formatDate(dateRange.from)} - To: {dateUtils.formatDate(dateRange.to)}
                                </>
                            ) : (
                                dateUtils.formatDate(dateRange.from)
                            )
                        ) : (
                            'Pick a date range'
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="range"
                        captionLayout="dropdown"
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
    facets,
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
        <div className="flex flex-wrap items-center gap-2 p-3  rounded-lg border">
            <div className="text-sm font-medium  mr-2">Filters:</div>

            {/* Date Range Picker */}
            {facets?.map((facet, id) => (<FacetedFilter  {...facet} key={id} />))}
            {/* {facets?.map((facet, id) => (<DataTableMultiSelectFilter   {...facet} key={id} />))} */}
            {showDateRangePicker && dateRange && setDateRange && (
                <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
            )}

{/* <DataTableMultiSelectFilter  /> */}

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
export { DateRangePicker };
export type {
    DataTableFilterBarProps,
    ColumnFilterConfig,
    FilterOption,
    DateRange,
    FacetedFilterProps,
    DateRangePickerProps
};