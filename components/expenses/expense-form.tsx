"use client";

import type React from "react";

import { useState } from "react";
import {
  useExpenses,
  type Expense,
  type ExpenseType,
} from "@/context/expense-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar, DollarSign, FileText, Tag } from "lucide-react";

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess: () => void;
}

export function ExpenseForm({ expense, onSuccess }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useExpenses();

  const [description, setDescription] = useState(expense?.description || "");
  const [amount, setAmount] = useState(expense?.amount.toString() || "");
  const [date, setDate] = useState(
    expense?.date || format(new Date(), "yyyy-MM-dd"),
  );
  const [type, setType] = useState<ExpenseType>(expense?.type || "Other");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const expenseTypes: ExpenseType[] = [
    "Food",
    "Transportation",
    "Housing",
    "Entertainment",
    "Utilities",
    "Healthcare",
    "Other",
  ];

  // Map expense types to our custom colors
  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      Food: "text-expense-food",
      Transportation: "text-expense-transportation",
      Housing: "text-expense-housing",
      Entertainment: "text-expense-entertainment",
      Utilities: "text-expense-utilities",
      Healthcare: "text-expense-healthcare",
      Other: "text-expense-other",
    };
    return colorMap[type] || "text-gray-500";
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!amount.trim()) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }

    if (!date.trim()) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const expenseData = {
      description,
      amount: Number(amount),
      date,
      type,
    };

    if (expense) {
      updateExpense({ ...expenseData, id: expense.id });
    } else {
      addExpense(expenseData);
    }

    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="description" className="flex items-center gap-1">
          <FileText className="h-4 w-4" /> Description
        </Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter expense description"
          className="border-primary/20 focus-visible:ring-primary"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount" className="flex items-center gap-1">
          <DollarSign className="h-4 w-4" /> Amount (LKR)
        </Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          min="0"
          step="0.01"
          className="border-primary/20 focus-visible:ring-primary"
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date" className="flex items-center gap-1">
          <Calendar className="h-4 w-4" /> Date
        </Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border-primary/20 focus-visible:ring-primary"
        />
        {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="type" className="flex items-center gap-1">
          <Tag className="h-4 w-4" /> Type
        </Label>
        <Select
          value={type}
          onValueChange={(value) => setType(value as ExpenseType)}
        >
          <SelectTrigger className="border-primary/20 focus-visible:ring-primary">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {expenseTypes.map((type) => (
              <SelectItem
                key={type}
                value={type}
                className={getTypeColor(type)}
              >
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90"
        >
          {expense ? "Update" : "Add"} Expense
        </Button>
      </div>
    </form>
  );
}
