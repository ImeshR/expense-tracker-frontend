"use client";

import { useExpenses } from "@/context/expense-context";
import { Badge } from "@/components/ui/badge";

export function RecentExpenses() {
  const { expenses } = useExpenses();

  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      Food: "bg-expense-food text-white",
      Transportation: "bg-expense-transportation text-white",
      Housing: "bg-expense-housing text-black",
      Entertainment: "bg-expense-entertainment text-white",
      Utilities: "bg-expense-utilities text-white",
      Healthcare: "bg-expense-healthcare text-white",
      Other: "bg-expense-other text-white",
    };
    return colorMap[type] || "bg-gray-500 text-white";
  };

  return (
    <div className="space-y-4">
      {recentExpenses.length === 0 ? (
        <p className="text-center text-muted-foreground">No recent expenses</p>
      ) : (
        recentExpenses.map((expense) => (
          <div
            key={expense.id}
            className={`expense-card ${expense.type.toLowerCase()} p-3`}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  {expense.description}
                </p>
                <p className="text-sm text-muted-foreground">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getTypeColor(expense.type)}>
                  {expense.type}
                </Badge>
                <span className="font-medium">
                  LKR {expense.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
