// src/router/LandingPage.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function LandingPage() {
  const { user, isAuthenticated, isLoading, isLoggingOut } = useAuth();

  if (isLoading || isLoggingOut) {
    return <div className="flex h-screen items-center justify-center">Cargando...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login/customer" replace />;
  }

  // 👇 CAMBIO: Lógica de redirección específica por rol
  switch (user.role) {
    case "CUSTOMER":
      return <Navigate to="/marketplace" replace />;
    case "SUPER_ADMIN":
      return <Navigate to="/admin/dashboard" replace />;
    case "RESTAURANT_ADMIN":
      return <Navigate to="/admin/my-restaurant" replace />;
    default:
      // Fallback por si acaso, aunque no debería ocurrir
      return <Navigate to="/login/customer" replace />;
  }
}
