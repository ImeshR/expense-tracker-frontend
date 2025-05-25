"use client";

import { useExpenses } from "@/context/expense-context";
import { Progress } from "@/components/ui/progress";

export function MonthlyProgress() {
  const { currentMonthTotal, maxMonthlyExpense } = useExpenses();

  const percentage = Math.min(
    Math.round((currentMonthTotal / maxMonthlyExpense) * 100),
    100,
  );

  let statusColor = "bg-gradient-to-r from-green-400 to-green-500";
  if (percentage >= 90) {
    statusColor = "bg-gradient-to-r from-red-400 to-red-500";
  } else if (percentage >= 75) {
    statusColor = "bg-gradient-to-r from-yellow-400 to-yellow-500";
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="text-sm font-medium">Budget Usage</span>
        <span className="text-sm font-medium">{percentage}%</span>
      </div>
      <Progress
        value={percentage}
        className="h-3 rounded-full"
        indicatorClassName={statusColor}
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>LKR 0</span>
        <span>LKR {maxMonthlyExpense.toLocaleString()}</span>
      </div>
      <div className="pt-4 space-y-2">
        <div className="flex justify-between mb-1 p-2 rounded-lg bg-background/50">
          <span className="text-sm font-medium">Current Spending</span>
          <span className="text-sm font-medium">
            LKR {currentMonthTotal.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between mb-1 p-2 rounded-lg bg-background/50">
          <span className="text-sm font-medium">Monthly Limit</span>
          <span className="text-sm font-medium">
            LKR {maxMonthlyExpense.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between mb-1 p-2 rounded-lg bg-background/50">
          <span className="text-sm font-medium">Remaining</span>
          <span className="text-sm font-medium">
            LKR {(maxMonthlyExpense - currentMonthTotal).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
