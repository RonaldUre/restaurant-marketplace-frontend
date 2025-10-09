// src/router/LandingPage.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function LandingPage() {
  // 👇 1. OBTÉN EL NUEVO ESTADO
  const { user, isAuthenticated, isLoading, isLoggingOut } = useAuth();

  // 👇 2. MODIFICA LA CONDICIÓN DE CARGA
  if (isLoading || isLoggingOut) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login/customer" replace />;
  }

  const isAdmin = user.role === "RESTAURANT_ADMIN" || user.role === "SUPER_ADMIN";
  const targetDashboard = isAdmin ? "/admin/dashboard" : "/dashboard";

  return <Navigate to={targetDashboard} replace />;
}