"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

export const description = "A multiple line chart"

export const lineChartData = [
    { month: "January", male: 186, other: 98, female: 80 },
    { month: "February", male: 305, other: 98, female: 200 },
    { month: "March", male: 237, other: 98, female: 120 },
    { month: "April", male: 73, other: 98, female: 190 },
    { month: "May", male: 209, other: 98, female: 130 },
    { month: "June", male: 214, other: 98, female: 140 },
]

const lineChartConfig = {
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
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

export type LineChartType = typeof lineChartData
export function ChartLineMultiple({ data }: { data: typeof lineChartData }) {
    return (

        <ChartContainer config={lineChartConfig} className="w-full h-[200px] ">
            <LineChart
                accessibilityLayer
                data={data}
                margin={{
                    left: 12,
                    right: 12,
                }}
            >
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line
                    dataKey="male"
                    type="monotone"
                    stroke="var(--color-male)"
                    strokeWidth={2}
                    dot={false}
                />
                <Line
                    dataKey="female"
                    type="monotone"
                    stroke="var(--color-female)"
                    strokeWidth={2}
                    dot={false}
                />
                <Line
                    dataKey="other"
                    type="monotone"
                    stroke="var(--color-other)"
                    strokeWidth={2}
                    dot={false}
                />
            </LineChart>
        </ChartContainer>

    )
}




export function ChartBarStacked({ data }: { data: typeof lineChartData }) {
    return (

        <ChartContainer config={lineChartConfig}>
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />
                <XAxis

                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                    dataKey="male"
                    type="monotone"
                    stroke="var(--color-male)"
                    strokeWidth={2}

                    stackId="a"
                    fill="var(--color-desktop)"
                    radius={[0, 0, 4, 4]}
                />
                <Bar
                    dataKey="female"
                    type="monotone"
                    stroke="var(--color-female)"
                    strokeWidth={2}

                    stackId="a"
                    fill="var(--color-mobile)"
                    radius={[4, 4, 0, 0]}
                />
                <Bar
                    dataKey="other"
                    type="monotone"
                    stroke="var(--color-other)"
                    strokeWidth={2}
                    stackId="a"
                    fill="var(--color-mobile)"
                    radius={[4, 4, 0, 0]}
                />
            </BarChart>
        </ChartContainer>

    )
}
