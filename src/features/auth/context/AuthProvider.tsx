// src/features/auth/context/AuthProvider.tsx
import {
  useState,
  useEffect,
  type ReactNode,
  useCallback,
  useMemo,
} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, type AuthUser } from "./AuthContext";
import { loginCustomer, loginAdmin, logoutUser } from "../services/authService";
import { decodeJwt } from "@/lib/jwt";
import { resetApiController } from "@/lib/apiSignal";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = decodeJwt(token) as {
          sub: string;
          email: string;
          roles: string[];
        };
        setUser({
          id: Number(decoded.sub),
          email: decoded.email,
          role: decoded.roles[0] as AuthUser["role"],
        });
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (type: "customer" | "admin", email: string, password: string) => {
      const loginFunction = type === "customer" ? loginCustomer : loginAdmin;
      const response = await loginFunction({ email, password });
      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const decoded = decodeJwt(accessToken) as {
        sub: string;
        email: string;
        roles: string[];
      };

      // Creamos el objeto del usuario
      const authenticatedUser: AuthUser = {
        id: Number(decoded.sub),
        email: decoded.email,
        role: decoded.roles[0] as AuthUser["role"],
      };

      // Establecemos el estado
      setUser(authenticatedUser);
      
      // --- 👇 ESTE ES EL ÚNICO CAMBIO REALIZADO 👇 ---
      // Devolvemos el objeto del usuario para que la página de login pueda usarlo
      return authenticatedUser;
    },
    []
  );


  const logout = useCallback(async (allSessions = false) => {
    resetApiController();
    setIsLoggingOut(true);

    const isAdmin =
      user?.role === "RESTAURANT_ADMIN" || user?.role === "SUPER_ADMIN";
    const logoutRedirectPath = isAdmin ? "/admin/login" : "/login/customer";

    navigate(logoutRedirectPath);
    const currentRefreshToken = localStorage.getItem("refreshToken");

    try {
      if (currentRefreshToken) {
        await logoutUser({ refreshToken: currentRefreshToken }, allSessions);
      }
    } catch (error) {
      console.error("Falló el logout en el servidor:", error);
    } finally {
      setTimeout(() => {
        setUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsLoggingOut(false);
      }, 15);
    }
  }, [user, navigate]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      isLoggingOut,
      login,
      logout,
    }),
    [user, isLoading, isLoggingOut, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
