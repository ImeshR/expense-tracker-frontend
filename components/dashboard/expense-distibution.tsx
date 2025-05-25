"use client";

import { useExpenses, type ExpenseType } from "@/context/expense-context";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const EXPENSE_COLORS: Record<ExpenseType, string> = {
  Food: "#FF6B6B",
  Transportation: "#4ECDC4",
  Housing: "#FFD166",
  Entertainment: "#6A0572",
  Utilities: "#1A936F",
  Healthcare: "#3D5A80",
  Other: "#7678ED",
};

export function ExpenseDistribution() {
  const { expenses } = useExpenses();

  //expenses by type
  const expensesByType = expenses.reduce(
    (acc: Record<ExpenseType, number>, expense) => {
      if (!acc[expense.type]) {
        acc[expense.type] = 0;
      }
      acc[expense.type] += expense.amount;
      return acc;
    },
    {} as Record<ExpenseType, number>,
  );

  // Convert to array for chart
  const chartData = Object.entries(expensesByType).map(([name, value]) => ({
    name,
    value,
    color: EXPENSE_COLORS[name as ExpenseType],
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [
              `LKR ${value.toLocaleString()}`,
              "Amount",
            ]}
            contentStyle={{
              borderRadius: "0.5rem",
              border: "1px solid #e2e8f0",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {chartData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div
              className="mr-2 h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
