"use client";

import type { ReactNode, FC } from "react";
import { createContext, useContext, useState, useEffect } from "react";

export type ExpenseType =
  | "Food"
  | "Transportation"
  | "Housing"
  | "Entertainment"
  | "Utilities"
  | "Healthcare"
  | "Other";

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: ExpenseType;
}

interface ExpenseContextType {
  expenses: Expense[];
  maxMonthlyExpense: number;
  currentMonthTotal: number;
  isNearLimit: boolean;
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (expense: Expense) => void;
  removeExpense: (id: string) => void;
  setMaxMonthlyExpense: (amount: number) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

// Sample data for demonstration
const initialExpenses: Expense[] = [
  {
    id: "1",
    description: "Grocery shopping",
    amount: 5000,
    date: "2023-05-15",
    type: "Food",
  },
  {
    id: "2",
    description: "Electricity bill",
    amount: 3500,
    date: "2023-05-10",
    type: "Utilities",
  },
  {
    id: "3",
    description: "Movie tickets",
    amount: 1500,
    date: "2023-05-20",
    type: "Entertainment",
  },
  {
    id: "4",
    description: "Bus fare",
    amount: 500,
    date: "2023-05-18",
    type: "Transportation",
  },
  {
    id: "5",
    description: "Rent payment",
    amount: 25000,
    date: "2023-05-01",
    type: "Housing",
  },
];

export const ExpenseProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [maxMonthlyExpense, setMaxMonthlyExpenseState] =
    useState<number>(40000);
  const [currentMonthTotal, setCurrentMonthTotal] = useState<number>(0);
  const [isNearLimit, setIsNearLimit] = useState<boolean>(false);

  // Calculate current month total and check if near limit
  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyTotal = expenses.reduce((total, expense) => {
      const expenseDate = new Date(expense.date);
      if (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      ) {
        return total + expense.amount;
      }
      return total;
    }, 0);

    setCurrentMonthTotal(monthlyTotal);
    setIsNearLimit(monthlyTotal >= maxMonthlyExpense * 0.9);
  }, [expenses, maxMonthlyExpense]);

  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = {
      ...expense,
      id: Math.random().toString(36).substring(2, 9),
    };
    setExpenses([...expenses, newExpense]);
  };

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === updatedExpense.id ? updatedExpense : expense,
      ),
    );
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id));
  };

  const setMaxMonthlyExpense = (amount: number) => {
    setMaxMonthlyExpenseState(amount);
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        maxMonthlyExpense,
        currentMonthTotal,
        isNearLimit,
        addExpense,
        updateExpense,
        removeExpense,
        setMaxMonthlyExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};
