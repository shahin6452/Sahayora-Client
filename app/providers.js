"use client";

import { createContext, useContext } from "react";
import { useSession } from "../lib/auth-client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const sessionData = useSession();

  return (
    <AuthContext.Provider value={sessionData}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}