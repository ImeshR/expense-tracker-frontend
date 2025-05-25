"use client";

import type { ReactNode, FC } from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "@/context/auth-context";
import { useConnection } from "@/context/ConnectionProvider";

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
  addExpense: (expense: Omit<Expense, "id">) => Promise<boolean>;
  updateExpense: (expense: Expense) => Promise<boolean>;
  removeExpense: (id: string) => Promise<boolean>;
  setMaxMonthlyExpense: (amount: number) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const connection = useConnection();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [maxMonthlyExpense, setMaxMonthlyExpenseState] = useState<number>(
    user?.maxMonthlyExpense || 0,
  );
  const [currentMonthTotal, setCurrentMonthTotal] = useState<number>(0);
  const [isNearLimit, setIsNearLimit] = useState<boolean>(false);

  // Update maxMonthlyExpense
  useEffect(() => {
    if (user?.maxMonthlyExpense) {
      setMaxMonthlyExpenseState(user.maxMonthlyExpense);
    }
  }, [user?.maxMonthlyExpense]);

  // Fetch expenses
  const fetchExpenses = useCallback(async () => {
    if (!connection) return;

    try {
      const response = await connection.get("/expenses");
      const data = response.map((expense: any) => ({
        id: expense._id,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        type: expense.type as ExpenseType,
      }));
      console.log("Fetched expenses:", data);
      setExpenses(data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      setExpenses([]);
    }
  }, [connection]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  // Calculate monthly total and limit status
  useEffect(() => {
    if (!expenses) return;

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
    setIsNearLimit(
      maxMonthlyExpense > 0 && monthlyTotal >= maxMonthlyExpense * 0.9,
    );
  }, [expenses, maxMonthlyExpense]);

  const addExpense = async (expense: Omit<Expense, "id">): Promise<boolean> => {
    if (!connection) {
      console.error("No connection available for adding expense");
      return false;
    }

    try {
      const data = await connection.post("/expenses", expense);

      const newExpense: Expense = {
        id: data._id,
        description: data.description,
        amount: data.amount,
        date: data.date,
        type: data.type as ExpenseType,
      };

      setExpenses((prev) => [...prev, newExpense]);
      await fetchExpenses();
      return true;
    } catch (error) {
      console.error("Failed to add expense:", error);
      return false;
    }
  };

  const updateExpense = async (updatedExpense: Expense): Promise<boolean> => {
    try {
      const data = await connection.patch(`/expenses/${updatedExpense.id}`, {
        description: updatedExpense.description,
        amount: updatedExpense.amount,
        date: updatedExpense.date,
        type: updatedExpense.type,
      });

      const updated: Expense = {
        id: data._id,
        description: data.description,
        amount: data.amount,
        date: data.date,
        type: data.type as ExpenseType,
      };

      setExpenses((prev) =>
        prev.map((expense) => (expense.id === updated.id ? updated : expense)),
      );

      return true;
    } catch (error) {
      console.error("Failed to update expense:", error);
      return false;
    }
  };

  const removeExpense = async (id: string): Promise<boolean> => {
    try {
      await connection.delete(`/expenses/${id}`);
      setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      return true;
    } catch (error) {
      console.error("Failed to remove expense:", error);
      return false;
    }
  };

  const setMaxMonthlyExpense = useCallback((amount: number) => {
    setMaxMonthlyExpenseState(amount);
    // Optionally persist to server
    // if (user) {
    //   connection.put(`/users/${user.id}`, { maxMonthlyExpense: amount });
    // }
  }, []);

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
