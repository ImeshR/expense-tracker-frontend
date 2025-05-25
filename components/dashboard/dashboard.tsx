"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useExpenses } from "@/context/expense-context";
import {ExpenseChart} from "@/components/dashboard/expense-chart";
import {ExpenseDistribution} from "@/components/dashboard/expense-distibution";
import {MonthlyProgress} from "@/components/dashboard/monthly-progress";
import {RecentExpenses} from "@/components/dashboard/recent-expenses";

export default function Dashboard() {
  const { currentMonthTotal, maxMonthlyExpense, isNearLimit } = useExpenses();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Welcome Back, Eshan!
        </h2>
      </div>

      {isNearLimit && (
        <Alert variant="destructive" className="animate-pulse">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            You have reached 90% of your monthly expense limit. Current
            expenses: LKR {currentMonthTotal.toLocaleString()} of LKR{" "}
            {maxMonthlyExpense.toLocaleString()}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              LKR {currentMonthTotal.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Monthly Limit: LKR {maxMonthlyExpense.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Remaining Budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              LKR {(maxMonthlyExpense - currentMonthTotal).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                ((maxMonthlyExpense - currentMonthTotal) / maxMonthlyExpense) *
                100
              ).toFixed(1)}
              % of budget remaining
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Daily</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              LKR {(currentMonthTotal / new Date().getDate()).toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">
              For the current month
            </p>
          </CardContent>
        </Card>
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isNearLimit ? "Warning" : "Good"}
            </div>
            <p className="text-xs text-muted-foreground">
              {isNearLimit ? "Close to limit" : "Within budget"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Expense Trend</CardTitle>
            <CardDescription>
              Your expense pattern for the current month
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ExpenseChart />
          </CardContent>
        </Card>
        <Card className="col-span-1 lg:col-span-3">
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
            <CardDescription>Breakdown by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpenseDistribution />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Progress</CardTitle>
            <CardDescription>
              Budget utilization for the current month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyProgress />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Your latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentExpenses />
        </CardContent>
        </Card>
      </div>
    </div>
  );
}
