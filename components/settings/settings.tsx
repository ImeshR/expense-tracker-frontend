"use client";

import React, { useEffect } from "react";

import { useState, FormEvent } from "react";
import { useExpenses } from "@/context/expense-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Save } from "lucide-react";
import { useConnection } from "@/context/ConnectionProvider";
import { toast } from "@/hooks/use-toast";

export function Settings() {
  const { maxMonthlyExpense, setMaxMonthlyExpense } = useExpenses();
  const [amount, setAmount] = useState(() => maxMonthlyExpense.toString());
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const connection = useConnection();

  useEffect(() => {
    setAmount(maxMonthlyExpense.toString());
  }, [maxMonthlyExpense]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!amount.trim()) {
      setError("Amount is required");
      return;
    }

    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Amount must be a positive number");
      return;
    }

    try {
      setLoading(true);
      const response = await connection.patch("/users/profile", {
        maxMonthlyExpense: numAmount,
      });

      if (response) {
        toast({
          title: "Settings updated",
          description: `Monthly expense limit set to LKR ${numAmount.toLocaleString()}`,
        });
        setError("");
        setMaxMonthlyExpense(numAmount);
      } else {
        setError("Failed to update expense limit");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while updating");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          Settings
        </h2>
      </div>

      <Card className="max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Monthly Expense Limit</CardTitle>
          <CardDescription>
            Set your maximum monthly expense limit. You will receive an alert
            when your expenses reach 90% of this limit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="max-amount" className="flex items-center gap-1">
                Maximum Amount (LKR)
              </Label>
              <div className="relative">
                <Input
                  id="max-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter maximum amount"
                  min="0"
                  step="0.01"
                  className="pl-8 border-primary/20 focus-visible:ring-primary"
                />
                <span className="absolute left-3 top-2 text-muted-foreground">
                  ₨
                </span>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
                disabled={loading}
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
