// src/features/auth/context/AuthProvider.tsx
import {
  useState,
  useEffect,
  type ReactNode,
  useCallback,
  useMemo,
} from "react"; // 👈 1. Importa useCallback y useMemo
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

  // useEffect se simplifica: solo decodifica el token si existe.
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
        // Limpia en caso de token inválido
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    }
    setIsLoading(false);
  }, []);

  // 👇 2. Envuelve las funciones en useCallback
  const login = useCallback(
    async (type: "customer" | "admin", email: string, password: string) => {
      // 1. Llama a la API para obtener el token
      const loginFunction = type === "customer" ? loginCustomer : loginAdmin;
      const response = await loginFunction({ email, password });
      const { accessToken, refreshToken } = response.data;

      // 2. Guarda los tokens y configura Axios
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // 3. Decodifica el token y establece el usuario directamente
      const decoded = decodeJwt(accessToken) as {
        sub: string;
        email: string;
        roles: string[];
      };
      setUser({
        id: Number(decoded.sub),
        email: decoded.email,
        role: decoded.roles[0] as AuthUser["role"],
      });
    },
    []
  ); // El array vacío significa que esta función nunca cambiará


  const logout = useCallback(async (allSessions = false) => {

    //Aborta todas las peticiones en curso ANTES de hacer cualquier otra cosa.
    resetApiController();

    setIsLoggingOut(true);

    const isAdmin =
      user?.role === "RESTAURANT_ADMIN" || user?.role === "SUPER_ADMIN";
    const logoutRedirectPath = isAdmin ? "/admin/login" : "/login/customer";

    // Inicia la navegación de inmediato para una UX fluida
    navigate(logoutRedirectPath);

    // Obtén el refresh token ANTES de limpiar el localStorage
    const currentRefreshToken = localStorage.getItem("refreshToken");

    try {
      if (currentRefreshToken) {
        // 👇 Llama al endpoint del backend para invalidar el token
        await logoutUser({ refreshToken: currentRefreshToken }, allSessions);
      }
    } catch (error) {
      // Opcional: puedes loguear el error, pero no deberías detener
      // el proceso de logout del cliente por esto.
      console.error("Falló el logout en el servidor:", error);
    } finally {
      // Usa un pequeño timeout para que la navegación complete la transición
      // antes de que el estado de autenticación cambie.
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
      isLoggingOut, // 👈 2. EXPONE EL ESTADO
      login,
      logout,
    }),
    [user, isLoading, isLoggingOut, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
