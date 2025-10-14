// src/features/auth/context/AuthContext.ts
import { createContext } from "react";

export interface AuthUser {
  id: number;
  email: string;
  role: "CUSTOMER" | "RESTAURANT_ADMIN" | "SUPER_ADMIN";
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  isLoading: boolean;
  login: (
    type: "customer" | "admin",
    email: string,
    password: string
  ) => Promise<AuthUser>; // 👈 CAMBIO: Ahora devuelve el usuario
  logout: (allSessions?: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);