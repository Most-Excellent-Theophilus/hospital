import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CalendarIcon, 
  Search, 
  X, 
  Filter,
  Users,
  FileText,
  Download
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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data generator
const generateMockData = () => {
  const genders = ['male', 'female', 'other'];
  const doctors = ['dr.smith@hospital.com', 'dr.jones@hospital.com', 'dr.williams@hospital.com', 'dr.brown@hospital.com'];
  const firstNames = ['John', 'Emma', 'Michael', 'Sarah', 'David', 'Lisa', 'James', 'Maria', 'Robert', 'Jennifer'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
  
  return Array.from({ length: 200 }, (_, i) => {
    const createdDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    return {
      id: `patient-${i + 1}`,
      createdAt: createdDate,
      updatedAt: new Date(createdDate.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000),
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      middleName: Math.random() > 0.5 ? 'Middle' : undefined,
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      email: `patient${i + 1}@email.com`,
      dateOfBirth: `${1950 + Math.floor(Math.random() * 60)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      gender: genders[Math.floor(Math.random() * genders.length)],
      address: `${Math.floor(Math.random() * 9999)} Main St, City, State`,
      phoneNumber: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      doctorEmail: doctors[Math.floor(Math.random() * doctors.length)],
      doctorId: `doctor-${Math.floor(Math.random() * 4) + 1}`,
      documents: Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
        customId: `doc-${j}`,
        name: `document-${j}.pdf`,
        type: 'application/pdf',
      })),
    };
  });
};

// Faceted Filter Component
function FacetedFilter({ column, title, options }) {
  const selectedValues = new Set(column?.getFilterValue());

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-dashed">
          <Filter className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
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
                  checked={isSelected}
                  onChange={() => {
                    if (isSelected) {
                      selectedValues.delete(option.value);
                    } else {
                      selectedValues.add(option.value);
                    }
                    const filterValues = Array.from(selectedValues);
                    column?.setFilterValue(
                      filterValues.length ? filterValues : undefined
                    );
                  }}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label className="text-sm font-medium leading-none">
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

// Date Range Picker Component
function DateRangePicker({ dateRange, setDateRange }) {
  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 min-w-[240px] justify-start text-left font-normal">
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
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export default function PatientDashboard() {
    
  const [patients] = useState(generateMockData());
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [dateRange, setDateRange] = useState({ from: undefined, to: undefined });

  // Filter patients by date range
  const filteredPatients = useMemo(() => {
    if (!dateRange.from && !dateRange.to) return patients;
    
    return patients.filter((patient) => {
      const createdDate = new Date(patient.createdAt);
      if (dateRange.from && createdDate < dateRange.from) return false;
      if (dateRange.to && createdDate > dateRange.to) return false;
      return true;
    });
  }, [patients, dateRange]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div className="font-mono text-xs">{row.getValue('id')}</div>,
        
      },
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
        

        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },

      },
      {
        accessorKey: 'doctorEmail',
        header: 'Doctor',

        cell: ({ row }) => {
          const email = row.getValue('doctorEmail');
          return <div className="text-sm">{email.split('@')[0]}</div>;
        },
        filterFn: (row, id, value) => {
          return value.includes(row.getValue(id));
        },
      },
      {
        accessorKey: 'documents',
        header: 'Documents',
        
        cell: ({ row }) => {
          const docs = row.getValue('documents');
          return <div className="text-center">{docs.length}</div>;
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Registered',
        cell: ({ row }) => {
          const date = new Date(row.getValue('createdAt'));
          return <div className="text-sm">{date.toLocaleDateString()}</div>;
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredPatients,
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
  const stats = useMemo(() => {
    const totalPatients = filteredPatients.length;
    const maleCount = filteredPatients.filter((p) => p.gender === 'male').length;
    const femaleCount = filteredPatients.filter((p) => p.gender === 'female').length;
    const totalDocuments = filteredPatients.reduce((sum, p) => sum + p.documents.length, 0);
    
    return { totalPatients, maleCount, femaleCount, totalDocuments };
  }, [filteredPatients]);

  // Chart data
  const chartData = useMemo(() => {
    const months = {};
    filteredPatients.forEach((patient) => {
      const date = new Date(patient.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[monthKey] = (months[monthKey] || 0) + 1;
    });
    
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));
  }, [filteredPatients]);

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const doctorOptions = useMemo(
    () => [
      ...new Set(patients.map((p) => p.doctorEmail)),
    ].map((email) => ({
      label: email.split('@')[0],
      value: email,
    })),
    [patients]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Analytics Dashboard</h1>
            <p className="text-gray-500 mt-1">Advanced filtering and comprehensive patient data management</p>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalPatients}</div>
              <p className="text-xs text-gray-500 mt-1">Active registrations</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Male Patients</CardTitle>
              <Users className="h-5 w-5 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.maleCount}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalPatients > 0 ? ((stats.maleCount / stats.totalPatients) * 100).toFixed(1) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Female Patients</CardTitle>
              <Users className="h-5 w-5 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.femaleCount}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalPatients > 0 ? ((stats.femaleCount / stats.totalPatients) * 100).toFixed(1) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
              <FileText className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalDocuments}</div>
              <p className="text-xs text-gray-500 mt-1">
                Avg: {stats.totalPatients > 0 ? (stats.totalDocuments / stats.totalPatients).toFixed(1) : 0} per patient
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Registration Trends</CardTitle>
            <CardDescription>Monthly patient registration over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#3b82f6" 
                  fill="url(#colorCount)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Filters and Table */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Records</CardTitle>
            <CardDescription>Search, filter and manage patient information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or ID..."
                  value={globalFilter ?? ''}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border">
              <div className="text-sm font-medium text-gray-700 mr-2">Filters:</div>
              
              <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
              
              {table.getColumn('gender') && (
                <FacetedFilter
                  column={table.getColumn('gender')}
                  title="Gender"
                  options={genderOptions}
                />
              )}
              
              {table.getColumn('doctorEmail') && (
                <FacetedFilter
                  column={table.getColumn('doctorEmail')}
                  title="Doctor"
                  options={doctorOptions}
                />
              )}

              {(columnFilters.length > 0 || dateRange.from) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    table.resetColumnFilters();
                    setDateRange({ from: undefined, to: undefined });
                    setGlobalFilter('');
                  }}
                  className="h-9"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear all
                </Button>
              )}
            </div>

            {/* Table */}
            <div className="rounded-lg border overflow-hidden">
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

            {/* Pagination */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{table.getRowModel().rows.length}</span> of{' '}
                <span className="font-medium">{filteredPatients.length}</span> patients
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}