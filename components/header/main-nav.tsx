"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";

export function MainNav() {
  const pathname = usePathname();
  const { user } = useAuth();

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
    <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-primary font-semibold"
              : "text-muted-foreground",
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
