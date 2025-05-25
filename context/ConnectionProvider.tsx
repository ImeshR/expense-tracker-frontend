"use client";

import { createContext, useContext, ReactNode } from "react";
import { Connection as CreateConnection } from "../hooks/Connection";

const ConnectionContext = createContext<ReturnType<
  typeof CreateConnection
> | null>(null);

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const connection = CreateConnection();

  return (
    <ConnectionContext.Provider value={connection}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
}
