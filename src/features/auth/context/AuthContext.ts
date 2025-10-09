// src/features/auth/context/AuthContext.ts
import { createContext } from "react";

// ... (la interfaz AuthUser se mantiene igual)
export interface AuthUser {
  id: number;
  email: string;
  // 👇 Actualiza esta línea
  role: "CUSTOMER" | "RESTAURANT_ADMIN" | "SUPER_ADMIN";
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoggingOut: boolean;
  isLoading: boolean;
  // 👇 MODIFICACIÓN CLAVE AQUÍ 👇
  login: (
    type: "customer" | "admin", // 👈 Añadimos un parámetro para el tipo de login
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
