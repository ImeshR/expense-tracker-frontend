import React, { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ExpenseProvider } from "@/context/expense-context";
import { Header } from "@/components/header/header";
import { AuthProvider } from "@/context/auth-context";
import { ConnectionProvider } from "@/context/ConnectionProvider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Personal Expense Tracker",
  description: "Track and manage your personal expenses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ConnectionProvider>
              <ExpenseProvider>
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-1 container mx-auto py-6 px-4">
                    {children}
                    <Toaster />
                  </main>
                </div>
              </ExpenseProvider>
            </ConnectionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
