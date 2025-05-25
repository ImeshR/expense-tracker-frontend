"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export function BurgerMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    setOpen(false);
  }, [logout]);

  // Routes for authenticated users
  const authRoutes = [
    {
      href: "/",
      label: "Dashboard",
      active: pathname === "/",
    },
    {
      href: "/expenses",
      label: "Expenses",
      active: pathname === "/expenses",
    },
    {
      href: "/settings",
      label: "Settings",
      active: pathname === "/settings",
    },
  ];

  // Routes for unauthenticated users
  const unauthRoutes = [
    {
      href: "/login",
      label: "Login",
      active: pathname === "/login",
    },
    {
      href: "/register",
      label: "Register",
      active: pathname === "/register",
    },
  ];

  const routes = user ? authRoutes : unauthRoutes;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="flex flex-col gap-6 py-4">
          <div>
            <h2 className="mb-2 text-lg font-semibold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Expense Tracker
            </h2>
          </div>
          <div className="flex flex-col space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "mobile-nav-button h-10 flex items-center px-3 text-sm font-medium transition-colors",
                  route.active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                {route.label}
              </Link>
            ))}
          </div>
          {user && (
            <div className="mt-auto px-3 py-2 border-t">
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">{user.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
