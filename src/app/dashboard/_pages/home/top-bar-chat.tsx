import React, { useState, useMemo } from 'react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';


import {
  Calendar as CalendarIcon,
  Search,
  X,
  FileText,
  Venus,
  Mars,
  Sigma
} from 'lucide-react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { dateUtils, toDate } from '@/lib/utils/date';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { usePatients } from '@/features/patient/patient.queries';
import { PatientSchema } from '@/lib/firebase/firebase.types';
import LoadingBar from '@/components/form/auth/feedback/loading.bar';
import { capitalizeFirstLetter } from '@/lib/utils';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LabelList, Pie, PieChart } from 'recharts';
import { ChartLineMultiple } from './line-chart';


// Type definitions

export const TIMELINES = {
  today: {
    label: "Today",
    days: 0,
  },
  yesterday: {
    label: "Yesterday",
    days: 1,
  },
  lastWeek: {
    label: "Last 7 days",
    days: 7,
  },
  lastMonth: {
    label: "Last 30 days",
    days: 30,
  },
  last3Months: {
    label: "Last 3 months",
    months: 3,
  },
  last6Months: {
    label: "Last 6 months",
    months: 6,
  },
  lastYear: {
    label: "Last year",
    years: 1,
  },
  last2Years: {
    label: "Last 2 years",
    years: 2,
  },
  last5Years: {
    label: "Last 5 years",
    years: 5,
  },
  last10Years: {
    label: "Last 10 years",
    years: 10,
  },
  last15Years: {
    label: "Last 15 years",
    years: 15,
  },
  last20Years: {
    label: "Last 20 years",
    years: 20,
  },
  last30Years: {
    label: "Last 30 years",
    years: 30,
  },
  last40Years: {
    label: "Last 40 years",
    years: 40,
  },
  last50Years: {
    label: "Last 50 years",
    years: 50,
  },
  last80Years: {
    label: "Last 80 years",
    years: 80,
  },
  last100Years: {
    label: "Last 100 years",
    years: 100,
  },
} as const;
export type TimelineType = keyof typeof TIMELINES;

const timelines: TimelineType[] = ["last100Years", "last80Years", "last50Years", "last40Years", "last30Years", "last20Years", "last15Years", 'last10Years', 'last5Years', "last2Years", "lastYear", "last6Months", "last3Months", "lastWeek", "yesterday", 'today']
interface Document {
  customId: string;
  name: string;
  type: string;
}


interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}





interface DateRangePickerProps {
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
}



// Date Range Picker Component
function DateRangePicker({ dateRange, setDateRange }: DateRangePickerProps) {
  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 min-w-[240px] justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {dateUtils.formatDate(dateRange.from)} - {dateUtils.formatDate(dateRange.to)}
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
            selected={{ from: dateRange.from, to: dateRange.to }}
            captionLayout='dropdown'
            defaultMonth={dateRange.from ?? new Date()}
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
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export default function PatientDashboard() {
  const { data } = usePatients()

  const [globalFilter, setGlobalFilter] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sorting, setSorting] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({ from: dateUtils.getYearsAgoDate(100), to: new Date() });
  const [genderFilter, setGenderFilter] = useState<"male" | "female" | "other" | "all">("all")
  const [dateOption, setDateOption] = useState<"createdAt" | "updatedAt" | "dateOfBirth">("createdAt")

  // Filter patients by date range

  const filteredPatients = useMemo(() => {



    return data?.filter((patient) => {
      const createdDate = toDate(patient[dateOption]);
      if (dateRange.from && createdDate < dateRange.from) return false;
      if (dateRange.to && createdDate > dateRange.to) return false;
      return true;
    })?.filter((t) => genderFilter == 'all' ? true : t.gender == genderFilter);



  }, [data, dateOption, dateRange, genderFilter]);

  // Table columns
  const columns = useMemo<ColumnDef<PatientSchema>[]>(
    () => [

      {
        accessorKey: 'firstName',
        header: 'First Name',
        cell: ({ row }) => <div className="font-medium">{row.getValue('firstName')}</div>,
      },
      {
        accessorKey: 'lastName',
        header: 'Last Name',
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
        cell: ({ row }) => (
          <Badge variant="outline" className="capitalize">
            {row.getValue('gender')}
          </Badge>
        ),
        filterFn: (row, id, value: string[]) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: 'doctorEmail',
        header: 'Doctor',
        cell: ({ row }) => {
          const email = row.getValue('doctorEmail') as string;
          return <div className="text-sm">{email.split('@')[0]}</div>;
        },

        filterFn: (row, id, value: string[]) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: 'documents',
        header: 'Documents',
        cell: ({ row }) => {
          const docs = row.getValue('documents') as Document[];
          return <div className="text-center">{docs.length}</div>;
        },
      },
      { accessorKey: 'dateOfBirth', header: 'Date of Birth', cell: ({ row }) => <div className="font-medium">{dateUtils.formatDate(row.getValue('dateOfBirth'))}</div>, },

      {
        accessorKey: 'createdAt',
        header: 'Registered',
        cell: ({ row }) => {
          const date = row.getValue('createdAt') as Date;
          return <div className="text-sm">{dateUtils.formatDate(date)}</div>;
        },
      },
    ],
    []
  );

  const table = useReactTable<PatientSchema>({
    data: filteredPatients || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  // Statistics
  function setTimelineRange(type: TimelineType) {
    const now = new Date();
    const config = TIMELINES[type];

    const from = new Date(now);

    if ("days" in config) {
      from.setDate(from.getDate() - config.days);
    }

    if ("months" in config) {
      from.setMonth(from.getMonth() - config.months);
    }

    if ("years" in config) {
      from.setFullYear(from.getFullYear() - config.years);
    }

    setDateRange({ from, to: now });
  }



  const stats = useMemo(() => {

    const totalPatients = filteredPatients?.length;
    const maleCount = filteredPatients?.filter((p) => p.gender === 'male').length;
    const femaleCount = filteredPatients?.filter((p) => p.gender === 'female').length;
    const totalDocuments = filteredPatients?.reduce((sum, p) => sum + p.documents.length, 0);

    return {
      documents: {
        count: totalDocuments,
        desc: `Avg: ${totalPatients! > 0 ? (totalDocuments! / totalPatients!).toFixed(1) : 0} per patient`,
        icon: FileText,
        title: 'Documents',
        value: ""
      },
      female: {
        count: femaleCount,
        desc: `  ${totalPatients! > 0 ? ((femaleCount! / totalPatients!) * 100).toFixed(1) : 0}% of total`,
        icon: Venus,
        title: 'Females',
        value: ''
      },
      male: {
        count: maleCount,
        desc: `${totalPatients! > 0 ? ((maleCount! / totalPatients!) * 100).toFixed(1) : 0}% of total`,
        icon: Mars,
        title: 'Males',
        value: ''
      },
      total: {
        count: totalPatients,
        value: '',
        icon: Sigma,
        title: 'Total',
        desc: "Active Registration's"
      }
    };
  }, [filteredPatients]);

  const chartConfig = {
    all: {
      label: "All",
    },
    male: {
      label: "Male",
      color: "var(--chart-1)",
    },
    female: {
      label: "Female",
      color: "var(--chart-2)",
    },

    other: {
      label: "Other",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig

  const chartData = [
    { gender: "male", count: stats.male.count, fill: "var(--color-male)" },
    { gender: "female", count: stats.female.count, fill: "var(--color-female)" },

    { gender: "other", count: Number(stats?.total.count) - (Number(stats.female.count) + Number(stats.male.count)), fill: "var(--color-other)" },
  ]
  type LineChartItem = {
    month: string
    male: number
    female: number
    other: number
  }

  type LineChartType = LineChartItem[]
  const randomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min

  const getGenderStarts = (month: number, gender: 'male' | 'female' | 'other') => {
    return filteredPatients?.filter((val) => {

      const myDate = toDate(val[dateOption])
      if (myDate.getDate() > dateRange.from?.getDate()! && myDate.getDate() < dateRange.to?.getDate()! && myDate.getMonth() == month && val.gender == gender) {

        return true
      }
      return false
    }).length!
  }

  const lineChartData: LineChartType = useMemo(() => {
    return [
      {
        female: getGenderStarts(0,'female'),
        male:getGenderStarts(0,'male'),
       other:getGenderStarts(0,'other'),
        month: 'Jan'
      },
      {
        female:getGenderStarts(1,'female'),
        male:getGenderStarts(1,'male'),
       other:getGenderStarts(1,'other'),
        month: 'Feb'
      },
      {
        female:getGenderStarts(2,'female'),
        male:getGenderStarts(2,'male'),
       other:getGenderStarts(2,'other'),
        month: 'March'
      },
      {
        female:getGenderStarts(3,'female'),
        male:getGenderStarts(3,'male'),
       other:getGenderStarts(3,'other'),
        month: 'April'
      },
      {
        female:getGenderStarts(4,'female'),
        male:getGenderStarts(5,'male'),
       other:getGenderStarts(4,'other'),
        month: 'May'
      },
      {
        female:getGenderStarts(5,'female'),
        male:getGenderStarts(5,'male'),
       other:getGenderStarts(5,'other'),
        month: 'June'
      },
      {
        female:getGenderStarts(6,'female'),
        male:getGenderStarts(6,'male'),
       other:getGenderStarts(6,'other'),
        month: 'July'
      },
      {
        female:getGenderStarts(7,'female'),
        male:getGenderStarts(7,'male'),
       other:getGenderStarts(7,'other'),
        month: 'August'
      },
      {
        female:getGenderStarts(8,'female'),
        male:getGenderStarts(8,'male'),
       other:getGenderStarts(8,'other'),
        month: 'Sept'
      },
      {
        female:getGenderStarts(9,'female'),
        male:getGenderStarts(9,'male'),
       other:getGenderStarts(9,'other'),
        month: 'Octo'
      },
      {
        female:getGenderStarts(10,'female'),
        male:getGenderStarts(10,'male'),
       other:getGenderStarts(10,'other'),
        month: 'Nov'
      },
      {
        female:getGenderStarts(11,'female'),
        male:getGenderStarts(11,'female'),
        other:getGenderStarts(11,'other'),
        month: 'Dec'
      },
    ]
  }, [filteredPatients, dateOption])

  return (
    <div className="min-h-screen  sm:p-6">
      {!data && <LoadingBar />}

      <div className=" mx-auto space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {Object.values(stats).reverse().map((key, id) => <div key={id} className='bg-secondary py-3.5'>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{key.title}</CardTitle>
              <key.icon className=" text-primary/90" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl text-primary font-bold">{key.count}</div>
              <p className="text-xs text-gray-500 mt-1">{key.desc}</p>
            </CardContent>
          </div>)}

          <div>

            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor
                  content={<ChartTooltipContent />}
                />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="gender"
                // innerRadius={60}
                // strokeWidth={5}
                >
                  {/* <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {stats.total.count}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Patients
                          </tspan>
                        </text>
                      )
                    }
                  }}

                /> */}
                  <LabelList
                    dataKey="gender"
                    className="fill-background"
                    stroke="none"
                    fontSize={12}
                    formatter={(value: keyof typeof chartConfig) =>
                      chartConfig[value]?.label
                    }
                  />
                </Pie>
              </PieChart>
            </ChartContainer>


          </div>

          <div className='sm:col-span-3  flex items-center '> <ChartLineMultiple data={lineChartData} /> </div>

        </div>


        <div className=' bg-gray-50 rounded-lg border'>
          <div className="flex flex-wrap items-center gap-2 p-3">
            <div className="text-sm font-medium text-gray-700 mr-2">Filters:</div>

            <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
            <NativeSelect onChange={(e) => setTimelineRange(e.target.value as TimelineType)} >   {timelines.map((timeline, id) => (<NativeSelectOption key={id} value={timeline}> {TIMELINES[timeline].label}</NativeSelectOption>))}</NativeSelect>
            <NativeSelect onChange={(e) => setDateOption(e.target.value as "updatedAt")}>
              {[{ value: "createdAt", label: "Registration Date " }, { value: "updatedAt", label: "Last Update" }, { value: "dateOfBirth", label: 'Date Of Birth' }].map((dte, id) => (<NativeSelectOption value={dte.value} key={id}>{dte.label} </NativeSelectOption>))}</NativeSelect>

            <NativeSelect onChange={(e) => setGenderFilter(e.target.value as "male")} >   {["male", "female", "other", "all"].reverse().map((timeline, id) => (<NativeSelectOption key={id} value={timeline}> {capitalizeFirstLetter(timeline)}</NativeSelectOption>))}</NativeSelect>
            {(columnFilters.length > 0 || dateRange.from || genderFilter !== 'all') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  table.resetColumnFilters();
                  setDateRange({ from: undefined, to: undefined });
                  setGlobalFilter('');
                  setGenderFilter('all')
                }}
                className="h-9"
              >
                <X className="h-4 w-4 mr-2" />
                Clear all
              </Button>
            )}
          </div>
          <div className='p-3  '>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10 h-10 bg-background"
                />
              </div>
            </div>
            <div>

              {/* Pagination */}

            </div>
          </div>


        </div>

        <div>




          <div className="rounded-lg border overflow-hidden my-6 ">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-4 py-3 text-sm text-gray-900">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={columns.length} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <Search className="h-12 w-12 mb-2 opacity-40" />
                          <p className="text-sm font-medium">No results found</p>
                          <p className="text-xs">Try adjusting your filters or search terms</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>


          <div className="flex items-center justify-between pb-20">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium">{table.getRowModel().rows.length}</span> of{' '}
              <span className="font-medium">{filteredPatients?.length}</span> patients
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <div className="text-sm text-gray-600">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}