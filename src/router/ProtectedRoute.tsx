// src/router/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { JSX } from 'react';
import type { AuthUser } from "@/features/auth/context/AuthContext";

interface Props {
  children: JSX.Element;
  allowedRoles: AuthUser['role'][];
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  // 👇 1. OBTÉN EL NUEVO ESTADO
  const { user, isAuthenticated, isLoading, isLoggingOut } = useAuth();
  const location = useLocation();

  // 👇 2. MODIFICA LA CONDICIÓN DE CARGA
  // Ahora también mostrará "Cargando..." mientras se cierra la sesión
  if (isLoading || isLoggingOut) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  // ... (el resto de la lógica se mantiene exactamente igual)
  if (!isAuthenticated || !user) {
    return <Navigate to="/login/customer" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const isAdmin = user.role === "RESTAURANT_ADMIN" || user.role === "SUPER_ADMIN";
    const targetDashboard = isAdmin ? "/admin/dashboard" : "/dashboard";
    return <Navigate to={targetDashboard} replace />;
  }

  return children;
}