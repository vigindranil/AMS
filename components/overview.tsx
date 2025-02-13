"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { format } from "date-fns"

interface OverviewProps {
  data: Array<{
    completion_date: string
    amount_spent: number
  }>
}

export function Overview({ data }: OverviewProps) {
  // Process and aggregate data by completion date
  const processedData = data
    .map((item) => ({
      date: format(new Date(item.completion_date), "MMM dd"),
      amount: item.amount_spent,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={processedData}>
        <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value.toLocaleString()}`}
        />
        <Tooltip
          formatter={(value: number) => [`₹${value.toLocaleString()}`, "Amount Spent"]}
          cursor={{ fill: "rgba(200, 200, 200, 0.1)" }}
          labelStyle={{ color: "#888888" }}
          contentStyle={{
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            padding: "8px",
          }}
        />
        <Bar dataKey="amount" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

